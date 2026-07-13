import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";

const Home = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const { events } = await response.json();

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event you Can not Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events.map((event: any) => {
            return (
              <li key={event.slug}>
                <EventCard {...event} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Home;
