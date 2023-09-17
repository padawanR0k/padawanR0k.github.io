const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

const withExportImages = require('next-export-optimize-images')
const imageOptimize = withExportImages({
  output: 'export'
});

// console.log('imageOptimize', imageOptimize);
// console.log('asd', withNextra({
//     images: {
//         unoptimized: true,
//     },
// }));
module.exports =
    withExportImages(withNextra({
        output: 'standalone',
    }))
