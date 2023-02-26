import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const news = createTRPCRouter({
  getNews: protectedProcedure.query(async () => {
    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: "asc",
      },
      take: 3,
      select: {
        title: true,
        content: true,
        createdAt: true,
      },
    });
    await prisma.$disconnect();
    return news;
  }),
});
