'use server';

import {Booking} from '@/database';

import connectDB from "@/lib/mongodb";

export const createBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string; }) => {
    try {
        await connectDB();

        if (!eventId || !slug || !email) {
            throw new Error('Missing required fields for booking creation');
        }
        

        await Booking.create({ eventId, slug, email });

        return { success: true };
    } catch (e) {
        console.error('create booking failed', e);
        return { success: false };
    }
}