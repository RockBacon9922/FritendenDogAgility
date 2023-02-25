/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dbRouter = createTRPCRouter({
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
    })
    await prisma.$disconnect()
    return news
  }),
  addEvent: protectedProcedure.input(
    z.object({
      dogId: z.string(),
      grade: z.number(),
      height: z.number(),
      userId: z.string(),
      dateOfEvent: z.date(),
      event: z.string(),
      points: z.number(),
      })).mutation(async ({ input }) => {
        const event = await prisma.eventEntry.create({
          data: {
            dogId: input.dogId,
            grade: input.grade,
            height: input.height,
            userId: input.userId,
            dateOfEvent: input.dateOfEvent,
            event: input.event,
            points: input.points,
          },
        });
        await prisma.$disconnect()
        return event;
      }),
});
