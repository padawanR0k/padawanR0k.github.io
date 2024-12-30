import * as fs from 'node:fs';
import satori, { type SatoriOptions } from "satori";
import { Transformer } from "@napi-rs/image";
import { promises } from "node:fs";
import * as path from 'node:path';
import * as glob from 'glob';
import matter from 'gray-matter';
import { Thumbnail } from './components/Thumbnail';
import { readFile } from "node:fs/promises";

interface PageInfo {
    path: string;
    title: string;
}

export function getAllPages(): PageInfo[] {
    const filesWithTitles: PageInfo[] = [];

    // "src/pages" 디렉토리 경로
    const pagesDirectory = path.join(__dirname, './pages');

    // "*.mdx" 및 "*.md" 파일을 찾기 위한 glob 패턴 설정
    const mdxFiles = glob.sync('**/*.{mdx,md}', { cwd: pagesDirectory });

    // 각 파일의 경로와 title 값을 추출하여 배열에 추가
    mdxFiles.forEach((filePath) => {
        const fullFilePath = path.join(pagesDirectory, filePath);
        const fileContent = fs.readFileSync(fullFilePath, 'utf8');
        const frontmatter = matter(fileContent);

        // frontmatter에서 title 값을 추출하고 배열에 추가
        if (frontmatter.data && frontmatter.data.title) {
            const fileTitle = frontmatter.data.title;
            filesWithTitles.push({ path: filePath, title: fileTitle });
        }
    });

    return filesWithTitles;
}




export const generateOgImage = async (
    text: string = "Default Title",
) => {
    const pages = getAllPages()
    console.log(pages);

    pages.forEach(page => void saveImage(page.title, page.path))
};

const saveImage = async (title: string, path: string) => {
    const options: SatoriOptions = {
        width: 600,
        height: 315,
        embedFont: true,
        fonts: [
          {
            name: "Pretendard-Bold",
            data: await readFile("./public/woff-subset/Pretendard-Bold.subset.woff"),
            weight: 600,
            style: "normal",
          },
        ],
    };

    const svg = await satori(
        Thumbnail({
            title,
        }),
        options
    );
    const transformer = Transformer.fromSvg(svg);
    const png = await transformer.png();
    const removeSlash = path.replaceAll('/', '-');
    const filename = getFileName(removeSlash);
    console.log(filename);
    await promises.writeFile(`./public/thumbnail/${filename}.png`, png);

}

const getFileName = (filename: string) => filename.replace(/\.[^/.]+$/, "");

(async () => {
    await generateOgImage()
    console.log('done')
})();
