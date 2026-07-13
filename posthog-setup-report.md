<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevEvent Next.js App Router application. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route analytics requests through `/ingest` — avoiding ad blockers. Four client-side events are now tracked across three components and one page, capturing the key user interactions in the event-discovery funnel.

| Event name | Description | File |
|---|---|---|
| `explore_button_clicked` | User clicks the Explore button on the home page to scroll down to featured events. | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on a featured event card, with event title, slug, location, and date as properties. | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicks a navigation link in the top navbar, with the link label as a property. | `components/Navbar.tsx` |
| `user_profile_viewed` | User views a specific user profile in the dashboard, with user_id as a property. | `app/dashboard/users/[id]/page.tsx` |

## Next steps

We've built a dashboard and four insights in PostHog to keep an eye on user behavior:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/509163/dashboard/1836863)
- [Event card clicks by event (wizard)](https://us.posthog.com/project/509163/insights/FelGsEkq) — bar chart of event card clicks broken down by event title
- [Explore button clicks over time (wizard)](https://us.posthog.com/project/509163/insights/YPXtw6Q6) — daily line chart of homepage explore engagement
- [Explore to event click funnel (wizard)](https://us.posthog.com/project/509163/insights/1YJhJydz) — conversion funnel from explore button → event card click
- [Nav link clicks by label (wizard)](https://us.posthog.com/project/509163/insights/t9tVRrig) — bar chart of navbar clicks by link label

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
