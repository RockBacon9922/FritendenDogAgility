import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const prisma = new PrismaClient()
    // find every dog
    // find every event for that dog
    const events = prisma.eventEntry.findMany({
        where: {
            verified: true,
            updatedAt: {

            }
        },

    })
}