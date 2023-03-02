import { type NextPage } from "next";
import Head from "next/head";
import type Event from "../types/Event";
import type Dog from "../types/Dog";
import { api } from "../utils/api";
import { useSession } from "next-auth/react";

const Dashboard: NextPage<DashboardProps> = () => {
  // get user id
  const { data: session, status } = useSession();
  const userId = session?.user.id as string;
  const { data: events, status: eventsStatus } =
    api.events.getEventsByUserId.useQuery({ userId });
  const { data: dogs, status: dogsStatus } = api.dogs.getDogsByUserId.useQuery({
    userId,
  });
  if (eventsStatus === "loading" || dogsStatus === "loading")
    return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>FDA League</title>
        <meta name="description" content="The dog agility league " />
      </Head>
      <div className="">
        <table className="table-auto">
          <thead>
            <tr>
              <th>dog name</th>
              <th>Event</th>
              <th>date</th>
              <th>place</th>
              <th>points</th>
              <th>KennelClub</th>
            </tr>
          </thead>
          <tbody>
            {events?.map((event) => (
              <tr key={event.dogId}>
                <td>{dogs?.find((dog) => dog.id === event.dogId)}</td>
                <td>{event.eventName}</td>
                <td>{event.dateOfEvent.toDateString()}</td>
                <td>{event.place}</td>
                <td>{event.points}</td>
                <td>{event.kennelClub ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;
