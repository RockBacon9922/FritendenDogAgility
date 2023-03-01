import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { news } from "./routers/news";
import { dogs } from "./routers/dogs";
import { events } from "./routers/events";
import { leagues } from "./routers/leagues";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  news: news,
  dogs: dogs,
  events: events,
  leagues: leagues,
});

// export type definition of API
export type AppRouter = typeof appRouter;
