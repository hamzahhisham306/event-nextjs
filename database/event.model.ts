import { Schema, model, models, type Model } from "mongoose";

/** Delivery modes an event can be held in. */
export const EVENT_MODES = ["online", "offline", "hybrid"] as const;

export type EventMode = (typeof EVENT_MODES)[number];

export interface IEvent {
  title: string;
  /** URL-friendly identifier derived from `title` by the pre-save hook. */
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  /** ISO 8601 calendar date, normalized to `YYYY-MM-DD`. */
  date: string;
  /** 24-hour clock time, normalized to `HH:mm`. */
  time: string;
  mode: EventMode;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^(\d{1,2}):(\d{2})\s*(am|pm)?$/i;

/** Builds a URL-safe slug: "Next.js Conf 2026!" -> "next-js-conf-2026". */
function slugify(title: string): string {
  const slug = title
    // Split accented characters into base letter + diacritic, then drop the
    // diacritic, so "Café" slugs to "cafe" rather than losing the character.
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // A title of purely non-Latin characters slugifies to an empty string, which
  // would collide with every other such title under the unique index.
  if (!slug) {
    throw new Error(`Cannot derive a slug from title "${title}".`);
  }

  return slug;
}

/** Formats a Date as `YYYY-MM-DD` using its local components. */
function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/** Normalizes any parseable date string to an ISO `YYYY-MM-DD` calendar date. */
function normalizeDate(value: string): string {
  const trimmed = value.trim();
  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date "${value}". Expected a parseable date, e.g. "2026-07-12".`);
  }

  // Date-only ISO strings are parsed as UTC midnight, so reading them back with
  // local getters could shift the day in a negative-offset timezone. They are
  // already in the target format, so pass them through untouched. Any other input
  // ("July 12, 2026") is parsed in local time and is safe to format locally.
  return ISO_DATE_PATTERN.test(trimmed) ? trimmed : toIsoDate(parsed);
}

/** Normalizes "9:00 AM", "9:00am", or "09:00" to a 24-hour `HH:mm` string. */
function normalizeTime(value: string): string {
  const match = TIME_PATTERN.exec(value.trim());

  if (!match) {
    throw new Error(`Invalid time "${value}". Expected "HH:mm" or "h:mm AM/PM".`);
  }

  const [, rawHours, rawMinutes, meridiem] = match;
  let hours = Number(rawHours);
  const minutes = Number(rawMinutes);

  if (meridiem) {
    if (hours < 1 || hours > 12) {
      throw new Error(`Invalid time "${value}". A 12-hour clock runs from 1 to 12.`);
    }

    // On a 12-hour clock 12 AM is midnight (00) and 12 PM is noon (12), so the
    // hour wraps to 0 before the PM offset is applied.
    hours = (hours % 12) + (meridiem.toLowerCase() === "pm" ? 12 : 0);
  }

  if (hours > 23 || minutes > 59) {
    throw new Error(`Invalid time "${value}".`);
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// `required` on a trimmed string rejects both a missing value and one that is
// blank, since trimming runs before validation and "" fails the required check.
const requiredString = () => ({ type: String, required: true, trim: true }) as const;

/** Rejects empty arrays and arrays holding blank entries. */
const nonEmptyStrings = () =>
  ({
    type: [{ type: String, trim: true }],
    required: true,
    validate: {
      validator: (value: string[]) => value.length > 0 && value.every((item) => item.length > 0),
      message: "{PATH} must contain at least one non-empty entry.",
    },
  }) as const;

const EventSchema = new Schema<IEvent>(
  {
    title: requiredString(),
    // Not `required`: validation runs before the pre-save hook that fills this in,
    // so requiring it here would reject every insert. The unique index below is
    // what actually guarantees a slug is present and distinct in the database.
    slug: { type: String, trim: true },
    description: requiredString(),
    overview: requiredString(),
    image: requiredString(),
    venue: requiredString(),
    location: requiredString(),
    // `date` and `time` carry raw user input until the pre-save hook normalizes
    // them, so they deliberately have no format validator here — one would run
    // before the hook and reject input the hook is able to accept.
    date: requiredString(),
    time: requiredString(),
    mode: { type: String, required: true, enum: EVENT_MODES },
    audience: requiredString(),
    agenda: nonEmptyStrings(),
    organizer: requiredString(),
    tags: nonEmptyStrings(),
  },
  { timestamps: true },
);

// Guarantees slugs are unique and makes lookups by slug (the public URL) fast.
EventSchema.index({ slug: 1 }, { unique: true });

// Runs after schema validation, so `date` and `time` still hold raw input here.
// Anything thrown rejects the `save()` call.
EventSchema.pre("save", async function () {
  // True for new documents as well as title edits, so a slug is always produced
  // on insert and only recomputed when the title actually changes.
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }

  if (this.isModified("date")) {
    this.date = normalizeDate(this.date);
  }

  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }
});

// Reuse the compiled model across hot reloads; recompiling under the same name
// throws OverwriteModelError.
export const Event: Model<IEvent> =
  (models.Event as Model<IEvent> | undefined) ?? model<IEvent>("Event", EventSchema);
