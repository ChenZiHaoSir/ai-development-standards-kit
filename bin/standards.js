#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");
const readline = require("readline");

const packageRoot = path.resolve(__dirname, "..");
const cwd = process.cwd();

// ─────────────────────────────────────────────
// 通用工具
// ─────────────────────────────────────────────

function log(msg) {
  console.log(msg);
}

function fail(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

function exists(f) { return fs.existsSync(f); }

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }

function copyFileIfMissing(src, tgt, opts = {}) {
  if (exists(tgt) && !opts.force) {
    log(`  跳过（已存在）：${path.relative(cwd, tgt)}`);
    return false;
  }
  ensureDir(path.dirname(tgt));
  fs.copyFileSync(src, tgt);
  log(`  ${exists(tgt) && opts.force ? "覆盖" : "创建"}：${path.relative(cwd, tgt)}`);
  return true;
}

function copyDirIfMissing(srcDir, tgtDir, opts = {}) {
  if (!exists(srcDir)) return;
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const tgt = path.join(tgtDir, entry.name);
    if (entry.isDirectory()) {
      copyDirIfMissing(src, tgt, opts);
    } else {
      copyFileIfMissing(src, tgt, opts);
    }
  }
}

function writeFileIfMissing(tgt, content, opts = {}) {
  if (exists(tgt) && !opts.force) {
    log(`  跳过（已存在）：${path.relative(cwd, tgt)}`);
    return false;
  }
  ensureDir(path.dirname(tgt));
  fs.writeFileSync(tgt, content);
  log(`  ${exists(tgt) && opts.force ? "覆盖" : "创建"}：${path.relative(cwd, tgt)}`);
  return true;
}

function readTemplate(relPath) {
  return fs.readFileSync(path.join(packageRoot, relPath), "utf8");
}

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    cwd: opts.cwd || cwd,
    env: opts.env || process.env,
    stdio: opts.stdio || "inherit",
    shell: false
  });
  return result.status === 0;
}

function commandExists(cmd) {
  const r = spawnSync("sh", ["-lc", `command -v ${cmd}`], { stdio: "ignore" });
  return r.status === 0;
}

function readPackage() {
  return JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
}

function maskSecret(v) {
  if (!v || v.length <= 8) return "****";
  return `${v.slice(0, 4)}****${v.slice(-4)}`;
}

// ─────────────────────────────────────────────
// 版本检查
// ─────────────────────────────────────────────

function compareVersions(left, right) {
  const norm = (s) => String(s).replace(/^[^\d]*/, "").split(/[.-]/).map((p) => {
    const n = Number.parseInt(p, 10);
    return Number.isNaN(n) ? 0 : n;
  });
  const a = norm(left), b = norm(right);
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if ((a[i] || 0) > (b[i] || 0)) return 1;
    if ((a[i] || 0) < (b[i] || 0)) return -1;
  }
  return 0;
}

function checkForUpdate() {
  const pkg = readPackage();
  const r = spawnSync("npm", ["view", pkg.name, "version", "--json"], {
    cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], shell: false
  });
  if (r.status !== 0) {
    console.error("无法查询 npm 最新版本，请检查网络和 npm registry 配置。");
    process.exit(1);
  }
  const latest = r.stdout.trim().replace(/^"|"$/g, "");
  const cmp = compareVersions(pkg.version, latest);
  log(`当前版本：${pkg.version}`);
  log(`最新版本：${latest}`);
  if (cmp < 0) {
    log("");
    log("发现新版本，建议升级：");
    log(`  npm install -g ${pkg.name}@latest`);
  } else if (cmp > 0) {
    log("");
    log("当前本地版本高于 npm latest，可能为本地开发版。");
  } else {
    log("已是最新版本。");
  }
}

// ─────────────────────────────────────────────
// 本地工具配置
// ─────────────────────────────────────────────

function getLocalToolConfigs() {
  const home = os.homedir();
  const candidates = [
    path.join(home, ".Codex", "skills", "gstack", "design", "dist", "design"),
    path.join(home, ".codex", "skills", "gstack", "design", "dist", "design"),
    path.join(home, ".agents", "skills", "gstack", "design", "dist", "design")
  ];
  return [{
    id: "gstack-design-image",
    name: "gstack UI 设计稿/生图工具",
    detected: candidates.some(exists),
    configPath: path.join(home, ".gstack", "openai.json"),
    description: "用于 UI 设计稿、生图、视觉探索等。需配置 GRSAI 或 OpenAI API Key。",
    candidates
  }];
}

function writeJsonSecret(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, { mode: 0o600 });
  try { fs.chmodSync(filePath, 0o600); } catch (_) {}
}

