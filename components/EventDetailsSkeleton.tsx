import React from 'react'

/**
 * Placeholder shown while `EventDetails` resolves. It mirrors that component's
 * markup and reuses the `#event` classes, so the real content drops into the
 * same boxes and the page doesn't shift when it streams in.
 */

const SkeletonLine = ({ className = "" }: { className?: string }) => (
    <div className={`skeleton h-4 ${className}`} />
)

const SkeletonDetailItem = ({ width }: { width: string }) => (
    <div className="flex-row-gap-2 items-center">
        <div className="skeleton size-[17px] shrink-0 rounded" />
        <SkeletonLine className={width} />
    </div>
)

const SkeletonCard = () => (
    <div className="flex flex-col gap-3">
        <div className="skeleton h-[300px] w-full rounded-lg" />
        <SkeletonLine className="h-5 w-3/4" />
        <SkeletonLine className="w-full" />
        <div className="flex flex-row gap-4">
            <SkeletonLine className="h-3 w-28" />
            <SkeletonLine className="h-3 w-20" />
        </div>
    </div>
)

const EventDetailsSkeleton = () => (
    <section id="event" aria-busy="true">
        <span className="sr-only" role="status">Loading event details</span>

        <div className="header">
            <SkeletonLine className="h-12 w-2/3 max-sm:h-9" />
            <SkeletonLine className="w-full" />
            <SkeletonLine className="w-4/5" />
        </div>

        <div className="details">
            {/*    Left Side - Event Content */}
            <div className="content">
                <div className="skeleton h-[457px] w-full rounded-lg" />

                <section className="flex-col-gap-2">
                    <SkeletonLine className="mb-2 h-7 w-40" />
                    <SkeletonLine className="w-full" />
                    <SkeletonLine className="w-5/6" />
                </section>

                <section className="flex-col-gap-2">
                    <SkeletonLine className="mb-2 h-7 w-48" />

                    <SkeletonDetailItem width="w-32" />
                    <SkeletonDetailItem width="w-20" />
                    <SkeletonDetailItem width="w-44" />
                    <SkeletonDetailItem width="w-24" />
                    <SkeletonDetailItem width="w-36" />
                </section>

                <div className="agenda">
                    <SkeletonLine className="mb-2 h-7 w-32" />
                    <SkeletonLine className="w-4/5" />
                    <SkeletonLine className="w-3/5" />
                </div>

                <section className="flex-col-gap-2">
                    <SkeletonLine className="mb-2 h-7 w-56" />
                    <SkeletonLine className="w-2/3" />
                </section>

                <div className="flex flex-row flex-wrap gap-1.5">
                    <div className="skeleton h-8 w-20 rounded-[6px]" />
                    <div className="skeleton h-8 w-24 rounded-[6px]" />
                    <div className="skeleton h-8 w-16 rounded-[6px]" />
                </div>
            </div>

            {/*    Right Side - Booking Form */}
            <aside className="booking">
                <div className="signup-card">
                    <SkeletonLine className="h-7 w-44" />
                    <SkeletonLine className="w-full" />

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <SkeletonLine className="h-3 w-16" />
                            <div className="skeleton h-11 w-full rounded-[6px]" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <SkeletonLine className="h-3 w-16" />
                            <div className="skeleton h-11 w-full rounded-[6px]" />
                        </div>
                        <div className="skeleton h-12 w-full rounded-[6px]" />
                    </div>
                </div>
            </aside>
        </div>

        <div className="flex w-full flex-col gap-4 pt-20">
            <SkeletonLine className="h-7 w-48" />
            <div className="events">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    </section>
)

export default EventDetailsSkeleton
