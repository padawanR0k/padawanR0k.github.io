/** @type {import('next-sitemap').IConfig} */
import fs from 'fs/promises'
import path from 'path'

const LOCALES = ['en', 'ko']
const PAGES_DIR = path.join(process.cwd(), 'pages')

async function walkFiles(dir, cb) {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const ent of entries) {
        const full = path.join(dir, ent.name)
        if (ent.isDirectory()) {
            await walkFiles(full, cb)
        } else {
            await cb(full)
        }
    }
}

function toRouteFromFile(filePath) {
    // pages/en/about.mdx -> /about
    // pages/en/index.mdx -> /
    const rel = path.relative(PAGES_DIR, filePath).replace(/\\/g, '/')
    // rel like "en/about.mdx" or "ko/cloud/elb.mdx"
    const parts = rel.split('/')
    // ignore non-locale files
    if (!LOCALES.includes(parts[0])) return null
    const segments = parts.slice(1) // drop locale
    let route = '/' + segments.join('/')
    route = route.replace(/\.(mdx?|tsx?|jsx?)$/, '') // strip ext
    route = route.replace(/\/index$/, '') // /index -> ''
    if (route === '') route = '/'
    return route
}

// --- 추가된 헬퍼: 전달된 path에서 로케일 접두사 제거 ---
function stripLocalePrefix(p) {
    if (!p) return p
    if (p === '/') return '/'
    for (const l of LOCALES) {
        if (p === `/${l}`) return '/'
        if (p.startsWith(`/${l}/`)) return p.slice(l.length + 1) // remove leading "/en" -> "/about"
    }
    return p
}

export const blogConfig = {
    siteUrl: 'https://blog.r0k.wiki',
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 7000,
    generateRobotsTxt: true,
    exclude: [],

    // 수정된 transform: 전달된 path에서 로케일을 제거한 base를 만들어 alternates 생성
    transform: async (config, path) => {
        const makeUrl = (p) => new URL(p, config.siteUrl).toString()
        // keep original path as loc (next-sitemap may call transform for both "/en/..." and "/...").
        const locPath = path
        // build base route without locale prefix for alternates
        const base = stripLocalePrefix(path)
        const baseSuffix = base === '/' ? '' : base

        return {
            loc: makeUrl(locPath),
            lastmod: new Date().toISOString(),
            changefreq: config.changefreq,
            priority: config.priority,
            // next-sitemap expects `alternateRefs`
            alternateRefs: [
                { href: makeUrl(`/en${baseSuffix}`), hreflang: 'en' },
                { href: makeUrl(`/ko${baseSuffix}`), hreflang: 'ko' },
                { href: makeUrl(base), hreflang: 'x-default' }
            ]
        }
    },

    // 추가: pages/<locale>를 스캔해서 로케일 없는 루트 URL을 sitemap에 추가
    additionalPaths: async (config) => {
        const rootPaths = new Set()

        for (const locale of LOCALES) {
            const localeDir = path.join(PAGES_DIR, locale)
            try {
                await walkFiles(localeDir, (file) => {
                    // skip API, _app, _document, _error 등 페이지 아닌 파일
                    const base = path.basename(file)
                    if (base.startsWith('_') || base.startsWith('api')) return
                    const route = toRouteFromFile(file)
                    if (route) rootPaths.add(route)
                })
            } catch (e) {
                // locale 폴더가 없을 수 있음 — 무시
            }
        }

        // root 루트도 명시적으로 추가
        rootPaths.add('/')

        const results = []
        for (const p of rootPaths) {
            // config.transform를 사용해 동일한 포맷으로 생성
            results.push(await config.transform(config, p))
        }
        return results
    }
}

export default blogConfig

/**
 * 요약 — 현재 설정 파일이 실행되는 순서(간단히)

next-sitemap이 설정 파일 로드

next-sitemap --config ... 실행하면 next-sitemap.config.mjs를 import 해서 blogConfig 객체를 얻음.
next-sitemap이 사이트의 페이지 목록을 수집

빌드 산출물(.next)의 매니페스트에서 페이지 경로 목록(예: "/en/about", "/about" 등)을 가져옴.
각 수집된 경로마다 이후에 transform(config, path)를 호출함.
transform(config, path) 실행 (각 경로별)

locPath = path (next-sitemap이 넘긴 원래 경로를 loc으로 사용).
base = stripLocalePrefix(path) 를 통해 "/en/about" -> "/about", "/"은 그대로 "/".
baseSuffix = base === '/' ? '' : base
alternateRefs를 생성:
href: siteUrl + /en${baseSuffix} (hreflang: en)
href: siteUrl + /ko${baseSuffix} (hreflang: ko)
href: siteUrl + base (hreflang: x-default)
transform는 loc, lastmod, changefreq, priority, alternateRefs를 반환 -> next-sitemap은 이를 XML <url> (+ xhtml:link 태그)로 변환.
additionalPaths(config) 실행 (transform 호출 이후)

LOCALES 각각에 대해 pages/<locale> 디렉터리를 재귀로 스캔(walkFiles).
toRouteFromFile(filePath)로 파일 경로 -> 로케일 제거된 route("/about" 등)를 얻어 rootPaths Set에 추가.
rootPaths에 '/'도 추가.
rootPaths의 각 path p에 대해 config.transform(config, p)를 호출하여 결과 배열 반환.
이 반환값들은 next-sitemap의 추가 sitemap 항목으로 병합됨.
 */
