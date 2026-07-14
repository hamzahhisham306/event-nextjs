import React from 'react'

/**
 * Placeholder for a single `EventCard`. Carries the same `#event-card` id so it
 * inherits the card's layout, poster and datetime rules, keeping the grid stable
 * when the real cards stream in.
 */

const SkeletonLine = ({ className = "" }: { className?: string }) => (
    <div className={`skeleton h-4 ${className}`} />
)

const SkeletonIcon = () => <div className="skeleton size-[14px] shrink-0 rounded" />

const EventCardSkeleton = () => (
    <div id="event-card">
        <div className="skeleton poster" />

        <div className="flex flex-row items-center gap-2">
            <SkeletonIcon />
            <SkeletonLine className="h-3 w-32" />
        </div>

        <SkeletonLine className="h-5 w-3/4" />

        <div className="datetime">
            <div className="items-center">
                <SkeletonIcon />
                <SkeletonLine className="h-3 w-24" />
            </div>
            <div className="items-center">
                <SkeletonIcon />
                <SkeletonLine className="h-3 w-14" />
            </div>
        </div>
    </div>
)

export default EventCardSkeleton
