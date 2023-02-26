/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
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
    });
    await prisma.$disconnect();
    return news;
  }),
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
  getDogs: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const prisma = new PrismaClient();
      const dogs = await prisma.dogs.findMany({
        where: {
          userId: input.userId,
        },
      });
      await prisma.$disconnect();
      return dogs;
    }),
  addDog: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        showName: z.string(),
        breed: z.string(),
        age: z.number(),
        grade: z.number(),
        height: z.number(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const dog = await prisma.dogs.create({
        data: {
          name: input.name,
          showName: input.showName,
          breed: input.breed,
          age: input.age,
          grade: input.grade,
          height: input.height,
          userId: input.userId,
        },
      });
      await prisma.$disconnect();
      return dog;
    }),
    editDog: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        showName: z.string(),
        breed: z.string(),
        age: z.number(),
        grade: z.number(),
        height: z.number(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const dog = await prisma.dogs.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          showName: input.showName,
          breed: input.breed,
          age: input.age,
          grade: input.grade,
          height: input.height,
          userId: input.userId,
        },
      });
      await prisma.$disconnect();
      return dog;
    }),
    deleteDog: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const dog = await prisma.dogs.delete({
        where: {
          id: input.id,
        },
      });
      await prisma.$disconnect();
      return dog;
    }
    ),
});
