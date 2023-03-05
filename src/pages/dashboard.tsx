import type { GetStaticProps, NextPage } from "next";
import { prisma } from "../server/db";

export const getStaticProps: GetStaticProps = async () => {
  const defaultLeague = await prisma.league.findFirst({
    where: {
      id: {
        startsWith: "FDAAllAges",
      },
    },
    orderBy: {
      endDate: "desc",
    },
    select: {
      id: true,
    },
  });
  const url = `/dashboard/${String(defaultLeague?.id || "FDAAllAges")}`;

  return {
    redirect: {
      destination: url,
      permanent: false,
    },
  };
};

const Dashboard: NextPage = () => {
  return <></>;
};

export default Dashboard;
