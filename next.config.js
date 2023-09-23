const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

const withExportImages = require('next-export-optimize-images')
const imageOptimize = withExportImages({
  output: 'export'
});

module.exports =
    withExportImages(withNextra({
        output: 'export',
    }))