function createPrompt() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return {
    async ask(q) { return new Promise((res) => rl.question(q, (a) => res(a.trim()))); },
    close() { rl.close(); }
  };
}

async function configureGstackDesign(tool) {
  const prompt = createPrompt();
  try {
    log("");
    log(`检测到：${tool.name}`);
    log(tool.description);
    log(`配置文件将写入：${tool.configPath}`);
    log("说明：此文件保存在用户主目录，不会进入项目仓库或 npm 包。");

    const ans = await prompt.ask("是否现在配置 API Key？[y/N] ");
    if (!/^y(es)?$/i.test(ans)) {
      log("已跳过。后续可运行：npx ai-development-standards-kit setup-local-config");
      return false;
    }

    log("");
    log("请选择服务商：");
    log("  1. GRSAI 国内地址（推荐国内网络）https://grsai.dakka.com.cn");
    log("  2. GRSAI 海外地址                      https://grsaiapi.com");
    log("  3. OpenAI 官方兼容                     https://api.openai.com");
    const choice = await prompt.ask("请输入 1/2/3 [1]：") || "1";

    let config;
    if (choice === "2") {
      config = { provider: "grsai", base_url: "https://grsaiapi.com", model: "gpt-image-2" };
    } else if (choice === "3") {
      config = { provider: "openai", base_url: "https://api.openai.com", model: "gpt-image-1" };
    } else {
      config = { provider: "grsai", base_url: "https://grsai.dakka.com.cn", model: "gpt-image-2" };
    }

    log("");
    const apiKey = await prompt.ask("请输入 API Key：");
    if (!apiKey) {
      log("未输入，已跳过。");
      return false;
    }

    writeJsonSecret(tool.configPath, { ...config, api_key: apiKey });
    log(`配置已保存。Key：${maskSecret(apiKey)}`);
    return true;
  } finally {
    prompt.close();
  }
}

async function setupLocalConfig(opts = {}) {
  const tools = getLocalToolConfigs();

  log("");
  log("【步骤 5/5】检查本机可选工具密钥配置");
  log("─────────────────────────────────────");
  log("本步骤仅处理本机密钥，不会将任何密钥写入项目目录。");

  for (const tool of tools) {
    const hasConfig = exists(tool.configPath);
    const status = hasConfig ? "✅ 已配置" : tool.detected ? "⚠️  已检测到工具，未配置" : "⭕  未检测到工具";
    log(`  ${tool.name}：${status}`);
  }

  const needConfig = tools.filter((t) => t.detected || exists(t.configPath) || opts.force);
  if (needConfig.length === 0) {
    log("");
    log("未检测到需要配置密钥的工具。后续安装生图/部署/云服务后，可运行：");
    log("  npx ai-development-standards-kit setup-local-config");
    return;
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    log("");
    log("当前非交互式终端，已跳过密钥输入。需配置时请运行：");
    log("  npx ai-development-standards-kit setup-local-config");
    return;
  }

  for (const tool of needConfig) {
    if (exists(tool.configPath) && !opts.force) {
      log(`${tool.name} 已有配置。如需重新配置请加 --force：`);
      log(`  npx ai-development-standards-kit setup-local-config --force`);
      continue;
    }
    if (tool.id === "gstack-design-image") {
      await configureGstackDesign(tool);
    }
  }
}

// ─────────────────────────────────────────────
// Skill 安装
// ─────────────────────────────────────────────

function installSkill() {
  const src = path.join(packageRoot, "skills", "ai-development-standards");
  const tgt = path.join(process.env.CODEX_HOME || path.join(os.homedir(), ".codex"), "skills", "ai-development-standards");
  if (!exists(path.join(src, "SKILL.md"))) { fail(`缺少 skill 源文件：${src}`); }
  fs.rmSync(tgt, { recursive: true, force: true });
  ensureDir(path.dirname(tgt));
  fs.cpSync(src, tgt, { recursive: true });
  log(`  Codex skill 已安装：${tgt}`);
}

// ─────────────────────────────────────────────
// RTK
// ─────────────────────────────────────────────

function setupRtk() {
  log("");
  log("【步骤 3/5】初始化 RTK 上下文压缩工具");
  log("─────────────────────────────────────");
  if (!commandExists("rtk")) {
    if (commandExists("brew")) {
      log("未检测到 RTK，正在通过 Homebrew 安装（macOS）...");
      if (!run("brew", ["install", "rtk"])) {
        log("RTK 安装失败，将使用普通命令替代。");
        return;
      }
    } else {
      log("未检测到 RTK，也未检测到 Homebrew（macOS 包管理器）。");
      log("手动安装方式：");
      log("  curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh");
      return;
    }
  }
  run("rtk", ["init", "--codex"], { cwd });
  const rtkSrc = path.join(packageRoot, "RTK.md");
  const rtkTgt = path.join(cwd, "RTK.md");
  if (exists(rtkSrc)) { copyFileIfMissing(rtkSrc, rtkTgt, { force: true }); }
}

