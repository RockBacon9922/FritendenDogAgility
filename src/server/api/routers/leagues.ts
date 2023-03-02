import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

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
        agilityFirst: true,
        agilitySecond: true,
        agilityThird: true,
        agilityFourth: true,
        agilityFifth: true,
        agilitySixth: true,
        agilitySeventh: true,
        agilityEighth: true,
        agilityNinth: true,
        agilityNoPlace: true,
        jumpingFirst: true,
        jumpingSecond: true,
        jumpingThird: true,
        jumpingFourth: true,
        jumpingFifth: true,
        jumpingSixth: true,
        jumpingSeventh: true,
        jumpingEighth: true,
        jumpingNinth: true,
        jumpingNoPlace: true,
      },
    });
    await prisma.$disconnect();
    return league;
  }),
});
