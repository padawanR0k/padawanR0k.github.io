import createNextra from 'nextra'
import withExportImages from 'next-export-optimize-images'

const withNextra = createNextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

const imageOptimize = withExportImages({
  output: 'export'
})

export default withExportImages(withNextra({
  output: 'export',
}))
