import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const events = createTRPCRouter({
  addEvent: protectedProcedure
    .input(
      z.object({
        dogId: z.string(),
        grade: z.number(),
        height: z.number(),
        userId: z.string(),
        dateOfEvent: z.date(),
        event: z.string(),
        points: z.number(),
      })
    )
    .mutation(async ({ input }) => {
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
      await prisma.$disconnect();
      return event;
    }),
  getEvents: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const events = await prisma.eventEntry.findMany({
        where: {
          userId: input.userId,
        },
      });
      await prisma.$disconnect();
      return events;
    }),
});
