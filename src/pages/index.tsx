import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import FDALogo from "../../Images/FDALogo.svg";

const Home: NextPage = () => {
  const router = useRouter();
  // if signed in, redirect to the dashboard
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (session) {
    void router.push("/dashboard");
    return <div>Redirecting...</div>;
  }

  return (
    <>
      <Head>
        <title>FDA League Login</title>
        <meta
          name="description"
          content="The Fritenden dog agility login page"
        />
      </Head>
      <div className="flex h-screen w-full grid-cols-4 justify-center bg-gradient-to-t from-emerald-100 to-teal-50 md:grid">
        <div className="place-self-center">
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <div className="place-self-center">
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
            <Image src={FDALogo} alt="FDA Logo" width={500} height={500} />
          </div>
          <h1 className="text-center text-4xl font-extrabold tracking-tight text-black">
            The FDA League
          </h1>
          <br />
          <Providers />
        </div>
        <div className="paddock col-span-3 hidden md:block"></div>
      </div>
    </>
  );
};

export default Home;

const Providers = () => {
  // get the providers
  const providers = {
    facebook: { name: "Facebook", id: "facebook" },
  };

  return (
    <div className="text-center">
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <button
            onClick={() => void signIn(provider.id)}
            className="m-2 rounded-md bg-gradient-to-t from-sky-500 to-sky-400 p-2 font-bold text-white"
          >
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};
