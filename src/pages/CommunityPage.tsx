import { Flame, Send } from "lucide-react";
import { leaderboard, communityPosts } from "../data";
import { useToast } from "../contexts/ToastContext";
import { Reveal, StaggerContainer, StaggerItem } from "../components/Reveal";
import { SectionHeading, LeaderboardTable, TestimonialsSection, PageHero } from "../components/Shared";

function CommunityVisual() {
  return (
    <div className="community-visual">
      {leaderboard.slice(0, 3).map((learner, index) => (
        <div className={`podium podium-${index + 1}`} key={learner.name}>
          <img src={learner.image} alt="" />
          <span>{learner.rank}</span>
        </div>
      ))}
    </div>
  );
}

function DiscussionList() {
  return (
    <StaggerContainer className="discussion-list" staggerDelay={0.08}>
      {communityPosts.map((post) => (
        <StaggerItem key={post.title}>
          <article className="discussion-card">
            <span>{post.tag}</span>
            <h3>{post.title}</h3>
            <p>Started by {post.author}</p>
            <small>{post.replies} replies</small>
          </article>
        </StaggerItem>
      ))}
      <StaggerItem>
        <article className="ask-card">
          <h3>Ask the community</h3>
          <p>Post a question, compare strategies, or start a study sprint.</p>
          <button className="pill-button small" type="button">
            <Send size={15} />
            New Thread
          </button>
        </article>
      </StaggerItem>
    </StaggerContainer>
  );
}

export function CommunityPage() {
  return (
    <section className="page-section top-page">
      <div className="content-shell">
        <PageHero
          kicker="Community"
          title="Learn With People Who Keep Going"
          copy="See weekly leaders, join study threads, compare streaks, and celebrate the tiny wins that make a habit last."
          visual={<CommunityVisual />}
        />
        <div className="community-grid">
          <div>
            <Reveal>
              <SectionHeading kicker="Leaderboard" title="Top Learners This Week" />
            </Reveal>
            <LeaderboardTable />
          </div>
          <div>
            <Reveal>
              <SectionHeading kicker="Forum" title="Active Discussions" />
            </Reveal>
            <DiscussionList />
          </div>
        </div>
        <TestimonialsSection />
      </div>
    </section>
  );
}
