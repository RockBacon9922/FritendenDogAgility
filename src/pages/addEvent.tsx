import type { NextPage } from "next";
import Head from "next/head";
import { api } from "../utils/api";
import { useRouter } from "next/router";
import { type FormEvent, useState } from "react";
import type Dog from "../types/Dog";
import { useSession } from "next-auth/react";
import type Event from "../types/Event";
import Home from "../../Images/home.svg";
import Image from "next/image";
import Link from "next/link";

interface DogWithId extends Dog {
  id: string;
}

const ManageEvents: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id as string;
  const { data: dogs, status: dogsStatus } = api.dogs.getDogsByUserId.useQuery({
    userId,
  });
  const mutation = api.events.addEvent.useMutation({
    onSuccess: () => {
      void router.push("/eventLog");
    },
  });
  const handleAddEvent = (event: Event) => {
    mutation.mutate(event);
  };
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (dogsStatus === "loading") {
    return <div>Loading...</div>;
  }
  if (dogsStatus === "error") {
    void router.push("/addDog?addEvent=true");
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
      {mutation.isSuccess && (
        <SuccessMessage message="completed Successfully" />
      )}
      {mutation.isError && (
        <ErrorMessage message="Something went wrong, Please try again" />
      )}
      <div className="flex justify-center gap-4 md:flex-row">
        <AddDog
          userId={userId}
          dogs={dogs as DogWithId[]}
          onAddEvent={handleAddEvent}
        />
      </div>
      <div className=""></div>
    </>
  );
};

export default ManageEvents;

type AddDogProps = {
  userId: string;
  onAddEvent: (event: Event) => void;
  dogs: DogWithId[];
};

const AddDog: React.FC<AddDogProps> = ({ userId, onAddEvent, dogs }) => {
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
        if (
          element.name === "grade" ||
          element.name === "place" ||
          element.name === "points"
        ) {
          data = { ...data, [element.name]: parseInt(element.value) };
          continue;
        } else if (element.name === "kennelClub") {
          data = {
            ...data,
            [element.name]: element.value === "on" ? true : false,
          };
          continue;
        } else if (element.name === "dateOfEvent") {
          data = {
            ...data,
            [element.name]: new Date(element.value),
          };
          continue;
        } else if (element.name === "dogId") {
          const findDog = dogs.find((dog) => dog.id === element.value);
          data = {
            ...data,
            [element.name]: element.value,
            grade: findDog?.grade,
            height: findDog?.height,
            userId: findDog?.userId,
            leagueId: findDog?.leagueId,
          };
          continue;
        }
        data = { ...data, [element.name]: element.value };
      }
    }
    // form.reset();
    onAddEvent(data as unknown as Event);
  };

  return (
    <div className="card">
      <div className="card-header">
        <Link href="/">
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <Image src={Home} alt="home" width={50} height={50} />
        </Link>
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
          <FormField label="Dog">
            <select className="selectClass" id="dogId" name="dogId">
              {dogs.map((dog) => (
                <option key={dog.id} value={dog.id}>
                  {dog.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Kennel Club Show">
            <input
              type="checkbox"
              className="inputClass checkbox checkbox-sm"
              id="kennelClub"
              name="kennelClub"
            />
          </FormField>
          <FormField label="Event Name">
            <input
              type="text"
              className="inputClass"
              id="eventName"
              name="eventName"
              required
            />
          </FormField>
          <FormField label="Event Type">
            <select className="selectClass" id="eventType" name="eventType">
              <option value="Agility">Agility</option>
              <option value="Jumping">Jumping</option>
              <option value="specials">
                Specials e.g steeple chase, pairs
              </option>
            </select>
          </FormField>
          <FormField label="Date of Event">
            <input
              type="date"
              className="inputClass"
              id="dateOfEvent"
              name="dateOfEvent"
              required
            />
          </FormField>
          <FormField label="Place">
            <select className="selectClass" id="place" name="place">
              <option value="1">1st</option>
              <option value="2">2nd</option>
              <option value="3">3rd</option>
              <option value="4">4th</option>
            </select>
          </FormField>
          <FormField label="Points">
            <input
              className="selectClass"
              defaultValue={0}
              id="points"
              name="points"
              required
            />
          </FormField>

          {/* create submit button using daisy ui */}
          <button type="submit" className="btn-primary btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
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

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

const FormField = ({ label, children }: FormFieldProps) => {
  return (
    <div className="form-control">
      <label htmlFor={label} className="labelClass">
        {label}
      </label>
      {children}
    </div>
  );
};
