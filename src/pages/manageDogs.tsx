import { type GetServerSideProps } from "next";
import Head from "next/head";
import { getServerAuthSession } from "../server/auth";
import { api } from "../utils/api";
import { useRouter } from "next/router";
import { type FormEvent, useState } from "react";
import Link from "next/link";
import home from "../../Images/home.svg";
import type Dog from "../types/Dog";
import Image from "next/image";

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

type ManageDogsProps = {
  userId: string;
};

const ManageDogs: React.FC<ManageDogsProps> = ({ userId }) => {
  const dogs = api.dogs.getDogs.useQuery({ userId });
  const mutation = api.dogs.addDog.useMutation({
    onSuccess: async () => {
      await dogs.refetch();
    },
  });
  const handleAddDog = (dog: Dog) => {
    mutation.mutate(dog);
  };
  return (
    <>
      <Head>
        <title>FDA League</title>
        <meta name="description" content="The dog agility league " />
      </Head>
      {mutation.isSuccess && (
        <SuccessMessage message="completed Successfully" />
      )}
      {mutation.isError && (
        <ErrorMessage message="Something went wrong, Please try again" />
      )}
      <AddEventWarning />
      <div className="flex flex-col justify-center gap-4 md:flex-row">
        <AddDog userId={userId} onAddDog={handleAddDog} />
        <EditDogs dogData={dogs.data} />
      </div>
      <div className=""></div>
    </>
  );
};

export default ManageDogs;

type AddDogProps = {
  userId: string;
  onAddDog: (dog: Dog) => void;
};

const AddDog: React.FC<AddDogProps> = ({ userId, onAddDog }) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    let data = {};
    for (const element of form.elements) {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement
      ) {
        // add elements to data object
        if (element.name === "age" || element.name === "grade") {
          data = { ...data, [element.name]: parseInt(element.value) };
          continue;
        }
        data = { ...data, [element.name]: element.value };
      }
    }
    form.reset();
    onAddDog(data as unknown as Dog);
  };
  return (
    <div className="card">
      <Link href="/">
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
        <Image src={home} alt="return home" />
      </Link>
      <div className="card-header">
        <h3 className="text-3xl font-extrabold text-primary">Add a Dog</h3>
      </div>
      <div className="my-2 mx-8">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <input
            hidden
            defaultValue={userId}
            id="userId"
            name="userId"
            required
          />
          <div className="form-control">
            <label htmlFor="name" className="labelClass">
              Dog Name
            </label>
            <input
              type="text"
              className="inputClass"
              id="name"
              name="name"
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="showName" className="labelClass">
              Show Name
            </label>
            <input
              type="text"
              className="inputClass"
              id="showName"
              name="showName"
            />
          </div>
          <div className="form-control">
            <label htmlFor="breed" className="labelClass">
              Breed
            </label>
            <input
              type="text"
              className="inputClass"
              id="breed"
              name="breed"
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="league" className="labelClass">
              League
            </label>
            <select className="selectClass" id="league" name="league">
              <option value="FDAAllAges">
                Frittenden Dog Agility All Ages
              </option>
              <option value="FDASeniors">Frittenden Dog Agility Seniors</option>
              <option value="FDAYoungHandlers">
                Frittenden Dog Agility Young Handlers
              </option>
              <option value="FDAJuniors">Frittenden Dog Agility Juniors</option>
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="age" className="labelClass">
              Dog Age
            </label>
            <input
              type="number"
              defaultValue={0}
              required
              className="selectClass"
              id="age"
              name="age"
            />
          </div>
          <div className="form-control">
            <label htmlFor="grade" className="labelClass">
              Grade
            </label>
            <select className="selectClass" id="grade" name="grade">
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="height" className="labelClass">
              Height
            </label>
            <select className="selectClass" id="height" name="height">
              <option value="Large">Large</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Medium">Medium</option>
              <option value="Small">Small</option>
              <option value="Micro">Micro</option>
            </select>
          </div>
          {/* create submit button using daisy ui */}
          <button type="submit" className="btn-primary btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

interface EditDog extends Dog {
  id: string;
}

type EditDogsProps = {
  // extend dog type with id
  dogData: EditDog[] | undefined;
};

const EditDogs: React.FC<EditDogsProps> = ({ dogData }) => {
  // check if dogData is undefined
  if (!dogData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-3xl font-extrabold text-primary">Edit Dogs</h3>
      </div>
      <div className="card-body overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="">Name</th>
              <th>Show Name</th>
              <th>Breed</th>
              <th>League</th>
              <th>Age</th>
              <th>Grade</th>
              <th>Height</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="overflow-y-scroll">
            {dogData?.map((dog) => (
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              <tr key={dog.id}>
                <td>{dog.name}</td>
                <td>{dog.showName}</td>
                <td>{dog.breed}</td>
                <td>{dog.league}</td>
                <td>{dog.age}</td>
                <td>{dog.grade}</td>
                <td>{dog.height}</td>
                <td>
                  <Link href={`/dogs/${dog.id}`}>
                    <p className="btn-primary btn">Edit</p>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AddEventWarning = () => {
  const router = useRouter();
  const [addEvent, setAddEvent] = useState(!!router.query.addEvent);
  setTimeout(() => {
    setAddEvent(false);
  }, 5000);
  if (addEvent) {
    return (
      <div className="alert alert-error">
        {" "}
        You need to add a dog before you can add an event
      </div>
    );
  }
  return null;
};

const ErrorMessage = ({ message }: { message: string }) => {
  const [show, setShow] = useState(true);
  setTimeout(() => {
    setShow(false);
  }, 5000);
  if (!show) return null;
  return <div className="alert alert-error animate-ping">{message}</div>;
};

const SuccessMessage = ({ message }: { message: string }) => {
  const [show, setShow] = useState(true);
  setTimeout(() => {
    setShow(false);
  }, 5000);
  if (!show) return null;
  return <div className="alert alert-success animate-pulse">{message}</div>;
};
