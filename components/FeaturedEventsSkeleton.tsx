import React from 'react'

import EventCardSkeleton from "@/components/EventCardSkeleton";

/**
 * Placeholder for `FeaturedEvents`. Mirrors its `ul.events` grid so the real
 * cards land in the same tracks. Three cards fills one row at every breakpoint.
 */
const FeaturedEventsSkeleton = () => (
    <>
        <span className="sr-only" role="status">Loading featured events</span>

        <ul className="events" aria-busy="true">
            {Array.from({ length: 3 }, (_, index) => (
                <li key={index}>
                    <EventCardSkeleton />
                </li>
            ))}
        </ul>
    </>
)

export default FeaturedEventsSkeleton
