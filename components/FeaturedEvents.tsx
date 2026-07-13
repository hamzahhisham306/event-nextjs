import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/data/events";

const FeaturedEvents = async () => {
  const events = await getEvents();

  if (events.length === 0) {
    return <p>No events yet. Check back soon.</p>;
  }

  return (
    <ul className="events">
      {events.map((event) => (
        <li key={event.slug}>
          <EventCard {...event} />
        </li>
      ))}
    </ul>
  );
};

export default FeaturedEvents;
