import { PrismaClient } from "@prisma/client";

// get current date

const handler = async () => {
  const prisma = new PrismaClient();
  // find every dog
  // find every event for that dog
  const events = await prisma.eventEntry.findMany({
    where: {
      verified: true,
      updatedAt: {
        gt: new Date(new Date().getTime() - 5 * 60 * 1000),
      },
    },
  });
  console.log(events);
};

export default handler;
