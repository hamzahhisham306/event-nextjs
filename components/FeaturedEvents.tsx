import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";

const FeaturedEvents = async () => {
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
    <ul className="events">
      {events.map((event: IEvent) => (
        <li key={event.slug}>
          <EventCard {...event} />
        </li>
      ))}
    </ul>
  );
};

export default FeaturedEvents;
