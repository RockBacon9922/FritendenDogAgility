import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "../../db";
import { z } from "zod";

export const leagues = createTRPCRouter({
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
  getScoringMethods: protectedProcedure.query(async () => {
    const league = await prisma.league.findMany({
      select: {
        id: true,
        initialPoints: true,
      },
    });
    await prisma.$disconnect();
    return league;
  }),
});
