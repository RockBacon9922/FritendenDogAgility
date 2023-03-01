import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dogs = createTRPCRouter({
  getDogs: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const dogs = await prisma.dogs.findMany({
        where: {
          userId: input.userId,
        },
      });
      await prisma.$disconnect();
      return dogs;
    }),
  getDog: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const dog = await prisma.dogs.findUnique({
        where: {
          id: input.id,
        },
      });
      await prisma.$disconnect();
      return dog;
    }),
  addDog: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        showName: z.string(),
        breed: z.string(),
        leagueId: z.string(),
        age: z.number(),
        grade: z.number(),
        height: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const dog = await prisma.dogs.create({
        data: {
          name: input.name,
          showName: input.showName,
          breed: input.breed,
          leagueId: input.leagueId,
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
        leagueId: z.string(),
        age: z.number(),
        grade: z.number(),
        height: z.string(),
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
          leagueId: input.leagueId,
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
    }),
  getDogById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const dog = await prisma.dogs.findUnique({
        where: {
          id: input.id,
        },
      });
      await prisma.$disconnect();
      return dog;
    }),
  getDogsByUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const dogs = await prisma.dogs.findMany({
        where: {
          userId: input.userId,
        },
      });
      await prisma.$disconnect();
      return dogs;
    }),
});
