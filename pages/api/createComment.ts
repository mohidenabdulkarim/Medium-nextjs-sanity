// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient, { ClientConfig } from '@sanity/client'

const config: ClientConfig = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: "2021-08-11", // or today's date for latest
    useCdn: process.env.NODE_ENV === "production",
    token: process.env.SANITY_API_TOKEN,
}

const client = sanityClient(config);

export default async function createComment(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { _id, name, comment, email } = JSON.parse(req.body);
    try {
        await client.create({
            _type: "comment",
            post: {
                _type: 'reference',
                _ref: _id
            },
            name,
            email,
            comment
        })
        res.status(200).send("message Submitted");
    } catch (err: any) {
        return res.status(500).send(err.toString());
    }
}

