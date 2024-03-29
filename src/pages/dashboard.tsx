import type { GetStaticProps, NextPage } from "next";
import { prisma } from "../server/db";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const getStaticProps: GetStaticProps = async () => {
  const defaultLeague = await prisma.league.findFirst({
    where: {
      id: {
        startsWith: "7Grades",
      },
      active: true,
    },
    orderBy: {
      endDate: "desc",
    },
    select: {
      id: true,
    },
  });
  const url = `/dashboard/${String(defaultLeague?.id || "7Grades[23]")}`;

  return {
    props: { url },
    revalidate: 240,
  };
};

type DashboardProps = {
  url: string;
};

const Dashboard: NextPage<DashboardProps> = ({ url }) => {
  const router = useRouter();
  useEffect(() => {
    void router.push(url);
  }, [router, url]);
  return <></>;
};

export default Dashboard;
