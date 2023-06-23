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
// import rosette from "../../../Images/rosette.svg";
import { prisma } from "../../server/db";
import { updateLeagueTable } from "../api/updateLeagues";
import logo from "../../../Images/FDALogo.svg";

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
      <div className="grid md:grid-rows-1 grid-cols-1 md:grid-cols-3 gap-2 py-4">
        <Menu />
        <LeagueTable activeLeagues={activeLeagues} table={leagueTable} />
      </div>
    </>
  );
};

export default Dashboard;

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
    <div className="px-3 row-span-2 md:col-span-2">
      <h3 className="w-full text-center bg-base-300 p-2 font-extrabold text-2xl tracking-tight text-base-content rounded-t-lg">
        {currentLeagueName}
      </h3>
      <div className="flex flex-row w-full bg-base-200 justify-evenly">
        {filteredActiveLeagues.map((league) => (
          <Link href={`/dashboard/${league.id}`} key={league.id}>
            <h3 className=" p-2 font-bold text-base-content">{league.name}</h3>
          </Link>
        ))}
      </div>
      <table className="table-compact rounded-t-none w-full">
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
            <tr key={row.dog.name + row.user.name + row.points.toString()}>
              <td className="border px-4 py-2 text-center">{index + 1}</td>
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
    <div className="bg-green-300 rounded-lg mx-3 p-3">
      <div className="flex justify-center">
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
        <Image src={logo} alt="FDA Logo" width={200} height={200} />
      </div>
      <br />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
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
    <Link href={link} className="flex flex-row items-center gap-5 font-bold">
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <Image src={icon} alt="text" width={50} height={50} />
      <h3>{text}</h3>
    </Link>
  );
};

const SignOutComponent = () => {
  return (
    <button
      onClick={() => void signOut()}
      className="flex flex-row items-center gap-5 font-bold"
    >
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <Image src={signOutIcon} alt="text" width={50} height={50} />
      <h3>Logout</h3>
    </button>
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