// ─────────────────────────────────────────────
// agency-agents
// ─────────────────────────────────────────────

function agencyAgentsCacheDir() {
  return path.join(os.homedir(), ".cache", "ai-development-standards-kit", "agency-agents");
}

function agencyAgentsInstallDir() {
  return process.env.CODEX_AGENTS_DIR ||
    path.join(process.env.CODEX_HOME || path.join(os.homedir(), ".codex"), "agents");
}

function setupAgencyAgents() {
  log("");
  log("【步骤 2/5】安装 agency-agents 专业智能体");
  log("─────────────────────────────────────");
  const repoUrl = "https://github.com/msitarzewski/agency-agents.git";
  const cacheDir = agencyAgentsCacheDir();
  const codexAgentsDir = agencyAgentsInstallDir();

  if (!commandExists("git")) {
    log("未检测到 git，将跳过 agency-agents 安装（不影响规范使用）。");
    return;
  }

  ensureDir(path.dirname(cacheDir));
  if (exists(path.join(cacheDir, ".git"))) {
    log("更新 agency-agents 缓存中...");
    if (!run("git", ["pull", "--ff-only"], { cwd: cacheDir })) {
      log("更新失败，将使用现有缓存继续。");
    }
  } else {
    if (exists(cacheDir)) fs.rmSync(cacheDir, { recursive: true, force: true });
    log("下载 agency-agents...");
    if (!run("git", ["clone", "--depth", "1", repoUrl, cacheDir])) {
      log("下载失败，将跳过（不影响规范使用）。");
      return;
    }
  }

  const convertScript = path.join(cacheDir, "scripts", "convert.sh");
  const installScript = path.join(cacheDir, "scripts", "install.sh");
  if (!exists(convertScript) || !exists(installScript)) {
    log("agency-agents 缺少官方脚本，将跳过（不影响规范使用）。");
    return;
  }

  log("转换并安装到 Codex agents 目录...");
  if (!run("bash", [convertScript, "--tool", "codex"], { cwd: cacheDir })) {
    log("转换失败，将跳过。");
    return;
  }

  ensureDir(codexAgentsDir);
  if (!run("bash", [installScript, "--tool", "codex", "--no-interactive"], {
    cwd: cacheDir,
    env: { ...process.env, CODEX_AGENTS_DIR: codexAgentsDir }
  })) {
    log("安装失败，将跳过。");
    return;
  }

  const count = exists(codexAgentsDir)
    ? fs.readdirSync(codexAgentsDir).filter((f) => f.endsWith(".toml")).length
    : 0;
  log(`安装完成，共 ${count} 个专业智能体。`);
}

// ─────────────────────────────────────────────
// 项目初始化（主流程）
// ─────────────────────────────────────────────

