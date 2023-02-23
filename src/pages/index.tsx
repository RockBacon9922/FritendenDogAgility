import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { signIn, useSession, getProviders } from "next-auth/react";
import FDALogo from "../../Images/FDALogo.svg";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const router = useRouter();
  // if signed in, redirect to the dashboard
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (session) {
    void router.push("/oldindex");
    return <div>Redirecting...</div>;
  }

  // get the providers
  const providers = {
    facebook: { name: "Facebook", id: "facebook" },
  };

  return (
    <>
      <Head>
        <title>FDA League</title>
        <meta name="description" content="The dog agility league " />
      </Head>
      <div className="grid grid-cols-3 bg-FDA5">
        <div className="place-self-center ">
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <Image src={FDALogo} alt="FDA Logo" width={500} height={500} />
        </div>
        <div className="paddock col-span-2">
          <div className="flex h-screen w-full flex-row items-center justify-end bg-blend-saturation">
            <div className="mr-3 rounded-md bg-FDA0 p-3 text-white">
              {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                  {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                  <button onClick={() => signIn(provider.id)}>
                    Sign in with {provider.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
