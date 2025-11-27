import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";

export default function Home() {
  const { user } = useAuth();
  const headline = user ? `Welcome back, ${user.name}` : "Your campus life, curated";
  const subline = user
    ? "Pick up where you left off — new memberships, upcoming events, and more await."
    : "Discover vibrant clubs, register for high-energy events, and track your activity in one delightful experience.";

  const highlights = [
    {
      title: "Discover",
      text: "Browse a curated list of clubs across tech, cultural, and extracurricular categories.",
    },
    {
      title: "Engage",
      text: "Register for events, get instant confirmations, and manage every RSVP effortlessly.",
    },
    {
      title: "Lead",
      text: "Admins approve memberships, launch events, and manage members with modern tooling.",
    },
  ];

  const stats = [
    { value: "120+", label: "Clubs & societies" },
    { value: "2.4k", label: "Monthly registrations" },
    { value: "48", label: "Live events" },
    { value: "98%", label: "Positive feedback" },
  ];

  const marquee = ["Design Thinkers", "AI Collective", "Eco Warriors", "Social Impact Lab", "GDSC", "Film Club", "Entrepreneurship Club"];

  return (
    <>
      <Reveal as="section" className="page-card hero-card">
        <PageHeader
          eyebrow="Campus clubs"
          title={headline}
          description={subline}
          actions={
            <>
              <Link to="/clubs" className="btn btn-primary">
                Explore clubs
              </Link>
              <Link to="/events" className="btn btn-outline">
                Upcoming events
              </Link>
            </>
          }
        />
        <div className="stat-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="marquee">
          <div className="marquee-track">
            {marquee.concat(marquee).map((item, idx) => (
              <span key={`${item}-${idx}`} className="marquee-pill">
                {item}
              </span>
            ))}
          </div>
    </div>
      </Reveal>
      <Reveal as="section" className="card-grid" delay={200}>
        {highlights.map((item) => (
          <article key={item.title} className="entity-card">
            <h3>{item.title}</h3>
            <p className="muted">{item.text}</p>
          </article>
        ))}
      </Reveal>
    </>
  );
}
