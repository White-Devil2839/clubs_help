import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";

export default function Home() {
  const { user } = useAuth();
  const headline = user ? `Welcome back, ${user.name}` : "Elevate Your Campus Experience";
  const subline = user
    ? "Your hub for exclusive events, club memberships, and community leadership."
    : "Join a thriving community of innovators, creators, and leaders. Discover clubs, attend exclusive events, and shape your campus journey.";

  const highlights = [
    {
      title: "Curated Communities",
      text: "Explore a diverse ecosystem of clubs ranging from tech innovators to cultural pioneers.",
    },
    {
      title: "Seamless Events",
      text: "Experience hassle-free event registration with instant confirmations and smart reminders.",
    },
    {
      title: "Empowered Leadership",
      text: "Advanced tools for club admins to manage members, approve requests, and orchestrate events.",
    },
  ];

  const stats = [
    { value: "120+", label: "Active Clubs" },
    { value: "2.5k+", label: "Members" },
    { value: "50+", label: "Weekly Events" },
    { value: "4.9", label: "Community Rating" },
  ];

  const marquee = ["Design Collective", "AI Research Lab", "Green Earth", "Debate Society", "Robotics Core", "FinTech Club", "Music Society"];

  return (
    <>
      <Reveal as="section" className="page-card hero-card">
        <PageHeader
          eyebrow="The Future of Campus Life"
          title={headline}
          description={subline}
          actions={
            <>
              <Link to="/clubs" className="btn btn-primary">
                Explore Communities
              </Link>
              {!user && (
                <Link to="/register" className="btn btn-outline">
                  Join Now
                </Link>
              )}
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
