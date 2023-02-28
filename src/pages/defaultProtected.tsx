import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { getServerAuthSession } from "../server/auth";

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
    props: { userId: session.user.id },
  };
};

type DashboardProps = {
  userId: string;
};

const Dashboard: NextPage<DashboardProps> = ({ userId }) => {
  return (
    <>
      <Head>
        <title>FDA League</title>
        <meta name="description" content="The dog agility league " />
      </Head>
      <div className="">{userId}</div>
    </>
  );
};

export default Dashboard;
