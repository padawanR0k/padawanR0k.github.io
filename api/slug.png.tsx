import satori, { SatoriOptions } from "satori";
import {Resvg} from '@resvg/resvg-js'
import {Thumbnail} from "../components/Thumbnail";


export const generateOgImage = async (
    text: string = "Default Title",
    date: Date = new Date()
): Promise<Buffer> => {
  const options: SatoriOptions = {
    width: 600,
    height: 315,
    fonts: [],
    // embedFont: true,
    // fonts: [
    //   {
    //     name: "JetBrainsMono",
    //     data: await readFile("./src/assets/font/JetBrainsMono-Bold.ttf"),
    //     weight: 600,
    //     style: "normal",
    //   },
    //   {
    //     name: "PlusJakartaSans",
    //     data: await readFile("./src/assets/font/PlusJakartaSans-Bold.ttf"),
    //     weight: 900,
    //     style: "normal",
    //   },
    // ],
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


export default async function handler (res) {
  console.log('123123123123123123123123');
  // const response = await generateOgImage(props.title, props.date);
  // return new Response(response, {
  //   status: 200,
  //   headers: {
  //     "Content-Type": "image/png",
  //   },
  // });
  const response = await generateOgImage();
  res.setHeader("content-type", "image/png");
  res.status(200).send(response)
};

