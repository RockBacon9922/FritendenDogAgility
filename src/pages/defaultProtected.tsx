import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { getServerAuthSession } from "../server/auth";
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
    props: {userId: session.user.id},
  };
};

const Dashboard = ({userId}: {userId: string}) => {

  return (
    <>
      <Head>
        <title>FDA League</title>
        <meta name="description" content="The dog agility league " />
      </Head>
      <div className="">
      </div>
    </>
  );
};

export default Dashboard;
