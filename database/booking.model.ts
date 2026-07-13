import { Schema, model, models, type Model, type Types } from "mongoose";

import { Event } from "./event.model";

export interface IBooking {
  /** Reference to the booked `Event`. */
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Deliberately permissive: it rejects the common malformed shapes (no @, no dot,
// embedded whitespace) without trying to out-guess RFC 5322. Real verification is
// a confirmation email, not a regex.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      // `ref` is what lets callers `.populate("eventId")`; it does not enforce
      // that the event exists — the pre-save hook below does that.
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      // Stored lowercase so the same address can't book twice under different
      // casing. Setters run before validators, so the pattern sees the final value.
      lowercase: true,
      match: [EMAIL_PATTERN, "{VALUE} is not a valid email address."],
    },
  },
  { timestamps: true },
);

// Bookings are read by event ("who booked this event?"), which is an unindexed
// collection scan without this.
BookingSchema.index({ eventId: 1 });

// MongoDB does not enforce referential integrity, so a booking can otherwise point
// at an event that never existed or was deleted. Guarded by `isModified` to keep
// this to one extra query on insert rather than on every save.
BookingSchema.pre("save", async function () {
  if (!this.isModified("eventId")) {
    return;
  }

  const eventExists = await Event.exists({ _id: this.eventId });

  if (!eventExists) {
    throw new Error(`Cannot book event ${this.eventId.toString()}: it does not exist.`);
  }
});

// Reuse the compiled model across hot reloads; recompiling under the same name
// throws OverwriteModelError.
export const Booking: Model<IBooking> =
  (models.Booking as Model<IBooking> | undefined) ?? model<IBooking>("Booking", BookingSchema);
