import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const PAGES_DIR = './pages'
const KO_DIR = path.join(PAGES_DIR, 'ko')

function createKoFolder() {
  console.log('🔧 Creating temporary ko folder for development...')

  if (!fs.existsSync(KO_DIR)) {
    fs.mkdirSync(KO_DIR, { recursive: true })
  }

  const koMetaContent = `export default {
  index: '홈',
  about: '소개',
  web: '웹 개발',
  git: 'Git',
  cloud: '클라우드',
  css: 'CSS',
  datadog: 'Datadog',
  'design-system': '디자인 시스템',
  ft_seoul: '42Seoul',
  codeSpitz: 'CodeSpitz',
  book: '도서'
}`

  fs.writeFileSync(path.join(KO_DIR, '_meta.ts'), koMetaContent)

  const indexContent = fs.readFileSync(path.join(PAGES_DIR, 'index.mdx'), 'utf8')
  fs.writeFileSync(path.join(KO_DIR, 'index.mdx'), indexContent)

  const aboutContent = fs.readFileSync(path.join(PAGES_DIR, 'about.mdx'), 'utf8')
  fs.writeFileSync(path.join(KO_DIR, 'about.mdx'), aboutContent)

  console.log('✅ Temporary ko folder created')
}

function removeKoFolder() {
  if (fs.existsSync(KO_DIR)) {
    fs.rmSync(KO_DIR, { recursive: true, force: true })
  }
}

// 개발 서버 시작
createKoFolder()

const devProcess = spawn('next', ['dev'], { stdio: 'inherit' })

// 프로세스 종료 시 ko 폴더 삭제
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down dev server...')
  removeKoFolder()
  devProcess.kill()
  process.exit()
})

process.on('SIGTERM', () => {
  removeKoFolder()
  devProcess.kill()
  process.exit()
})

devProcess.on('close', (code) => {
  removeKoFolder()
  process.exit(code)
})
