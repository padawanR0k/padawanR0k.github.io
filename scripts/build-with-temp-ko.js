import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const PAGES_DIR = './pages'
const KO_DIR = path.join(PAGES_DIR, 'ko')

// ko 폴더 생성 함수
function createKoFolder() {
  console.log('🔧 Creating temporary ko folder...')

  if (!fs.existsSync(KO_DIR)) {
    fs.mkdirSync(KO_DIR, { recursive: true })
  }

  // ko/_meta.ts 생성
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

  // ko/index.mdx 생성 (기본 페이지와 동일한 내용)
  const indexContent = fs.readFileSync(path.join(PAGES_DIR, 'index.mdx'), 'utf8')
  fs.writeFileSync(path.join(KO_DIR, 'index.mdx'), indexContent)

  // ko/about.mdx 생성
  const aboutContent = fs.readFileSync(path.join(PAGES_DIR, 'about.mdx'), 'utf8')
  fs.writeFileSync(path.join(KO_DIR, 'about.mdx'), aboutContent)

  console.log('✅ Temporary ko folder created')
}

// ko 폴더 삭제 함수
function removeKoFolder() {
  console.log('🗑️  Removing temporary ko folder...')

  if (fs.existsSync(KO_DIR)) {
    fs.rmSync(KO_DIR, { recursive: true, force: true })
  }

  console.log('✅ Temporary ko folder removed')
}

// 메인 빌드 프로세스
async function build() {
  try {
    // 1. ko 폴더 생성
    createKoFolder()

    // 2. 빌드 실행
    console.log('🚀 Starting build process...')
    execSync('pnpm generate-sitemap && next build && next-export-optimize-images', {
      stdio: 'inherit'
    })

    console.log('✅ Build completed successfully')

  } catch (error) {
    console.error('❌ Build failed:', error.message)
    process.exit(1)
  } finally {
    // 3. ko 폴더 삭제 (성공/실패 상관없이)
    removeKoFolder()
  }
}

build()
