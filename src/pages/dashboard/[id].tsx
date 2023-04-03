// TODO: get news to be pulled in getStaticProps
// TODO: get chosen leaguetable to be pulled in getStaticProps

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import add from "../../../Images/add.svg";
import signOutIcon from "../../../Images/signOut.svg";
import pawPrint from "../../../Images/pawPrint.svg";
import menuIcon from "../../../Images/menu.svg";
import rosette from "../../../Images/rosette.svg";
import { api } from "../../utils/api";
import { prisma } from "../../server/db";
import { updateLeagueTable } from "../api/updateLeagues";

export const getStaticPaths: GetStaticPaths = async () => {
  const leagues = await prisma.league.findMany({
    select: {
      id: true,
    },
  });
  const paths = leagues.map((league) => ({ params: { id: league.id } }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  await updateLeagueTable();
  const leagueTable = await getLeagueTable(context.params?.id as string);
  const activeLeagues = await prisma.league.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      name: true,
    },
  });
  return {
    props: { leagueTable, activeLeagues },
    revalidate: 60,
  };
};

type LeagueTable = {
  dog: {
    name: string;
  };
  points: number;
  user: {
    name: string;
  };
};

type ActiveLeagues = {
  id: string;
  name: string;
};

type DashboardProps = {
  leagueTable: LeagueTable[];
  activeLeagues: ActiveLeagues[];
};

const Dashboard: NextPage<DashboardProps> = ({
  leagueTable,
  activeLeagues,
}) => {
  const router = useRouter();
  // if signed in, redirect to the dashboard
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (!session) {
    void router.push("/");
    return <></>;
  }

  return (
    <>
      <Head>
        <title>FDA League</title>
        <meta name="description" content="The dog agility league " />
      </Head>
      <div className="grid h-screen w-full grid-rows-4 items-center bg-gradient-to-t from-emerald-400 to-teal-200 md:grid-cols-4 md:grid-rows-1">
        <News />
        <Menu />
        <LeagueTable table={leagueTable} activeLeagues={activeLeagues} />
      </div>
    </>
  );
};

export default Dashboard;

const News: React.FC = () => {
  const newsQuery = api.news.getNews.useQuery();
  const { data: news } = newsQuery;

  if (newsQuery.isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="card text-slate-600">
      <h2 className="text-center text-xl font-extrabold tracking-tight ">
        The News
      </h2>
      {news?.map((newsItem) => (
        <div className="rounded-lg" key={newsItem.title}>
          <h3 className=" text-lg font-bold">{newsItem.title}</h3>
          <p className="text-sm">{newsItem.content}</p>
          {/* add the date in the right corner small */}
          <p className="relative bottom-0 right-3 text-right text-xs">
            {newsItem.createdAt.toDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

type LeagueTableProps = {
  table: LeagueTable[];
  activeLeagues: ActiveLeagues[];
};

const LeagueTable: React.FC<LeagueTableProps> = ({ table, activeLeagues }) => {
  const router = useRouter();
  const { id } = router.query;
  // get the name of the league
  const currentLeagueName = activeLeagues.find(
    (league) => league.id === id
  )?.name;
  // removed the current league from the list of active leagues
  const filteredActiveLeagues = activeLeagues.filter(
    (league) => league.id !== id
  );
  return (
    <div className="card row-span-2 md:col-span-2">
      <div className="card-header flex flex-row">
        {filteredActiveLeagues.map((league) => (
          <Link href={`/dashboard/${league.id}`} key={league.id}>
            <h3 className=" bg-base-300 p-2 font-bold tracking-tight text-base-content">
              {league.name}
            </h3>
          </Link>
        ))}
      </div>
      <div className="card-header flex flex-row items-center justify-center">
        <h3 className="w-full bg-base-200 p-2 text-center font-bold tracking-tight text-base-content">
          {currentLeagueName}
        </h3>
      </div>
      <table className="table rounded-t-none">
        <thead>
          <tr>
            <th className="rounded-t-none border px-4 py-2">Position</th>
            <th className="border px-4 py-2">Dog</th>
            <th className="border px-4 py-2">Owner</th>
            <th className="rounded-t-none border px-4 py-2">Points</th>
          </tr>
        </thead>
        <tbody className="overflow-y-scroll">
          {table.map((row, index) => (
            <tr key={row.dog.name}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{row.dog.name}</td>
              <td className="border px-4 py-2">{row.user.name}</td>
              <td className="border px-4 py-2">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Menu = () => {
  return (
    <div className="card m-3 grid grid-cols-2 p-2 md:grid-cols-1">
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <MenuItem link={"/addEvent"} icon={add} text="Record An Event" />
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <MenuItem link={"/manageDogs"} icon={pawPrint} text="Manage Dogs" />
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <MenuItem link={"/eventLog"} icon={menuIcon} text="Event Log" />
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      {/* <MenuItem link={"/rewards"} icon={rosette} text="Rewards" /> */}
      <SignOutComponent />
    </div>
  );
};

const MenuItem = ({
  link,
  icon,
  text,
}: {
  link: string;
  icon: string;
  text: string;
}) => {
  return (
    <div className="">
      <Link href={link} className="flex flex-row items-center gap-5 font-bold">
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
        <Image src={icon} alt="text" width={50} height={50} />
        <h3>{text}</h3>
      </Link>
    </div>
  );
};

const SignOutComponent = () => {
  return (
    <div className="">
      <button
        onClick={() => void signOut()}
        className="flex flex-row items-center gap-5 font-bold"
      >
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
        <Image src={signOutIcon} alt="text" width={50} height={50} />
        <h3>Logout</h3>
      </button>
    </div>
  );
};

const getLeagueTable = async (leagueId: string) => {
  const leagueTable = await prisma.leaguePoints.findMany({
    where: {
      leagueId,
    },
    select: {
      dog: {
        select: {
          name: true,
        },
      },
      points: true,
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      points: "desc",
    },
  });
  return leagueTable;
};
