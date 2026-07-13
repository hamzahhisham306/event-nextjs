import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import { Event } from '@/database';

/**
 * `tags` and `agenda` are arrays, but multipart form-data has no array type — every
 * value arrives as a string. Accept the three shapes a client may reasonably send:
 * repeated keys, a JSON array string, or a comma-separated list.
 */
function parseStringArray(formData: FormData, field: string): string[] {
    const entries = formData.getAll(field).filter((value): value is string => typeof value === 'string');

    // Repeated keys: tags=nextjs&tags=react
    if (entries.length > 1) {
        return entries.map((value) => value.trim()).filter(Boolean);
    }

    const raw = entries[0]?.trim();

    if (!raw) return [];

    // JSON array: '["nextjs","react"]'
    if (raw.startsWith('[')) {
        try {
            const parsed: unknown = JSON.parse(raw);

            if (Array.isArray(parsed)) {
                return parsed.map((value) => String(value).trim()).filter(Boolean);
            }
        } catch {
            // Not valid JSON after all — fall through and treat it as a plain list.
        }
    }

    // Comma-separated: 'nextjs,react,conference'
    return raw.split(',').map((value) => value.trim()).filter(Boolean);
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON data format' }, { status: 400 })
        }

        const file = formData.get('image') as File;

        if (!file) return NextResponse.json({ message: 'Image file is required' }, { status: 400 })

        const tags = parseStringArray(formData, 'tags');
        const agenda = parseStringArray(formData, 'agenda');

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                if (error) return reject(error);

                resolve(results);
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        // Spread first, then overwrite: `event` still holds the raw string forms of
        // these two fields, which Mongoose would otherwise cast to a single-item array.
        const createdEvent = await Event.create({
            ...event,
            tags,
            agenda,
        });

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 })
    }
}

export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 });
    }
}