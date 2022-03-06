import { NextComponentType } from 'next'
import React, { useState } from 'react'
import PortableText from 'react-portable-text'
import { urlFor } from '../sanity'
import { Post } from '../typings'
import { useForm, SubmitHandler } from 'react-hook-form'

interface Props {
  post: Post
}
interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}

const PostDetails = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res) => {
        setSubmitted(true)
      })
      .catch((err) => {
        setSubmitted(false)
      })
    console.log(data)
  }
  return (
    <main>
      <img
        className="h-40 w-full object-cover"
        src={urlFor(post?.mainImage).url()}
        alt="main-image"
      />
      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()}
            alt=""
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="font-bold text-green-600">{post.author.name}</span>{' '}
            - Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div>
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold">{props}</h1>
              ),
              h2: (props: any) => (
                <h2 className="my-5 text-xl font-bold">{props}</h2>
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              Link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="my-5 mx-auto max-w-lg border border-yellow-500" />
      {submitted ? (
        <div className="my-10 mx-auto flex max-w-2xl flex-col bg-yellow-500 p-10 text-white">
          <h3 className="text-3xl font-bold">Thanks for submitting</h3>
          <p>Once it has been approved, it will appear below!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-10 mx-auto mb-10 flex max-w-2xl flex-col p-5"
        >
          <h3 className="text-sm text-yellow-500">Enjoy this article</h3>
          <h3 className="text-3xl font-bold">Leave a comment below!</h3>
          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              type="hidden"
              {...register('_id')}
              name={'_id'}
              value={post._id}
            />
            <input
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              type="text"
              placeholder="Jon Doe"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              type="text"
              placeholder="you@example.com"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              placeholder="message..."
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              rows={8}
            />
          </label>
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">Name is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">Email is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">Comment is required</span>
            )}
          </div>
          <input
            type="submit"
            className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 px-4 py-2 shadow hover:bg-yellow-400 focus:outline-none"
          />
        </form>
      )}
      {/* Comments */}
      <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow shadow-yellow-500">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {post?.comment?.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500">{comment.name} </span>:
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default PostDetails
