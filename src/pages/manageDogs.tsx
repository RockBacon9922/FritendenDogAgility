import { type GetServerSideProps } from "next";
import Head from "next/head";
import { getServerAuthSession } from "../server/auth";
import { api } from "../utils/api";
import { useRouter } from "next/router";
import { type FormEvent, useState } from "react";
import Link from "next/link";

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

const ManageDogs = ({ userId }: { userId: string }) => {
  return (
    <>
      <Head>
        <title>FDA League</title>
        <meta name="description" content="The dog agility league " />
      </Head>
      <AddEventWarning />
      <div className="flex justify-center gap-4 md:flex-row">
        <AddDog userId={userId} />
        <EditDogs userId={userId} />
      </div>
      <div className=""></div>
    </>
  );
};

export default ManageDogs;

type Dog = {
  name: string;
  showName: string;
  breed: string;
  league: string;
  age: number;
  grade: number;
  height: string;
  userId: string;
};

const AddDog = ({ userId }: { userId: string }) => {
  const mutation = api.dogs.addDog.useMutation();
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
    mutation.mutate(data as Dog);
  };
  return (
    <div className="card">
      {mutation.isSuccess && (
        <SuccessMessage message="completed Successfully" />
      )}
      {mutation.isError && (
        <ErrorMessage message="Something went wrong, Please try again" />
      )}
      <div className="card-header">
        <h3 className="text-3xl font-extrabold text-primary">Add a Dog</h3>
      </div>
      <div className="card-body">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <input
            hidden
            defaultValue={userId}
            id="userId"
            name="userId"
            required
          />
          <div className="form-group">
            <label htmlFor="name">Dog Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="showName">Show Name</label>
            <input
              type="text"
              className="form-control"
              id="showName"
              name="showName"
            />
          </div>
          <div className="form-group">
            <label htmlFor="breed">Breed</label>
            <input
              type="text"
              className="form-control"
              id="breed"
              name="breed"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="league">League</label>
            <select className="form-control" id="league" name="league">
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
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              defaultValue={0}
              required
              className="form-control"
              id="age"
              name="age"
            />
          </div>
          <div className="form-group">
            <label htmlFor="grade">Grade</label>
            <select className="form-control" id="grade" name="grade">
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="height">Height</label>
            <select className="form-control" id="height" name="height">
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

const EditDogs = ({ userId }: { userId: string }) => {
  const dogs = api.dogs.getDogs.useQuery({ userId });
  if (dogs.isLoading) return <div>Loading...</div>;
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-3xl font-extrabold text-primary">Edit Dogs</h3>
      </div>
      <div className="card-body">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Show Name</th>
              <th>Breed</th>
              <th>League</th>
              <th>Age</th>
              <th>Grade</th>
              <th>Height</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dogs.data?.map((dog) => (
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
