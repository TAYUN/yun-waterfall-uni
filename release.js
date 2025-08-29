const { execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')

// 颜色输出
const colors = {
  reset: '\x1B[0m',
  red: '\x1B[31m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  magenta: '\x1B[35m',
  cyan: '\x1B[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function execCommand(command, options = {}) {
  try {
    log(`执行命令: ${command}`, 'cyan')
    const result = execSync(command, {
      stdio: 'inherit',
      cwd: __dirname,
      ...options,
    })
    return result
  }
  catch (err) {
    log(`命令执行失败: ${command}`, 'red')
    log(err.message, 'red')
    process.exit(1)
  }
}

function getCurrentVersion() {
  const packagePath = path.join(__dirname, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  return packageJson.version
}

function validatePackage() {
  log('🔍 验证包配置...', 'yellow')

  const packagePath = path.join(__dirname, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

  // 检查必要字段
  const requiredFields = ['name', 'version', 'description', 'main', 'author']
  const missingFields = requiredFields.filter(field => !packageJson[field])

  if (missingFields.length > 0) {
    log(`❌ 缺少必要字段: ${missingFields.join(', ')}`, 'red')
    process.exit(1)
  }

  log('✅ 包配置验证通过', 'green')
}

function checkGitStatus() {
  log('🔍 检查Git状态...', 'yellow')

  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' })
    if (status.trim()) {
      log('❌ 工作目录不干净，请先提交所有更改', 'red')
      log('未提交的文件:', 'yellow')
      console.log(status)
      process.exit(1)
    }
  }
  catch (_err) {
    console.log('_err', _err)
    log('⚠️  无法检查Git状态，可能不在Git仓库中', 'yellow')
  }

  log('✅ Git状态检查通过', 'green')
}

function selectVersionType() {
  const readline = require('node:readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    const currentVersion = getCurrentVersion()
    log(`当前版本: ${currentVersion}`, 'blue')
    log('请选择版本更新类型:', 'yellow')
    log('1. patch (0.0.x) - 修复bug')
    log('2. minor (0.x.0) - 新功能')
    log('3. major (x.0.0) - 破坏性更改')
    log('4. 自定义版本号')

    rl.question('请输入选择 (1-4): ', (answer) => {
      rl.close()

      switch (answer.trim()) {
        case '1':
          resolve('patch')
          break
        case '2':
          resolve('minor')
          break
        case '3':
          resolve('major')
          break
        case '4': {
          const customRl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          })
          customRl.question('请输入版本号 (如: 1.0.0): ', (version) => {
            customRl.close()
            resolve(version)
          })
          break
        }
        default:
          log('无效选择，默认使用 patch', 'yellow')
          resolve('patch')
      }
    })
  })
}

function updateVersion(versionType) {
  log(`🔄 更新版本 (${versionType})...`, 'yellow')

  if (['patch', 'minor', 'major'].includes(versionType)) {
    execCommand(`npm version ${versionType} --no-git-tag-version`)
  }
  else {
    // 自定义版本号
    const packagePath = path.join(__dirname, 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    packageJson.version = versionType
    fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)
  }

  const newVersion = getCurrentVersion()
  log(`✅ 版本已更新到: ${newVersion}`, 'green')
  return newVersion
}

function buildPackage() {
  log('🔨 构建包...', 'yellow')

  // 这里可以添加实际的构建步骤
  // 比如 TypeScript 编译、文件复制等
  log('✅ 构建完成', 'green')
}

function publishPackage() {
  log('📦 发布到 NPM...', 'yellow')

  try {
    // 检查是否已登录 npm
    execCommand('npm whoami')
  }
  catch (_err) {
    console.log('_err', _err)
    log('❌ 请先登录 NPM: npm login', 'red')
    process.exit(1)
  }

  execCommand('npm publish')
  log('✅ 发布成功!', 'green')
}

function createGitTag(version) {
  log('🏷️  创建 Git 标签...', 'yellow')

  try {
    execCommand(`git add package.json`)
    execCommand(`git commit -m "chore: release v${version}"`)
    execCommand(`git tag v${version}`)
    log(`✅ Git 标签 v${version} 创建成功`, 'green')

    // 询问是否推送到远程
    const readline = require('node:readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question('是否推送到远程仓库? (y/N): ', (answer) => {
      rl.close()
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        execCommand('git push')
        execCommand('git push --tags')
        log('✅ 已推送到远程仓库', 'green')
      }
    })
  }
  catch (_err) {
    console.log('_err', _err)
    log('⚠️  Git 操作失败，但发布已完成', 'yellow')
  }
}

async function main() {
  log('🚀 开始发布流程...', 'magenta')

  try {
    // 1. 验证包配置
    validatePackage()

    // 2. 检查Git状态
    checkGitStatus()

    // 3. 选择版本类型
    const versionType = await selectVersionType()

    // 4. 更新版本
    const newVersion = updateVersion(versionType)

    // 5. 构建包
    buildPackage()

    // 6. 发布包
    publishPackage()

    // 7. 创建Git标签
    createGitTag(newVersion)

    log(`🎉 发布完成! 版本: ${newVersion}`, 'green')
    log(`📦 NPM: https://www.npmjs.com/package/yun-waterfall-uni`, 'blue')
  }
  catch (err) {
    log('❌ 发布失败:', 'red')
    log(err.message, 'red')
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
