// Single import surface for the data layer: `import { Event, Booking } from "@/database"`.
// Importing from here also guarantees both models are registered with Mongoose,
// which `populate("eventId")` relies on.
export { Event, EVENT_MODES, type EventMode, type IEvent } from "./event.model";
export { Booking, type IBooking } from "./booking.model";
