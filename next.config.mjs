import withExportImages from 'next-export-optimize-images'
import createNextra from 'nextra'

const withNextra = createNextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

const _imageOptimize = withExportImages({
  output: 'export'
})

export default withExportImages(withNextra({
  output: 'export',
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    // localeDetection: false
  }
}))
