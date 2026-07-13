import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event, IEvent } from "@/database";

type RouteParams = {
    params: Promise<{ slug: string }>;
}


export async function GET(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
    try {
        await connectDB();
        const { slug } = await params;

        if (!slug || typeof slug !== 'string') {
            return NextResponse.json({ message: 'Invalid slug parameter' }, { status: 400 });
        }
        const sanitizedSlug = slug.trim().toLowerCase();
        const event = await Event.findOne({ slug: sanitizedSlug }).lean();

        if (!event) {
            return NextResponse.json({ message: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json({ event }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }


}