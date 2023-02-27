import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { signOut } from "next-auth/react";
import add from "../../Images/add.svg";
import { getServerAuthSession } from "../server/auth";
import Link from "next/link";
import signOutIcon from "../../Images/signOut.svg";
import pawPrint from "../../Images/pawPrint.svg";
import manageAccount from "../../Images/manageAccount.svg";
import menuIcon from "../../Images/menu.svg";
import rosette from "../../Images/rosette.svg";
import { api } from "../utils/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

const Dashboard: NextPage = ({}) => {
  // const router = useRouter();
  // // if signed in, redirect to the dashboard
  // const { data: session, status } = useSession();
  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }
  // if (!session) {
  //   void router.push("/");
  //   return <></>;
  // }

  const newsQuery = api.news.getNews.useQuery();
  const { data: news } = newsQuery;

  if (newsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>FDA League</title>
        <meta name="description" content="The dog agility league " />
      </Head>
      <div className="grid h-screen w-full grid-rows-4 items-center bg-gradient-to-t from-emerald-400 to-teal-200 md:grid-cols-4 md:grid-rows-1">
        <News news={news} />
        <LeagueTable />
        <Menu />
      </div>
    </>
  );
};

export default Dashboard;

type NewsProps = {
  news?:
    | {
        id: string;
        title: string;
        content: string;
        createdAt: Date;
      }[];
};

const News: React.FC<NewsProps> = ({ news }) => {
  return (
    <div className="mx-3 h-[90%] rounded-lg bg-slate-300 bg-opacity-50 p-3 text-slate-600">
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

const LeagueTable = () => {
  return <div className="card row-span-2 md:col-span-2">i have some text</div>;
};

const Menu = () => {
  return (
    <div className="card grid">
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <MenuItem link={"/addEvent"} icon={add} text="Record An Event" />
      <MenuItem
        link={"/manageAccount"}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        icon={manageAccount}
        text="Manage Account"
      />
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <MenuItem link={"/manageDogs"} icon={pawPrint} text="Manage Dogs" />
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <MenuItem link={"/eventLog"} icon={menuIcon} text="Event Log" />
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <MenuItem link={"/rewards"} icon={rosette} text="Rewards" />
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
