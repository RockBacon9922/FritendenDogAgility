import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "../../db";

export const news = createTRPCRouter({
  getNews: protectedProcedure.query(async () => {
    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: "asc",
      },
      take: 3,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    await prisma.$disconnect();
    return news;
  }),
});
