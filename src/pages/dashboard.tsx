import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import FDALogo from "../../Images/FDALogo.svg";

const Dashboard: NextPage = () => {
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
        {/* <LeagueTable /> */}
      </div>
    </>
  );
};

export default Dashboard;

const News = () => {
  return (
    <div className="mx-3 h-[90%] rounded-lg bg-slate-300 bg-opacity-50 p-3 text-slate-600">
      <h2 className="text-center text-xl font-extrabold tracking-tight ">
        The News
      </h2>
    </div>
  );
};

const LeagueTable = () => {
  return <div className="row-span-2 md:col-span-2"></div>;
};

const Menu = () => {
  return <div></div>;
};
