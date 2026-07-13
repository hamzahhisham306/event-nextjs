import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getBaseUrl } from "@/lib/getBaseUrl";

const FeaturedEvents = async () => {
  const baseUrl = getBaseUrl();
  const response = await fetch(
    `${baseUrl}/api/events`,
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
