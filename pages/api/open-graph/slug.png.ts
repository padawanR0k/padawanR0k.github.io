import satori, { SatoriOptions } from "satori";
import {Resvg} from '@resvg/resvg-js'
import { Thumbnail } from "../../../components/Thumbnail";
import { readFile, writeFile } from "node:fs/promises";
import { NextApiRequest, NextApiResponse } from "next";


export const generateOgImage = async (
    text: string = "Default Title",
    date: Date = new Date()
): Promise<Buffer> => {
  const options: SatoriOptions = {
    width: 600,
    height: 315,
    embedFont: true,
    fonts: [
      {
        name: "Pretendard-Bold",
        data: await readFile("./Pretendard-Bold.subset.woff"),
        weight: 600,
        style: "normal",
      },
    ],
  };

  const svg = await satori(
      Thumbnail({
        title: text,
        date: date,
      }),
      options
  );

  console.log(1);
  const resvg = new Resvg(svg)
  console.log(2);
  const pngData = resvg.render()
  console.log(3);

  const buffer = pngData.asPng();

  return buffer;
};


export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('123');
    // const response = await generateOgImage(props.title, props.date);
    // return new Response(response, {
    //   status: 200,
    //   headers: {
    //     "Content-Type": "image/png",
    //   },
    // });
    const response = await generateOgImage(req.query.title as string);
    res.setHeader("content-type", "image/png");
    res.status(200).send(response)
  } catch (e) {
    console.error(e);
    res.status(200).send({
      body: '123'
    })
  }
};

