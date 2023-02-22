import { useSession, signIn, signOut } from "next-auth/react";

const AuthShowcase = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <div>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
};
