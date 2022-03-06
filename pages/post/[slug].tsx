import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import React from 'react'
import { Header, PostDetails } from '../../components'
import { sanityClient } from '../../sanity'
import { Post } from '../../typings'

interface Props {
  post: Post
}

const Post: NextPage<Props> = ({ post }) => {
  console.log(post)
  return (
    <main>
      <Header />
      <PostDetails post={post} />
    </main>
  )
}

export default Post

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "post"]{
    _id,
    slug {
      current
    },
  }`
  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: Post) => {
    return {
      params: {
        slug: post.slug.current,
      },
    }
  })
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author -> {
    name,
    image
  },
  'comment': *[
    _type == "comment" && post._ref == ^._id && approved == true
  ],
  description,
  body,
    slug,
    mainImage 
  }`
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })
  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}
