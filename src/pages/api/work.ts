import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../../lib/mongodb";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_NAME);

  switch (req.method) {
    case "POST":
        try{
            if(typeof req.body !== "object"){
                throw new Error('invalid request')
            }

            let myWork = await db.collection("work").insertOne(req.body);
            res.json({ data: myWork });
        }catch(err){
            res.status(422).json({ message: err.message});
        }
      
      break;
    case "GET":
      const allPosts = await db.collection("work").find({}).toArray();
      res.json({ data: allPosts });
      break;
    default:
        res.status(404).json({message: "page not found"});
        break;
  }
}