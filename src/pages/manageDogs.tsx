import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import add from "../../Images/add.svg";
import { getServerAuthSession } from "../server/auth";
import Link from "next/link";
import signOutIcon from "../../Images/signOut.svg";
import { PrismaClient } from "@prisma/client";
import { api } from "../utils/api";
import { z } from "zod";
import { FormEvent } from "react";
import home from "../../Images/home.svg";

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
  const userId = session.user.id;
  return {
    props: {
      userId,
    },
  };
};

const AddAndEditDogs = ({ userId }: { userId: string }) => {
  // get the current user
  const dogs = api.db.getDogs.useQuery({ userId: userId });
  const editMutation = api.db.editDog.useMutation();
  const addMutation = api.db.addDog.useMutation({
    onSuccess: async () => {
      await dogs.refetch();
    }
  });
  const deleteMutation = api.db.deleteDog.useMutation({
    onSuccess: async () => {
      await dogs.refetch();
    }
  });

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const id = e.target.id.value as string;
    const userId = e.target.userId.value as string;
    const name = e.target.name.value as string;
    const breed = e.target.breed.value as string;
    const height = parseInt(e.target.height.value as string);
    const age = parseInt(e.target.age.value as string);
    const grade = parseInt(e.target.grade.value as string);
    const showName = e.target.showName.value as string;
    return await editMutation.mutateAsync({
      id,
      userId,
      name,
      breed,
      height,
      age,
      grade,
      showName,
    });
  };

  const deleteDog = (id: string) => async () => {
    return await deleteMutation.mutateAsync({ id });
  };


  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userId = e.target.userId.value as string;
    const name = e.target.name.value as string;
    const breed = e.target.breed.value as string;
    const height = parseInt(e.target.height.value as string);
    const age = parseInt(e.target.age.value as string);
    const grade = parseInt(e.target.grade.value as string);
    const showName = e.target.showName.value as string;
    e.target.reset()
    return await addMutation.mutateAsync({
      userId,
      name,
      breed,
      height,
      age,
      grade,
      showName,
    });
  };

  return (
    <>
      <Head>
        <title>FDA League</title>
        <meta name="description" content="The dog agility league " />
      </Head>
      {editMutation.isLoading && <UpdatingAlert />}
      {addMutation.isLoading && <UpdatingAlert />}
      {deleteMutation.isLoading && <UpdatingAlert />}
      <div className="h-screen bg-base-100">
        {dogs.data?.map((dog) => (
          <form key={dog.id} className="" onSubmit={handleEditSubmit}>
            <input type="hidden" name="id" defaultValue={dog.id} />
            <input type="hidden" name="userId" defaultValue={userId} />
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" defaultValue={dog.name} />
            <label htmlFor="breed">Breed</label>
            <input
              type="text"
              name="breed"
              id="breed"
              defaultValue={dog.breed}
            />
            <label htmlFor="height">Height</label>
            <input
              type="text"
              name="height"
              id="height"
              defaultValue={dog.height}
            />
            <label htmlFor="age">Age</label>
            <input type="text" name="age" id="age" defaultValue={dog.age} />
            <label htmlFor="grade">Grade</label>
            <input
              type="text"
              name="grade"
              id="grade"
              defaultValue={dog.grade}
            />
            <label htmlFor="showName">ShowName</label>
            <input
              type="text"
              name="showName"
              id="showName"
              defaultValue={dog.showName}
            />
            <button type="submit">Submit</button>
            <p onClick={deleteDog(dog.id)}>delete</p>
          </form>
        ))}
        <br />
        <h3>Add dog</h3>
        <form className="" onSubmit={handleAddSubmit}>
          <input type="hidden" name="userId" defaultValue={userId} />
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" />
          <label htmlFor="breed">Breed</label>
          <input type="text" name="breed" id="breed" />
          <label htmlFor="height">Height</label>
          <input type="text" name="height" id="height" />
          <label htmlFor="age">Age</label>
          <input type="text" name="age" id="age" />
          <label htmlFor="grade">Grade</label>
          <input type="text" name="grade" id="grade" />
          <label htmlFor="showName">ShowName</label>
          <input type="text" name="showName" id="showName" />
          <button type="submit">Submit</button>
        </form>
        <Link href="/">
          <Image src={home} alt="Home Button" />
        </Link>
      </div>
    </>
  );
};

export default AddAndEditDogs;

const UpdatingAlert = () => {
  return (
    <div className="alert shadow-lg">
      <span>Updating Database Please Wait</span>
    </div>
  );
};