async function initProject(opts = {}) {
  console.log("");
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║      AI 开发规范初始化  v" + readPackage().version.padEnd(27) + "║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log("");
  log(`目标目录：${cwd}`);
  console.log("");

  // 步骤 1：复制规范文件
  log("【步骤 1/5】复制开发规范文件");
  log("─────────────────────────────────────");
  copyFileIfMissing(path.join(packageRoot, "AGENTS.md"), path.join(cwd, "AGENTS.md"), opts);
  copyFileIfMissing(path.join(packageRoot, "standards-upstream.example.json"), path.join(cwd, "standards-upstream.example.json"), opts);

  copyDirIfMissing(path.join(packageRoot, "docs", "process"), path.join(cwd, "docs", "process"), opts);
  copyDirIfMissing(path.join(packageRoot, "docs", "agents"), path.join(cwd, "docs", "agents"), opts);
  copyDirIfMissing(path.join(packageRoot, "docs", "security"), path.join(cwd, "docs", "security"), opts);
  copyDirIfMissing(path.join(packageRoot, "docs", "release"), path.join(cwd, "docs", "release"), opts);
  copyDirIfMissing(path.join(packageRoot, "docs", "workflows"), path.join(cwd, "docs", "workflows"), opts);
  copyDirIfMissing(path.join(packageRoot, "templates"), path.join(cwd, "templates"), opts);

  const aiRules = readTemplate("templates/AI_AGENT_RULES.md");
  writeFileIfMissing(path.join(cwd, "CLAUDE.md"), aiRules, opts);
  writeFileIfMissing(path.join(cwd, "GEMINI.md"), aiRules, opts);
  writeFileIfMissing(path.join(cwd, ".cursor", "rules", "ai-development-standards.mdc"), aiRules, opts);
  writeFileIfMissing(path.join(cwd, ".github", "copilot-instructions.md"), aiRules, opts);

  const statusBoard = path.join(packageRoot, "docs", "agents", "PROJECT_STATUS_BOARD.md");
  copyFileIfMissing(statusBoard, path.join(cwd, "PROJECT_PROGRESS.md"), opts);

  const upstreamConfig = path.join(packageRoot, "templates", "STANDARDS_UPSTREAM_CONFIG.json");
  copyFileIfMissing(upstreamConfig, path.join(cwd, "docs", "process", "STANDARDS_UPSTREAM_CONFIG.json"), opts);

  // 步骤 2：agency-agents
  if (opts.skipAgencyAgents) {
    log("");
    log("已跳过 agency-agents 安装（--skip-agency-agents）");
  } else {
    await setupAgencyAgents();
  }

  // 步骤 3：RTK
  if (opts.skipRtk) {
    log("");
    log("已跳过 RTK 初始化（--skip-rtk）");
  } else {
    await setupRtk();
  }

  // 步骤 4：Skill
  log("");
  log("【步骤 4/5】安装 Codex AI 开发规范 Skill");
  log("─────────────────────────────────────");
  installSkill();

  // 步骤 5：本地工具配置
  if (opts.skipLocalConfig) {
    log("");
    log("已跳过本地工具配置（--skip-local-config）");
  } else {
    await setupLocalConfig();
  }

  // 完成总结
  console.log("");
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║                   初始化完成                  ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log("");
  log("✅ 规范文件已生成，AI 开工入口已配置");
  log("✅ 状态看板 PROJECT_PROGRESS.md 已创建");
  log("✅ Codex skill 已安装（~/.codex/skills）");
  if (!opts.skipAgencyAgents) log("✅ agency-agents 专业智能体已安装");
  if (!opts.skipRtk) log("✅ RTK 上下文压缩工具已配置");
  log("");
  log("─────────────────────────────────────────");
  log("下一步操作：");
  log("");
  log("  1. 检查规范完整性（可选）：");
  log("       npx ai-development-standards-kit guard");
  log("");
  log("  2. 检查版本更新（可选）：");
  log("       npx ai-development-standards-kit update-check");
  log("");
  log("  3. 开始项目开发：直接向 AI 描述你的项目需求，");
  log("     AI 会自动读取规范并严格按规范执行。");
  log("");
  log("  规范默认使用简体中文，除代码、命令、路径、");
  log("  API 字段、配置项外均使用中文沟通。");
  log("─────────────────────────────────────────");
}

// ─────────────────────────────────────────────
// 检查命令
// ─────────────────────────────────────────────

function checkKit() {
  const required = [
    "README.md", "AGENTS.md", "docs/AI_BOOTSTRAP.md",
    "docs/process/LANGUAGE_POLICY.md", "docs/process/AI_ENFORCEMENT.md",
    "docs/process/AI_WORKFLOW_FACTORY.md", "docs/process/ENGINEERING_WORKFLOW.md",
    "docs/process/PROJECT_LIFECYCLE.md", "docs/process/TECH_DECISION.md",
    "docs/process/PERFORMANCE_BASELINE.md", "docs/process/ACCEPTANCE_GATES.md",
    "docs/process/OBSERVABILITY_BASELINE.md", "docs/process/LOCAL_TOOL_CONFIG.md",
    "docs/release/RELEASE_PLAN.md", "docs/agents/AGENT_ORCHESTRATION.md",
    "docs/agents/AGENT_ROUTER.md", "docs/workflows/WORKFLOW_TEMPLATE.md",
    "skills/ai-development-standards/SKILL.md",
    "templates/AI_AGENT_RULES.md", "templates/STANDARDS_UPSTREAM_CONFIG.json"
  ];
  let ok = true;
  for (const rel of required) {
    const fp = path.join(packageRoot, rel);
    if (exists(fp)) log(`✅ ${rel}`);
    else { ok = false; console.error(`❌ ${rel}`); }
  }
  if (!ok) process.exit(1);
  log("规范包完整性检查通过。");
}

