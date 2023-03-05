import { prisma } from "../../server/db";

const handler = async () => {
  const latestLeagueTableUpdate = await prisma.leaguePoints.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
    },
  });
  const eventsToProcess = await prisma.event.findMany({
    // where: {
    //   createdAt: {
    //     gte: latestLeagueTableUpdate?.createdAt,
    //   },
    // },
    select: {
      dogId: true,
      userId: true,
      leagueId: true,
      points: true,
    },
  });
  for (const event of eventsToProcess) {
    const getId = await prisma.leaguePoints.findFirst({
      where: {
        dogId: event.dogId,
        leagueId: event.leagueId,
      },
      select: {
        id: true,
        points: true,
      },
    });
    const totalPoints = (getId?.points || 0) + (event.points || 0);
    await prisma.leaguePoints.upsert({
      where: {
        id: getId?.id,
      },
      create: {
        userId: event.userId,
        dogId: event.dogId,
        leagueId: event.leagueId,
        points: totalPoints,
      },
      update: {
        points: totalPoints,
      },
    });
  }
};

export default handler;
