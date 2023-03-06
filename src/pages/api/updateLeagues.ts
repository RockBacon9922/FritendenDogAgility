import type { NextApiHandler } from "next";
import { prisma } from "../../server/db";
import { createHash } from "crypto";

const updateLeagueTableHandler: NextApiHandler = async (req, res) => {
  await updateLeagueTable();
  res.status(200).json({ message: "ok" });
};

export default updateLeagueTableHandler;

export const updateLeagueTable = async () => {
  const latestLeagueTableUpdate = await prisma.leaguePoints.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      updatedAt: true,
    },
  });
  const eventsToProcess = await prisma.event.findMany({
    where: {
      updatedAt: {
        gt: latestLeagueTableUpdate?.updatedAt || new Date(0),
      },
    },
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
    console.log(totalPoints);
    // create hash of dogId and leagueId
    const hash = createHash("sha256")
      .update(`${event.dogId}${event.leagueId}`)
      .digest("hex");
    await prisma.leaguePoints.upsert({
      where: {
        id: getId?.id || hash,
      },
      create: {
        id: hash,
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
  return true;
};
