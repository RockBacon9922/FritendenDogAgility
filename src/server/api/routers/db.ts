/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dbRouter = createTRPCRouter({
  getNews: protectedProcedure.query(async () => {
    return await prisma.news.findMany({
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
  }),
});