function guardProject() {
  const required = [
    "AGENTS.md", "docs/process/AI_ENFORCEMENT.md", "docs/process/DEVELOPMENT_STANDARDS.md",
    "docs/process/ENGINEERING_WORKFLOW.md", "docs/process/PROJECT_LIFECYCLE.md",
    "docs/process/MINIMAL_IMPLEMENTATION.md", "docs/process/TECH_DECISION.md",
    "docs/process/PERFORMANCE_BASELINE.md", "docs/process/ACCEPTANCE_GATES.md",
    "docs/process/OBSERVABILITY_BASELINE.md", "docs/process/QA_STRATEGY.md",
    "docs/process/LANGUAGE_POLICY.md", "PROJECT_PROGRESS.md",
    "CLAUDE.md", "GEMINI.md",
    ".cursor/rules/ai-development-standards.mdc", ".github/copilot-instructions.md"
  ];
  const recommended = [
    "docs/security/SECURITY_BASELINE.md", "docs/release/RELEASE_PLAN.md",
    "docs/release/RELEASE_CHECKLIST.md", "docs/agents/MAIN_SESSION_CONTROL.md",
    "docs/agents/AGENT_ORCHESTRATION.md", "docs/agents/AGENT_ROUTER.md",
    "docs/agents/SPECIALIST_DELIVERABLES.md", "docs/workflows/WORKFLOW_TEMPLATE.md",
    "docs/process/STANDARDS_UPSTREAM_CONFIG.json"
  ];
  let ok = true;
  log("== AI 开发规范强制约束检查 ==");
  for (const rel of required) {
    if (exists(path.join(cwd, rel))) log(`✅ ${rel}`);
    else { ok = false; console.error(`❌ ${rel}`); }
  }
  for (const rel of recommended) {
    if (exists(path.join(cwd, rel))) log(`⚠️  ${rel}（推荐）`);
    else console.error(`⭕ ${rel}（推荐）`);
  }
  if (!ok) {
    log("");
    log("强制约束不完整，请运行：");
    log("  npx ai-development-standards-kit init");
    log("如需覆盖旧规则，请运行：");
    log("  npx ai-development-standards-kit init --force");
    process.exit(1);
  }
  log("");
  log("强制约束检查通过。AI 应先读取 AGENTS.md 和 docs/process/AI_ENFORCEMENT.md 再开始任务。");
}

// ─────────────────────────────────────────────
// 帮助文本
// ─────────────────────────────────────────────

function usage() {
  console.log("");
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║       AI Development Standards Kit           ║");
  console.log("║       AI 开发规范包 v" + readPackage().version.padEnd(27) + "║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log("");
  log("常用命令：");
  log("");
  log("  npx ai-development-standards-kit init");
  log("    在当前项目初始化 AI 开发规范。首次使用必须运行。");
  log("");
  log("  npx ai-development-standards-kit guard");
  log("    检查当前项目是否具备 AI 强制执行规范。");
  log("");
  log("  npx ai-development-standards-kit setup-local-config");
  log("    配置本机可选工具密钥（如生图 API Key）。");
  log("");
  log("其他命令：");
  log("");
  log("  init --force                    强制覆盖已有规范文件");
  log("  init --skip-rtk                 初始化时跳过 RTK");
  log("  init --skip-agency-agents       初始化时跳过 agency-agents");
  log("  init --skip-local-config        初始化时跳过密钥配置");
  log("  install-skill                   仅安装 Codex skill");
  log("  setup-agency-agents            仅安装 agency-agents");
  log("  setup-rtk                      仅初始化 RTK");
  log("  check                          检查 npm 包内规范文件完整性");
  log("  update-check                   检查 npm 是否有新版本");
  log("  version                        显示当前版本号");
  log("");
}

// ─────────────────────────────────────────────
// 主入口
// ─────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0] || "help";
  const opts = {
    force: args.includes("--force"),
    skipRtk: args.includes("--skip-rtk"),
    skipAgencyAgents: args.includes("--skip-agency-agents"),
    skipLocalConfig: args.includes("--skip-local-config"),
    verbose: args.includes("--verbose")
  };

  switch (cmd) {
    case "init":         await initProject(opts); break;
    case "install-skill": installSkill(); break;
    case "setup-agency-agents": setupAgencyAgents(); break;
    case "setup-rtk":    setupRtk(); break;
    case "setup-local-config": await setupLocalConfig({ force: true, verbose: opts.verbose }); break;
    case "check":        checkKit(); break;
    case "guard":        guardProject(); break;
    case "update-check":
    case "upgrade-check": checkForUpdate(); break;
    case "version":      log(readPackage().version); break;
    case "help": case "--help": case "-h": usage(); break;
    default: usage(); fail(`未知命令：${cmd}`);
  }
}

main().catch((e) => {
  console.error(e && e.message ? e.message : e);
  process.exit(1);
});
