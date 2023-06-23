// TODO: I need to work out why the cookie alert just pops off of the screen

import Head from "next/head";
import Image from "next/image";
import { signIn } from "next-auth/react";
import FDALogo from "../../Images/FDALogo.svg";
import type { NextPage } from "next";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const router = useRouter();
  // if signed in, redirect to the dashboard
  const { data: session } = useSession();
  if (session) {
    void router.push("/dashboard");
    return <></>;
  }
  return (
    <>
      <Head>
        <title>FDA League Login</title>
        <meta
          name="description"
          content="The Frittenden Dog Agility Login Page"
        />
      </Head>
      <CookieAlert />
      <div className="flex h-screen w-full grid-cols-4 justify-center bg-gradient-to-t from-emerald-100 to-teal-50 md:grid">
        <div className="place-self-center">
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <div className="place-self-center">
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
            <Image src={FDALogo} alt="FDA Logo" width={500} height={500} priority />
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
  return (
    <div className="text-center">
      <button
        onClick={() => void signIn("facebook")}
        className="m-2 rounded-md bg-gradient-to-t from-sky-500 to-sky-400 p-2 font-bold text-white"
      >
        Sign in with Facebook
      </button>
      <button
        onClick={() => void signIn("auth0")}
        className="m-2 rounded-md bg-gradient-to-b from-primary to-green-600 p-2 font-bold text-white"
      >
        Sign in with Username & Password
      </button>
    </div>
  );
};

const CookieAlert = () => {
  const [show, setShow] = useState(true);
  setTimeout(() => {
    setShow(false);
  }, 5000);
  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {show && (
          <m.div
            key="cookie-alert"
            className="alert fixed top-10 self-center bg-white/50 shadow-lg backdrop-blur"
            // style={{
            //   animation: "flyInFromTop 0.5s ease-in-out",
            // }}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 flex-shrink-0 stroke-info"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>We use cookies for the website to function.</span>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};
