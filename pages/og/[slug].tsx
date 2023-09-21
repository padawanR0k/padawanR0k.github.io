import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from "next";

export const getStaticProps = ({ params }) => {
  console.log({params});
  return {
    props: {
      slug: params.slug,
    }
  };
  return fetch(`http://localhost:3000/api/open-graph/slug.png?title=${params.name}`)
      .then(res => res.arrayBuffer())
}


export const getStaticPaths = (async () => {
  return {
    paths: [
      {
        params: {
          name: 'next.js',
          slug: '123',
        },
      }, // See the "paths" section below
    ],
    fallback: false, // false or "blocking"
  }
}) satisfies GetStaticPaths


export default function Page({}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <></>
}
