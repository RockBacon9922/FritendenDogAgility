import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { type FormEvent } from "react";
import type Dog from "../../../@types/Dog";
import { useSession } from "next-auth/react";

interface EditDog extends Dog {
  id: string;
}

const EditPage: React.FC = () => {
  const { data: session, status } = useSession();
  const userId = session?.user.id as string;
  const leagues = api.leagues.getActiveLeagues.useQuery();
  // get dog id from url
  const router = useRouter();
  const { dog: dogSlug } = router.query;
  const getDog = api.dogs.getDog.useQuery({ id: dogSlug as string });
  const { data: dog } = getDog;
  const editMutation = api.dogs.editDog.useMutation({
    onSuccess: async () => {
      await router.push("/manageDogs");
    },
  });
  const deleteMutation = api.dogs.deleteDog.useMutation({
    onSuccess: async () => {
      await router.push("/manageDogs");
    },
  });
  const handleDelete = () => {
    deleteMutation.mutate({ id: dog?.id as string });
  };
  if (status === "loading") return <div>Loading...</div>;
  if (!session) {
    void router.push("/");
    return <div>Redirecting...</div>;
  }
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
    editMutation.mutate(data as unknown as EditDog);
    if (getDog.isLoading) return <div>Loading...</div>;
    if (getDog.isError) return <div>Error: {getDog.error.message}</div>;
  };
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-3xl font-extrabold text-primary">Edit A Dog</h3>
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
          <input hidden defaultValue={dog?.id} id="id" name="id" required />
          <div className="form-control">
            <label htmlFor="name" className="labelClass">
              Dog Name
            </label>
            <input
              type="text"
              className="inputClass"
              id="name"
              name="name"
              defaultValue={dog?.name}
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
              defaultValue={dog?.showName}
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
              defaultValue={dog?.breed}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="leagueId" className="labelClass">
              League
            </label>
            <select
              className="selectClass"
              id="leagueId"
              name="leagueId"
              defaultValue={dog.leagueId}
            >
              {leagues.data?.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="age" className="labelClass">
              Dog Age
            </label>
            <input
              type="number"
              required
              className="selectClass"
              id="age"
              name="age"
              defaultValue={dog?.age}
            />
          </div>
          <div className="form-control">
            <label htmlFor="grade" className="labelClass">
              Grade
            </label>
            <select
              className="selectClass"
              id="grade"
              name="grade"
              defaultValue={dog?.grade}
            >
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
            <select
              className="selectClass"
              id="height"
              name="height"
              defaultValue={dog?.height}
            >
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
        <span>
          <button className="btn-primary btn" onClick={() => router.back()}>
            Back
          </button>
          <button
            id="delete dog"
            className="btn-error btn"
            onClick={handleDelete}
          >
            Delete Dog
          </button>
        </span>
      </div>
    </div>
  );
};

export default EditPage;
