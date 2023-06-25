import { useRouter } from "next/router";
import { api } from "../../utils/api";

const EditEvent = () => {
  // get slug from url
  const router = useRouter();
  const { event: eventSlug } = router.query;
  // if no slug redirect to dashboard
  if (!eventSlug) {
    void router.push("/dashboard");
    return <>Redirecting</>;
  }
  // get event data
  const { data, status } = api.events.getEventsById.useQuery({
    id: eventSlug as string,
  });

  return (
    <div>
      <form>
        {status === "loading" && <div>Loading...</div>}
        {status === "error" && <div>Error: {data.error.message}</div>}
        {status === "success" && (
          <>
            {TextInput("name", "Event Name", data?.event?.name)}
            {TextInput("date", "Event Date", data.event.date)}
            {TextInput("location", "Event Location", data.event.location)}
            {TextInput(
              "description",
              "Event Description",
              data.event.description
            )}
            <button type="submit">Submit</button>
          </>
        )}
      </form>
    </div>
  );
};

export default EditEvent;

const TextInput = (name: string, label: string, value: string) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input type="text" name={name} id={name} defaultValue={value} />
    </div>
  );
};
