import Image from "next/image";
import Link from "next/link";

const APP_STORE_URL = "https://apps.apple.com/";

const featureMoments = [
  {
    eyebrow: "Make Bible study fun",
    title: "Open scripture without forcing the moment.",
    body: "Den makes the the Bible feel clear, gentle, and easy to return to every day.",
    image: "/Landing2.png",
    imageAlt: "Den mascot holding a Bible.",
    chips: ["Daily verses", "Make friends", "Easy to start"],
  },
  {
    eyebrow: "Remember what stayed with you",
    title: "Notes, progress, and highlights that keeps everything saved.",
    body: "Save what matters, see your growth, and come back to the verses that met you there.",
    image: "/Landing1.png",
    imageAlt: "Den mascot writing in a notebook.",
    chips: ["Highlights", "Notes", "Progress"],
    reverse: true,
  },
  {
    eyebrow: "Grow together",
    title: "A new way to explore the Bible with friends everyday.",
    body: "Keep streaks alive with your new and old friends.",
    image: "/Landing3.png",
    imageAlt: "Den mascot holding a blue flame.",
    chips: ["Start streaks", "Grow together", "Deeper understandings"],
  },
  {
    eyebrow: "Explore and learn",
    title: "Curated verses and guided discovery that leads you closer to the Lord.",
    body: "When you want to go deeper, Den opens a more thoughtful path through scripture and reflection.",
    image: "/Landing4.png",
    imageAlt: "Den mascot sitting with Jesus.",
    chips: ["Explore mode", "Guided reflection", "Companionship"],
    reverse: true,
  },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="mesh-orb one" />
      <div className="mesh-orb two" />
      <div className="mesh-orb three" />

      <div className="content-wrap">
        <div className="sticky-link-wrap reveal delay-1">
          <Link href="/privacy" className="privacy-link">
            Privacy Policy
          </Link>
        </div>

        <section className="glass-card hero-card reveal delay-1">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Everything in one place</span>
              <h1 className="hero-title">
                Grow
                <br />
                <span>Every</span> Day
              </h1>
              <p>
                Den is the home for daily scripture, guided learning,
                and growing with friends.
              </p>

              <div className="hero-rhythm">
                <span className="micro-chip">Read</span>
                <span className="micro-chip">Reflect</span>
                <span className="micro-chip">Make friends</span>
              </div>

              <div className="hero-actions">
                <a
                  className="primary-cta"
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on the App Store
                </a>
              </div>
            </div>

            <div className="section-visual reveal delay-2">
              <div className="visual-frame">
                <div className="visual-stage visual-stage-fill">
                  <Image
                    src="/Icon.png"
                    alt="Den app icon."
                    fill
                    sizes="(max-width: 980px) 100vw, 430px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card story-bridge reveal delay-2">
          <div className="story-bridge-copy">
            <span className="eyebrow">Daily faith</span>
            <h2>From invitation to new friends to hope.</h2>
            <p>
              Den moves with a rhythm so scripture becomes easier to
              begin, easier to remember, and easier to keep with others.
            </p>
          </div>

          <div className="story-bridge-grid">
            <div className="bridge-step">
              <strong>Begin softly</strong>
              <span>A clear place to meet each day in the Lords word.</span>
            </div>
            <div className="bridge-step">
              <strong>Keep what mattered</strong>
              <span>Notes and highlights that help yesterday stay present.</span>
            </div>
            <div className="bridge-step">
              <strong>Grow with others</strong>
              <span>Friends and communities that turn intent into progress.</span>
            </div>
          </div>
        </section>

        {featureMoments.map((moment, index) => (
          <section
            key={moment.title}
            className={`glass-card section-card reveal delay-${Math.min(index + 1, 4)}${
              moment.reverse ? " reverse" : ""
            }`}
          >
            <div className="section-copy">
              <span className="eyebrow">{moment.eyebrow}</span>
              <h2>{moment.title}</h2>
              <p>{moment.body}</p>
              <div className="section-tags">
                {moment.chips.map((chip) => (
                  <span key={chip} className="micro-chip">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="section-visual">
              <div className="visual-frame">
                <div className="visual-stage">
                  <Image
                    src={moment.image}
                    alt={moment.imageAlt}
                    width={768}
                    height={768}
                  />
                </div>
              </div>
            </div>
          </section>
        ))}

        <section className="glass-card cta-card reveal delay-4">
          <div className="cta-copy">
            <span className="eyebrow">Commit to the Lord</span>
            <h2>Bring the next moment back to Den.</h2>
            <p>
              Scripture, reflection, and accountability in one composed iOS
              companion built for daily return.
            </p>
          </div>

          <div className="cta-stack">
            <a
              className="primary-cta"
              href={APP_STORE_URL}
              target="_blank"
              rel="noreferrer"
            >
              Open App Store
            </a>
            <Link href="/privacy" className="secondary-cta">
              Read privacy policy
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
