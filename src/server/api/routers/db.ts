import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dbRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(({ input }) => {
      return {
        user: user(input.email),
      };
    }),
});

const user = async (username: string) => {
  await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
};
