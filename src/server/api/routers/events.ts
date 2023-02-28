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
        height: z.string(),
        userId: z.string(),
        eventName: z.string(),
        eventType: z.string(),
        dateOfEvent: z.date(),
        league: z.string(),
        points: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const event = await prisma.event.create({
        data: {
          dogId: input.dogId,
          grade: input.grade,
          height: input.height,
          userId: input.userId,
          eventName: input.eventName,
          eventType: input.eventType,
          dateOfEvent: input.dateOfEvent,
          league: input.league,
          points: input.points,
        },
      });
      await prisma.$disconnect();
      return event;
    }),
  getEventsByUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const events = await prisma.event.findMany({
        where: {
          userId: input.userId,
        },
      });
      await prisma.$disconnect();
      return events;
    }),
  getEventsByDogId: protectedProcedure
    .input(
      z.object({
        dogId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const events = await prisma.event.findMany({
        where: {
          dogId: input.dogId,
        },
      });
      await prisma.$disconnect();
      return events;
    }),
  getEventsByLeague: protectedProcedure
    .input(
      z.object({
        league: z.string(),
      })
    )
    .query(async ({ input }) => {
      const events = await prisma.event.findMany({
        where: {
          league: input.league,
        },
      });
      await prisma.$disconnect();
      return events;
    }),
});
