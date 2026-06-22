#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");

const packageRoot = path.resolve(__dirname, "..");
const cwd = process.cwd();

function log(message) {
  console.log(message);
}

function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyFileIfMissing(source, target, options = {}) {
  if (exists(target) && !options.force) {
    log(`跳过已存在文件：${path.relative(cwd, target)}`);
    return false;
  }

  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
  log(`${exists(target) && options.force ? "覆盖" : "创建"}：${path.relative(cwd, target)}`);
  return true;
}

function copyDirIfMissing(sourceDir, targetDir, options = {}) {
  if (!exists(sourceDir)) return;

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const source = path.join(sourceDir, entry.name);
    const target = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirIfMissing(source, target, options);
    } else if (entry.isFile()) {
      copyFileIfMissing(source, target, options);
    }
  }
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || cwd,
    stdio: options.stdio || "inherit",
    shell: false
  });

  return result.status === 0;
}

function commandExists(command) {
  const result = spawnSync("sh", ["-lc", `command -v ${command}`], {
    stdio: "ignore"
  });
  return result.status === 0;
}

function installSkill() {
  const sourceDir = path.join(packageRoot, "skills", "ai-development-standards");
  const targetDir = path.join(process.env.CODEX_HOME || path.join(os.homedir(), ".codex"), "skills", "ai-development-standards");

  if (!exists(path.join(sourceDir, "SKILL.md"))) {
    fail(`缺少 skill 源文件：${sourceDir}`);
  }

  fs.rmSync(targetDir, { recursive: true, force: true });
  ensureDir(path.dirname(targetDir));
  fs.cpSync(sourceDir, targetDir, { recursive: true });
  log(`已安装 ai-development-standards skill：${targetDir}`);
}

function setupRtk() {
  if (!commandExists("rtk")) {
    if (commandExists("brew")) {
      log("未检测到 RTK，使用 Homebrew 安装：brew install rtk");
      if (!run("brew", ["install", "rtk"])) {
        log("RTK 安装失败。后续请使用普通命令并控制输出长度。");
        return;
      }
    } else {
      log("未检测到 RTK，也未检测到 Homebrew。可手动安装：");
      log("curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh");
      return;
    }
  }

  log("初始化 RTK 项目说明。");
  run("rtk", ["init", "--codex"], { cwd });

  const rtkSource = path.join(packageRoot, "RTK.md");
  const rtkTarget = path.join(cwd, "RTK.md");
  if (exists(rtkSource)) {
    copyFileIfMissing(rtkSource, rtkTarget, { force: true });
  }
}

function initProject(options = {}) {
  log("== AI 开发规范初始化 ==");
  log(`目标目录：${cwd}`);

  copyFileIfMissing(path.join(packageRoot, "AGENTS.md"), path.join(cwd, "AGENTS.md"), options);
  copyFileIfMissing(path.join(packageRoot, "standards-upstream.example.json"), path.join(cwd, "standards-upstream.example.json"), options);

  copyDirIfMissing(path.join(packageRoot, "docs", "process"), path.join(cwd, "docs", "process"), options);
  copyDirIfMissing(path.join(packageRoot, "docs", "agents"), path.join(cwd, "docs", "agents"), options);
  copyDirIfMissing(path.join(packageRoot, "docs", "security"), path.join(cwd, "docs", "security"), options);
  copyDirIfMissing(path.join(packageRoot, "docs", "release"), path.join(cwd, "docs", "release"), options);
  copyDirIfMissing(path.join(packageRoot, "docs", "workflows"), path.join(cwd, "docs", "workflows"), options);
  copyDirIfMissing(path.join(packageRoot, "templates"), path.join(cwd, "templates"), options);

  const statusBoard = path.join(packageRoot, "docs", "agents", "PROJECT_STATUS_BOARD.md");
  copyFileIfMissing(statusBoard, path.join(cwd, "PROJECT_PROGRESS.md"), options);

  const upstreamConfig = path.join(packageRoot, "templates", "STANDARDS_UPSTREAM_CONFIG.json");
  copyFileIfMissing(upstreamConfig, path.join(cwd, "docs", "process", "STANDARDS_UPSTREAM_CONFIG.json"), options);

  installSkill();

  if (options.skipRtk) {
    log("已跳过 RTK 初始化。");
  } else {
    setupRtk();
  }

  log("");
  log("初始化完成。");
  log("下一步：请描述你的项目需求、目标用户、核心功能、技术偏好和交付形式。");
  log("后续除代码、命令、路径、API 字段、配置项和专有名词外，默认使用简体中文。");
}

function checkKit() {
  const required = [
    "README.md",
    "AGENTS.md",
    "docs/AI_BOOTSTRAP.md",
    "docs/process/LANGUAGE_POLICY.md",
    "docs/process/AI_WORKFLOW_FACTORY.md",
    "docs/process/ENGINEERING_WORKFLOW.md",
    "docs/workflows/WORKFLOW_TEMPLATE.md",
    "skills/ai-development-standards/SKILL.md",
    "templates/STANDARDS_UPSTREAM_CONFIG.json"
  ];

  let ok = true;
  for (const relative of required) {
    const filePath = path.join(packageRoot, relative);
    if (exists(filePath)) {
      log(`OK ${relative}`);
    } else {
      ok = false;
      console.error(`MISSING ${relative}`);
    }
  }

  if (!ok) process.exit(1);
  log("规范包完整性检查通过。");
}

function usage() {
  log(`用法：
  npx ai-development-standards-kit init [--force] [--skip-rtk]
  npx ai-development-standards-kit install-skill
  npx ai-development-standards-kit setup-rtk
  npx ai-development-standards-kit check
  npx ai-development-standards-kit version

说明：
  init          在当前项目目录生成中文 AI 开发规范、状态看板和工作流模板
  install-skill 安装 Codex skill 到 ~/.codex/skills
  setup-rtk     初始化 RTK 上下文压缩工具
  check         检查 npm 包内规范文件是否完整
  --force       覆盖已存在的规范文件
  --skip-rtk    初始化时跳过 RTK
`);
}

const args = process.argv.slice(2);
const command = args[0] || "help";
const options = {
  force: args.includes("--force"),
  skipRtk: args.includes("--skip-rtk")
};

switch (command) {
  case "init":
    initProject(options);
    break;
  case "install-skill":
    installSkill();
    break;
  case "setup-rtk":
    setupRtk();
    break;
  case "check":
    checkKit();
    break;
  case "version": {
    const pkg = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
    log(pkg.version);
    break;
  }
  case "help":
  case "--help":
  case "-h":
    usage();
    break;
  default:
    usage();
    fail(`未知命令：${command}`);
}
