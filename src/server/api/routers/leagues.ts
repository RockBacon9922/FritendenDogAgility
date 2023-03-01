import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const news = createTRPCRouter({
  getActiveLeagues: protectedProcedure.query(async () => {
    const leagues = await prisma.league.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        name: true,
      },
    });
    await prisma.$disconnect();
    return leagues;
  }),
});
