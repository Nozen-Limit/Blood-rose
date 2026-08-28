import { getStats, getTestimonials, getOfficers } from "@/lib/data";
import Hero from "@/components/Hero";
import HomeFx from "@/components/HomeFx";
import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import Officers from "@/components/Officers";

const GOALS = [
  {
    title: "Healthy & Supportive",
    body: "A helpful, drama-free environment for every member.",
    icon: <path d="M12 21s-7-4.35-9.5-8.5C1 9 3 5 6.5 5 9 5 12 8 12 8s3-3 5.5-3C21 5 23 9 21.5 12.5 19 16.65 12 21 12 21z" />,
  },
  {
    title: "A Home for Every Level",
    body: "Enough range across the roster that everyone has a party to team up with and progress.",
    icon: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></>,
  },
  {
    title: "Builds & Market Guidance",
    body: "Assistance with builds and market prices whenever you need it.",
    icon: <><path d="M12 3v18" /><path d="M5 8l7-5 7 5" /><path d="M5 8v8l7 5 7-5V8" /></>,
  },
  {
    title: "Events & Giveaways",
    body: "Consistent weekly and monthly events, spontaneous giveaways, and quiz games with generous rewards.",
    icon: <><path d="M20 12v9H4v-9" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /><path d="M12 7S9 2 6 4s1 3 6 3zM12 7s3-5 6-3-1 3-6 3z" /></>,
  },
  {
    title: "A Place to Call Home",
    body: "Creating a memorable place that people actually want to stick around for.",
    icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  },
];

export default async function HomePage() {
  /* One round trip for all three, rather than three sequential waits. */
  const [stats, testimonials, officers] = await Promise.all([
    getStats(), getTestimonials(), getOfficers(),
  ]);

  return (
    <>
      <HomeFx />
      <Hero stats={stats} />

      <section className="section" id="story">
        <div className="story-grid">
          <Reveal className="story-emblem">
            <div className="story-ring story-ring-1" aria-hidden="true" />
            <div className="story-ring story-ring-2" aria-hidden="true" />
            <div className="story-photo">
              {/* eslint-disable-next-line @next/next/no-img-element --
                  fills a CSS-shaped circular frame; see Hero for the same
                  reasoning about next/image's wrapper. */}
              <img src="/images/emblem.webp" alt="Blood Rose emblem" loading="lazy" width={560} height={560} />
            </div>
          </Reveal>

          <Reveal className="story-copy">
            <h2>Our Story</h2>
            <p>
              Blood Rose is a guild built on what made the old Arcane Legends days
              work: communication, knowledge, and hard work. Our leadership fully
              understands the game&apos;s mechanics and is always ready to teach and
              help members progress their characters.
            </p>
            <p>
              Blood Rose was founded by a small group who wanted to create a place
              where everyone &mdash; new and old members alike &mdash; could get the same help
              and guidance we once received on our way to end-game content. That&apos;s
              why there are no requirements to join: everyone is welcome, and
              every level gets the same help, equally.
            </p>
            <p>
              Hard work pays off. Both leadership and members work constantly to
              keep the guild healthy, supportive, and free of drama &mdash; and that&apos;s
              what took us to a top 2 leaderboard position in under a year, with
              more than 70 members online daily.
            </p>
            <Testimonials quotes={testimonials} />
          </Reveal>
        </div>
      </section>

      <section className="section" id="goals">
        <h2>Our Goals</h2>
        {/* goal-grid-pyramid forces 2 cards on top, 3 below, on screens
            wide enough for it (see cards.css). */}
        <div className="goal-grid goal-grid-pyramid">
          {GOALS.map((goal, i) => (
            <Reveal className="goal-card" key={goal.title} delay={(i % 3) * 80}>
              <div className="card-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">{goal.icon}</svg>
              </div>
              <h3>{goal.title}</h3>
              <p>{goal.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section" id="officers">
        <h2>Officers</h2>
        <Officers officers={officers} />
      </section>
    </>
  );
}
