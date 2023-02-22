import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import FDALogo from "../../Images/FDALogo.svg";

import { api } from "../utils/api";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>FDA League</title>
        <meta name="description" content="The dog agility league " />
      </Head>
      <div className="bg-FDA0">
        <div className="paddock h-full h-screen w-full flex-col bg-blend-saturation">
          <Image src={FDALogo} alt="FDA Logo" width={500} height={500} />
        </div>
      </div>
    </>
  );
};

export default Home;
