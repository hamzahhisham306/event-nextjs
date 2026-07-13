import type { FlattenMaps, Types } from "mongoose";
import { connection } from "next/server";

import { Event, type IEvent } from "@/database";
import connectDB from "@/lib/mongodb";

/**
 * Read-side data access. These are plain async functions, deliberately not
 * Server Actions: Server Components call them directly during render, and a
 * `"use server"` module would turn every export into a callable POST endpoint.
 */

/**
 * The shape an event takes once it leaves this module. Mongoose hands back an
 * ObjectId `_id` and Date timestamps, and neither survives the trip into a
 * Client Component or out of a `use cache` scope — both boundaries serialize.
 * Mapping fields explicitly also keeps the payload a whitelist, so nothing new
 * added to the schema leaks to the browser by accident.
 */
export type EventDTO = Omit<IEvent, "createdAt" | "updatedAt"> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

type LeanEvent = FlattenMaps<IEvent> & { _id: Types.ObjectId };

function toEventDTO(event: LeanEvent): EventDTO {
  return {
    _id: String(event._id),
    title: event.title,
    slug: event.slug,
    description: event.description,
    overview: event.overview,
    image: event.image,
    venue: event.venue,
    location: event.location,
    date: event.date,
    time: event.time,
    mode: event.mode,
    audience: event.audience,
    agenda: [...event.agenda],
    organizer: event.organizer,
    tags: [...event.tags],
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}

/**
 * Every event, newest first. Read fresh on each request.
 *
 * The Mongo driver reads the current clock while connecting, which Cache
 * Components rejects during prerendering. `connection()` excludes this query —
 * and the component awaiting it — from the prerender, so it runs at request
 * time and streams into the `<Suspense>` boundary that wraps it.
 *
 * Callers inside a `use cache` scope must use the functions below instead: a
 * request-time API like `connection()` is not allowed within a cached scope.
 */
export async function getEvents(): Promise<EventDTO[]> {
  await connection();
  await connectDB();

  const events = await Event.find().sort({ createdAt: -1 }).lean<LeanEvent[]>();

  return events.map(toEventDTO);
}

/** A single event by its public slug, or `null` when no such event exists. */
export async function getEventBySlug(slug: string): Promise<EventDTO | null> {
  await connectDB();

  const event = await Event.findOne({ slug: slug.trim().toLowerCase() }).lean<LeanEvent | null>();

  return event ? toEventDTO(event) : null;
}

/** Other events sharing at least one tag with the given event. */
export async function getSimilarEventsBySlug(slug: string): Promise<EventDTO[]> {
  await connectDB();

  const event = await Event.findOne({ slug: slug.trim().toLowerCase() }).lean<LeanEvent | null>();

  if (!event) return [];

  const similar = await Event.find({
    _id: { $ne: event._id },
    tags: { $in: event.tags },
  }).lean<LeanEvent[]>();

  return similar.map(toEventDTO);
}
