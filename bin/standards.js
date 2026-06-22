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

function writeFileIfMissing(target, content, options = {}) {
  if (exists(target) && !options.force) {
    log(`跳过已存在文件：${path.relative(cwd, target)}`);
    return false;
  }

  ensureDir(path.dirname(target));
  fs.writeFileSync(target, content);
  log(`${exists(target) && options.force ? "覆盖" : "创建"}：${path.relative(cwd, target)}`);
  return true;
}

function readTemplate(relativePath) {
  return fs.readFileSync(path.join(packageRoot, relativePath), "utf8");
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || cwd,
    env: options.env || process.env,
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

function readPackage() {
  return JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
}

function compareVersions(left, right) {
  const normalize = (value) => String(value).replace(/^[^\d]*/, "").split(/[.-]/).map((part) => {
    const parsed = Number.parseInt(part, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  });
  const a = normalize(left);
  const b = normalize(right);
  const length = Math.max(a.length, b.length);

  for (let index = 0; index < length; index += 1) {
    const current = a[index] || 0;
    const next = b[index] || 0;
    if (current > next) return 1;
    if (current < next) return -1;
  }

  return 0;
}

function checkForUpdate() {
  const pkg = readPackage();
  const result = spawnSync("npm", ["view", pkg.name, "version", "--json"], {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: false
  });

  if (result.status !== 0) {
    console.error("无法查询 npm 最新版本。请检查网络、npm registry 或登录状态。");
    if (result.stderr) console.error(result.stderr.trim());
    process.exit(1);
  }

  const latest = result.stdout.trim().replace(/^"|"$/g, "");
  const comparison = compareVersions(pkg.version, latest);

  log(`当前版本：${pkg.version}`);
  log(`最新版本：${latest}`);

  if (comparison < 0) {
    log("");
    log("发现新版本。建议升级：");
    log(`npm install -g ${pkg.name}@latest`);
    return;
  }

  if (comparison > 0) {
    log("");
    log("当前本地版本高于 npm latest，可能是本地开发版或预发布版本。");
    return;
  }

  log("");
  log("当前已经是最新版本。");
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

function agencyAgentsCacheDir() {
  return path.join(os.homedir(), ".cache", "ai-development-standards-kit", "agency-agents");
}

function agencyAgentsInstallDir() {
  return process.env.CODEX_AGENTS_DIR || path.join(process.env.CODEX_HOME || path.join(os.homedir(), ".codex"), "agents");
}

function setupAgencyAgents(options = {}) {
  const repoUrl = "https://github.com/msitarzewski/agency-agents.git";
  const cacheDir = agencyAgentsCacheDir();
  const codexAgentsDir = agencyAgentsInstallDir();

  if (!commandExists("git")) {
    log("未检测到 git，无法自动安装 agency-agents。后续将仅使用本项目内置角色编排规范。");
    return false;
  }

  ensureDir(path.dirname(cacheDir));

  if (exists(path.join(cacheDir, ".git"))) {
    log(`更新 agency-agents 缓存：${cacheDir}`);
    if (!run("git", ["pull", "--ff-only"], { cwd: cacheDir })) {
      log("agency-agents 更新失败。将尝试使用现有缓存继续安装。");
    }
  } else {
    if (exists(cacheDir)) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
    }
    log(`下载 agency-agents：${repoUrl}`);
    if (!run("git", ["clone", "--depth", "1", repoUrl, cacheDir])) {
      log("agency-agents 下载失败。后续将仅使用本项目内置角色编排规范。");
      return false;
    }
  }

  const convertScript = path.join(cacheDir, "scripts", "convert.sh");
  const installScript = path.join(cacheDir, "scripts", "install.sh");

  if (!exists(convertScript) || !exists(installScript)) {
    log("agency-agents 缓存缺少官方安装脚本。后续将仅使用本项目内置角色编排规范。");
    return false;
  }

  log("转换 agency-agents 为 Codex custom agent 格式。");
  if (!run("bash", [convertScript, "--tool", "codex"], { cwd: cacheDir })) {
    log("agency-agents 转换失败。后续将仅使用本项目内置角色编排规范。");
    return false;
  }

  ensureDir(codexAgentsDir);
  log(`安装 agency-agents 到 Codex agents 目录：${codexAgentsDir}`);
  const installArgs = [installScript, "--tool", "codex", "--no-interactive"];
  if (options.dryRun) installArgs.push("--dry-run");

  if (!run("bash", installArgs, {
    cwd: cacheDir,
    env: {
      ...process.env,
      CODEX_AGENTS_DIR: codexAgentsDir
    }
  })) {
    log("agency-agents 安装失败。后续将仅使用本项目内置角色编排规范。");
    return false;
  }

  const count = exists(codexAgentsDir)
    ? fs.readdirSync(codexAgentsDir).filter((file) => file.endsWith(".toml")).length
    : 0;

  log(`agency-agents 安装完成。Codex agents 目录当前包含 ${count} 个 .toml agent 文件。`);
  return true;
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

  const aiRules = readTemplate("templates/AI_AGENT_RULES.md");
  writeFileIfMissing(path.join(cwd, "CLAUDE.md"), aiRules, options);
  writeFileIfMissing(path.join(cwd, "GEMINI.md"), aiRules, options);
  writeFileIfMissing(path.join(cwd, ".cursor", "rules", "ai-development-standards.mdc"), aiRules, options);
  writeFileIfMissing(path.join(cwd, ".github", "copilot-instructions.md"), aiRules, options);

  const statusBoard = path.join(packageRoot, "docs", "agents", "PROJECT_STATUS_BOARD.md");
  copyFileIfMissing(statusBoard, path.join(cwd, "PROJECT_PROGRESS.md"), options);

  const upstreamConfig = path.join(packageRoot, "templates", "STANDARDS_UPSTREAM_CONFIG.json");
  copyFileIfMissing(upstreamConfig, path.join(cwd, "docs", "process", "STANDARDS_UPSTREAM_CONFIG.json"), options);

  installSkill();

  if (options.skipAgencyAgents) {
    log("已跳过 agency-agents 安装。");
  } else {
    setupAgencyAgents();
  }

  if (options.skipRtk) {
    log("已跳过 RTK 初始化。");
  } else {
    setupRtk();
  }

  log("");
  log("初始化完成。");
  log("已生成 AI 强制执行入口。后续 AI 必须先读取 AGENTS.md 和 docs/process/AI_ENFORCEMENT.md 再执行任务。");
  log("建议先运行：standards guard");
  log("下一步：请描述你的项目需求、目标用户、核心功能、技术偏好和交付形式。");
  log("后续除代码、命令、路径、API 字段、配置项和专有名词外，默认使用简体中文。");
}

function checkKit() {
  const required = [
    "README.md",
    "AGENTS.md",
    "docs/AI_BOOTSTRAP.md",
    "docs/process/LANGUAGE_POLICY.md",
    "docs/process/AI_ENFORCEMENT.md",
    "docs/process/AI_WORKFLOW_FACTORY.md",
    "docs/process/ENGINEERING_WORKFLOW.md",
    "docs/process/TECH_DECISION.md",
    "docs/agents/AGENT_ORCHESTRATION.md",
    "docs/workflows/WORKFLOW_TEMPLATE.md",
    "skills/ai-development-standards/SKILL.md",
    "templates/AI_AGENT_RULES.md",
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

function guardProject() {
  const required = [
    "AGENTS.md",
    "docs/process/AI_ENFORCEMENT.md",
    "docs/process/DEVELOPMENT_STANDARDS.md",
    "docs/process/ENGINEERING_WORKFLOW.md",
    "docs/process/MINIMAL_IMPLEMENTATION.md",
    "docs/process/TECH_DECISION.md",
    "docs/process/QA_STRATEGY.md",
    "docs/process/LANGUAGE_POLICY.md",
    "PROJECT_PROGRESS.md",
    "CLAUDE.md",
    "GEMINI.md",
    ".cursor/rules/ai-development-standards.mdc",
    ".github/copilot-instructions.md"
  ];

  const recommended = [
    "docs/security/SECURITY_BASELINE.md",
    "docs/release/RELEASE_CHECKLIST.md",
    "docs/agents/MAIN_SESSION_CONTROL.md",
    "docs/agents/AGENT_ORCHESTRATION.md",
    "docs/agents/SPECIALIST_DELIVERABLES.md",
    "docs/workflows/WORKFLOW_TEMPLATE.md",
    "docs/process/STANDARDS_UPSTREAM_CONFIG.json"
  ];

  let ok = true;
  log("== AI 开发规范强制约束检查 ==");

  for (const relative of required) {
    if (exists(path.join(cwd, relative))) {
      log(`OK ${relative}`);
    } else {
      ok = false;
      console.error(`MISSING ${relative}`);
    }
  }

  for (const relative of recommended) {
    if (exists(path.join(cwd, relative))) {
      log(`OK ${relative}`);
    } else {
      console.error(`WARN ${relative}`);
    }
  }

  if (!ok) {
    console.error("");
    console.error("强制约束不完整。请运行：standards init");
    console.error("如需覆盖旧规则，请运行：standards init --force");
    process.exit(1);
  }

  log("");
  log("强制约束检查通过。AI 应先读取 AGENTS.md 和 docs/process/AI_ENFORCEMENT.md，再开始任何任务。");
}

function usage() {
  log(`用法：
  npx ai-development-standards-kit init [--force] [--skip-rtk] [--skip-agency-agents]
  npx ai-development-standards-kit install-skill
  npx ai-development-standards-kit setup-agency-agents
  npx ai-development-standards-kit setup-rtk
  npx ai-development-standards-kit check
  npx ai-development-standards-kit guard
  npx ai-development-standards-kit update-check
  npx ai-development-standards-kit version

说明：
  init          在当前项目目录生成中文 AI 开发规范、状态看板和工作流模板
  install-skill 安装 Codex skill 到 ~/.codex/skills
  setup-agency-agents 安装 agency-agents 到 ~/.codex/agents
  setup-rtk     初始化 RTK 上下文压缩工具
  check         检查 npm 包内规范文件是否完整
  guard         检查当前项目是否具备 AI 强制执行规范入口
  update-check  检查 npm 是否有新版本可升级
  --force       覆盖已存在的规范文件
  --skip-rtk    初始化时跳过 RTK
  --skip-agency-agents 初始化时跳过 agency-agents
`);
}

const args = process.argv.slice(2);
const command = args[0] || "help";
const options = {
  force: args.includes("--force"),
  skipRtk: args.includes("--skip-rtk"),
  skipAgencyAgents: args.includes("--skip-agency-agents")
};

switch (command) {
  case "init":
    initProject(options);
    break;
  case "install-skill":
    installSkill();
    break;
  case "setup-agency-agents":
    setupAgencyAgents();
    break;
  case "setup-rtk":
    setupRtk();
    break;
  case "check":
    checkKit();
    break;
  case "guard":
    guardProject();
    break;
  case "update-check":
  case "upgrade-check":
    checkForUpdate();
    break;
  case "version": {
    const pkg = readPackage();
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
