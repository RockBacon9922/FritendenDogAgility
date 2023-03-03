import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import Image from "next/image";
import home from "../../Images/home.svg";
import Link from "next/link";

const EventLog: NextPage = () => {
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
      <div>
        <EventTable userId={session.user?.id} />
      </div>
    </>
  );
};

type EventTableProps = {
  userId: string;
};

const EventTable: React.FC<EventTableProps> = ({ userId }) => {
  const { data: events, status } = api.events.getEventsByUserId.useQuery({
    userId,
  });
  return (
    <div className="card">
      <div className="card-header flex flex-row items-center">
        <Link href="/dashboard">
          <Image src={home} alt="home" width={50} height={50} />
        </Link>
        <h1 className="text-3xl font-extrabold text-primary">Event Log</h1>
      </div>
      <div className="card-body">
        <table className="table">
          <thead>
            <tr>
              <th>EventName</th>
              <th>EventType</th>
              <th>EventDate</th>
              <th>Dog Name</th>
              <th>Place</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {status === "loading" && (
              <tr>
                <td>Loading...</td>
              </tr>
            )}
            {status === "error" && (
              <tr>
                <td>Error</td>
              </tr>
            )}
            {status === "success" &&
              events?.map((event) => (
                <tr key={event.id}>
                  <td>{event.eventName}</td>
                  <td>{event.eventType}</td>
                  <td>{event.dateOfEvent.toDateString()}</td>
                  <td>{event.dog?.name}</td>
                  <td>{event.place}</td>
                  <td>{event.points}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventLog;
