import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "../../db";

export const events = createTRPCRouter({
  addEvent: protectedProcedure
    .input(
      z.object({
        dogId: z.string(),
        grade: z.number(),
        height: z.string(),
        userId: z.string(),
        kennelClub: z.boolean(),
        eventName: z.string(),
        eventType: z.string(),
        dateOfEvent: z.date(),
        leagueId: z.string(),
        place: z.number(),
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
          kennelClub: input.kennelClub,
          eventName: input.eventName,
          eventType: input.eventType,
          dateOfEvent: input.dateOfEvent,
          leagueId: input.leagueId,
          place: input.place,
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
        select: {
          id: true,
          dog: {
            select: {
              name: true,
            },
          },
          grade: true,
          height: true,
          kennelClub: true,
          eventName: true,
          eventType: true,
          dateOfEvent: true,
          league: {
            select: {
              name: true,
            },
          },
          place: true,
          points: true,
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
        leagueId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const events = await prisma.event.findMany({
        where: {
          leagueId: input.leagueId,
        },
      });
      await prisma.$disconnect();
      return events;
    }),
  getEventsById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const event = await prisma.event.findUnique({
        where: {
          id: input.id,
        },
      });
      await prisma.$disconnect();
      return event;
    }),
});
