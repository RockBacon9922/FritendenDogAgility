import Head from "next/head";
import { PrismaClient } from "@prisma/client";
import type { GetServerSideProps } from "next";
import { authOptions } from "../server/auth";
import { getServerSession } from "next-auth";
import { type } from "os";
import { useRef, useState } from "react";
import { string } from "zod";
import { FormEvent } from "react";
import Link from "next/link";
import { api } from "../utils/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const currentUserId = session.user.id;
  const prisma = new PrismaClient();
  const dogs = await prisma.dogs.findMany({
    where: {
      userId: currentUserId,
    },
    select: {
      id: true,
      name: true,
      breed: true,
      grade: true,
      height: true,
      showName: true,
      userId: true,
    },
  });
  await prisma.$disconnect();
  // put all the dogs into a list
  const dogList = JSON.stringify(dogs);
  return {
    props: {
      dogList,
      currentUserId,
    },
  };
};

type dogs = {
  id: number;
  name: string;
  breed: string;
  grade: string;
  height: string;
  showName: string;
  userId: string;
};

type data = {
  dogId: number;
  grade: number;
  height: number;
  userId: string;
  dateOfEvent: Date;
  event: string;
  points: number;
};

const AddEvent = ({
  dogList,
  currentUserId,
}: {
  dogList: string;
  currentUserId: string;
}) => {
  const dogs = JSON.parse(dogList) as dogs;
  // if the user has no dogs redirect them to the add dog page
  if (dogs.length === 0) {
    return (
      <>
        <div>You have no dogs</div>
        <Link href="/addDog">Add a dog</Link>
      </>
    );
  }
  const dogRef = useRef(null);
  const dateRef = useRef(null);
  const eventRef = useRef(null);
  const pointsRef = useRef(null);
  const mutation = api.db.addEvent.useMutation();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const theDate = new Date(dateRef.current.value);
    const dog = dogs.find(e => e.id === dogRef.current.value) as dogs
    mutation.mutate({
      userId: dog.userId,
      grade: dog.grade,
      height: dog.height,
      dogId: dog.id,
      dateOfEvent: theDate,
      event: eventRef.current.value,
      points: parseInt(pointsRef.current.value),
    });
  };
  return (
    // get the users dogs

    <>
      <Head>
        <title>FDA League</title>
        <meta name="description" content="The dog agility league " />
      </Head>
      <div>
        {/* create a drop down for the users dogs */}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="dogs">Choose a dog: </label>
            <select name="dogs" id="dogs" ref={dogRef}>
              {dogs.map((dog) => (
                <option value={dog.id} key={dog.id}>
                  {dog.name +
                    " " +
                    dog.breed +
                    " " +
                    dog.grade +
                    " " +
                    heightToText(dog.height)}
                </option>
              ))}
            </select>
          </div>
          <div>
            {/* date of event */}
            <label htmlFor="date">Date of Event: </label>
            <input type="date" name="date" id="date" ref={dateRef} />
          </div>
          <div>
            <label htmlFor="event">Event: </label>
            <input type="text" name="event" id="event" ref={eventRef} />
          </div>
          <div>
            {/* points */}
            <label htmlFor="points">Points: </label>
            <input type="number" name="points" id="points" ref={pointsRef} />
          </div>
          <button type="submit">Submit</button>
        </form>
        <p>{dogList}</p>
        <p>{mutation.status}</p>
        <Link href="/dashboard">Go back</Link>
      </div>
    </>
  );
};

export default AddEvent;

const heightToText = (height: number) => {
  switch (height) {
    case 1:
      return "Small";
    case 2:
      return "Medium";
    case 3:
      return "Intermediate";
    case 4:
      return "Large";
  }
};
