'use client';

import { useMemo, useState } from 'react';

const questions = [
  {
    key: 'niche',
    label: 'What niche are you interested in?',
    options: [
      'Make money online / business',
      'Health & fitness',
      'Personal finance / credit',
      'AI tools / software',
      'Home improvement',
      'Beauty / lifestyle',
      'Not sure yet'
    ]
  },
  {
    key: 'experience',
    label: 'What is your experience level?',
    options: ['Complete beginner', 'I’ve joined a few programs', 'I’ve made a few commissions', 'I’m experienced but need better offers']
  },
  {
    key: 'traffic',
    label: 'What traffic source do you want to use?',
    options: ['TikTok / Reels / Shorts', 'YouTube', 'Blog / SEO', 'Email list', 'Paid ads', 'Social posts', 'Not sure yet']
  },
  {
    key: 'content',
    label: 'What type of content feels easiest for you?',
    options: ['Short videos', 'Tutorials', 'Reviews/comparisons', 'Email/newsletter', 'Blog posts', 'Simple social posts']
  },
  {
    key: 'budget',
    label: 'What is your starting budget?',
    options: ['$0', 'Under $50', '$50–$200', '$200+']
  },
  {
    key: 'goal',
    label: 'What income goal matters most right now?',
    options: ['First commission', '$100/month', '$1,000/month', 'Recurring income', 'High-ticket commissions']
  },
  {
    key: 'priority',
    label: 'What do you want most?',
    options: ['Easy beginner offer', 'Recurring commissions', 'High commission payout', 'Fast content ideas', 'Low competition niche', 'Simple funnel path']
  }
];

const resultProfiles = {
  digital: {
    title: 'Beginner Digital Products',
    badge: 'Low-friction first offer',
    summary: 'A low-ticket digital product is your safest starting point because it is easy to explain, easy to promote with content, and usually does not require a big audience.',
    strategy: 'Create simple problem-to-solution posts, short tutorials, and beginner checklist content. Focus on one pain point and one clear outcome.',
    avoid: 'Avoid jumping into expensive software stacks, paid ads, or high-ticket funnels before you know what your audience responds to.',
    steps: ['Pick one beginner problem your niche urgently wants solved.', 'Find 3 low-ticket programs or digital products that solve that problem.', 'Create 5 pieces of content that explain the problem, mistake, and better path.'],
    label: 'Low-Ticket Launch Sprinter'
  },
  saas: {
    title: 'Recurring SaaS / AI Tools',
    badge: 'Best recurring commission path',
    summary: 'Software and AI tools fit you because your answers point toward tutorials, reviews, comparisons, or recurring-income goals.',
    strategy: 'Start with tool walkthroughs, “best tool for X” posts, comparison content, and workflow demos that show the problem being solved.',
    avoid: 'Do not promote a tool just because it pays recurring commissions. Make sure you can clearly show the use case and audience fit.',
    steps: ['Choose one workflow your audience repeats often.', 'Research 3 tools with affiliate programs and beginner-friendly onboarding.', 'Publish a tutorial or comparison showing which tool fits which use case.'],
    label: 'SaaS Affiliate Starter'
  },
  highTicket: {
    title: 'High-Ticket Coaching / Programs',
    badge: 'Trust-building promotion path',
    summary: 'High-ticket offers may fit if you are comfortable creating trust-heavy content, educating buyers, and using email or long-form platforms.',
    strategy: 'Use story-driven content, case-study style posts, YouTube explainers, webinars, email follow-up, and objection-handling content.',
    avoid: 'Avoid pitching high-ticket offers cold with short posts only. These need trust, proof, education, and follow-up.',
    steps: ['Define the expensive problem your audience wants fixed.', 'Find programs with strong training, proof, and affiliate support.', 'Build a simple lead magnet and follow-up sequence before sending traffic.'],
    label: 'High-Ticket Builder'
  },
  physical: {
    title: 'Physical Products',
    badge: 'Review-friendly content path',
    summary: 'Physical products fit lifestyle, fitness, beauty, home, and review-style content where buyers like seeing examples and comparisons.',
    strategy: 'Use reviews, comparisons, before-and-after content, “top 5” lists, and practical buyer guides.',
    avoid: 'Avoid relying on low-commission products only. Bundle content around categories, comparisons, and buyer intent.',
    steps: ['Pick one product category with clear buyer intent.', 'Create comparison content for beginner, budget, and premium options.', 'Add affiliate links to helpful guides instead of random product mentions.'],
    label: 'Review Funnel Marketer'
  },
  finance: {
    title: 'Finance / Credit Offers',
    badge: 'Higher payout education path',
    summary: 'Finance and credit offers can pay well, but they need careful educational positioning and trust. They fit best when your content can explain risks and decisions clearly.',
    strategy: 'Create educational posts, checklists, calculators, and “things to know before” content. Keep claims realistic and compliant.',
    avoid: 'Avoid hype, income guarantees, or giving personal financial advice. Keep content educational and transparent.',
    steps: ['Choose one finance problem you can explain clearly.', 'Research reputable programs with clear terms and compliance guidance.', 'Create educational content that helps users compare options responsibly.'],
    label: 'Trust-First Finance Promoter'
  },
  contentLowTicket: {
    title: 'Content-Friendly Low-Ticket Offers',
    badge: 'Fast content idea path',
    summary: 'You should start with offers that are simple to explain and easy to turn into short-form posts, social content, or quick tutorials.',
    strategy: 'Use short videos, simple social posts, and quick “mistake → fix” content. Prioritize speed, clarity, and consistent publishing.',
    avoid: 'Avoid complex offers that require long explanations, custom demos, or high buyer trust before you have content momentum.',
    steps: ['Pick a simple offer with one obvious promise.', 'Write 10 hooks around mistakes, myths, and beginner wins.', 'Post daily for one week and track which angle gets clicks.'],
    label: 'Content-First Promoter'
  }
};

function scoreAnswers(answers) {
  const scores = {
    digital: 0,
    saas: 0,
    highTicket: 0,
    physical: 0,
    finance: 0,
    contentLowTicket: 0
  };

  const add = (key, points) => {
    scores[key] += points;
  };

  if (answers.niche?.includes('AI tools')) add('saas', 5);
  if (answers.niche?.includes('Personal finance')) add('finance', 5);
  if (answers.niche?.includes('Health') || answers.niche?.includes('Home') || answers.niche?.includes('Beauty')) add('physical', 4);
  if (answers.niche?.includes('Make money')) {
    add('digital', 3);
    add('highTicket', 2);
    add('saas', 2);
  }
  if (answers.niche?.includes('Not sure')) {
    add('digital', 3);
    add('contentLowTicket', 3);
  }

  if (answers.experience === 'Complete beginner') {
    add('digital', 4);
    add('contentLowTicket', 4);
  }
  if (answers.experience === 'I’ve made a few commissions' || answers.experience === 'I’m experienced but need better offers') {
    add('saas', 2);
    add('highTicket', 3);
  }

  if (answers.traffic?.includes('TikTok') || answers.traffic === 'Social posts') add('contentLowTicket', 5);
  if (answers.traffic === 'YouTube' || answers.traffic === 'Blog / SEO') {
    add('saas', 4);
    add('physical', 2);
  }
  if (answers.traffic === 'Email list') add('highTicket', 4);
  if (answers.traffic === 'Paid ads') {
    add('highTicket', 2);
    add('finance', 2);
  }

  if (answers.content === 'Tutorials' || answers.content === 'Reviews/comparisons') add('saas', 4);
  if (answers.content === 'Short videos' || answers.content === 'Simple social posts') add('contentLowTicket', 4);
  if (answers.content === 'Email/newsletter') add('highTicket', 3);
  if (answers.content === 'Blog posts') {
    add('saas', 2);
    add('physical', 2);
    add('finance', 2);
  }

  if (answers.budget === '$0' || answers.budget === 'Under $50') {
    add('digital', 4);
    add('contentLowTicket', 4);
  }
  if (answers.budget === '$200+') {
    add('highTicket', 3);
    add('finance', 2);
  }

  if (answers.goal === 'First commission' || answers.goal === '$100/month') add('digital', 4);
  if (answers.goal === 'Recurring income') add('saas', 6);
  if (answers.goal === 'High-ticket commissions') add('highTicket', 6);
  if (answers.goal === '$1,000/month') {
    add('saas', 3);
    add('highTicket', 2);
  }

  if (answers.priority === 'Easy beginner offer') add('digital', 5);
  if (answers.priority === 'Recurring commissions') add('saas', 5);
  if (answers.priority === 'High commission payout') add('highTicket', 4);
  if (answers.priority === 'Fast content ideas') add('contentLowTicket', 5);
  if (answers.priority === 'Low competition niche') add('finance', 2);
  if (answers.priority === 'Simple funnel path') add('digital', 2);

  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'digital';
  return { winner, scores };
}

export default function Home() {
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [captureStatus, setCaptureStatus] = useState('idle');
  const [captureMessage, setCaptureMessage] = useState('');
  const completed = questions.filter((q) => answers[q.key]).length;
  const progress = Math.round((completed / questions.length) * 100);
  const ready = completed === questions.length;
  const result = useMemo(() => (ready ? scoreAnswers(answers) : null), [answers, ready]);
  const profile = result ? resultProfiles[result.winner] : null;

  function setAnswer(key, value) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function resetQuiz() {
    setAnswers({});
    setEmail('');
    setSubmitted(false);
    setCaptureStatus('idle');
    setCaptureMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submitLead(event) {
    event.preventDefault();
    if (!profile) return;

    setCaptureStatus('loading');
    setCaptureMessage('');

    try {
      const response = await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          answers,
          result: {
            title: profile.title,
            label: profile.label,
            badge: profile.badge
          },
          page: typeof window !== 'undefined' ? window.location.href : ''
        })
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setSubmitted(true);
      setCaptureStatus(data.captured ? 'captured' : 'ready');
      setCaptureMessage(
        data.captured
          ? 'Success — your full plan request was captured.'
          : 'Success — the form is live. Add a webhook or VBOUT list in Vercel to forward leads automatically.'
      );
    } catch (error) {
      setCaptureStatus('error');
      setCaptureMessage(error.message || 'Lead capture failed. Please try again.');
    }
  }

  return (
    <main>
      <nav className="nav shell">
        <a className="logo" href="#top" aria-label="OfferMatch AI home">
          <span className="logoIcon">✓</span>
          <span><strong>OfferMatch</strong><em>AI</em></span>
        </a>
        <a className="navCta" href="#quiz">Find My Match</a>
      </nav>

      <section id="top" className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">Affiliate offer clarity tool</p>
          <h1>Find Your Best Affiliate Offer in Under 2 Minutes</h1>
          <p className="subhead">Answer a few quick questions and get matched with the affiliate offer type that fits your niche, traffic source, budget, and experience level.</p>
          <div className="heroActions">
            <a className="button primary" href="#quiz">Find My Offer Match</a>
            <a className="button ghost" href="#how">See How It Works</a>
          </div>
          <p className="trustLine">No guesswork. No endless program browsing. Just a clear offer direction and your next 3 promotion steps.</p>
        </div>
        <div className="heroCard" aria-label="Sample OfferMatch result card">
          <div className="miniBadge">Sample Result</div>
          <h2>SaaS Affiliate Starter</h2>
          <p>Your best fit may be recurring software or AI tools if you like tutorials, reviews, and recurring commissions.</p>
          <ul>
            <li>Best traffic: YouTube, SEO, short tutorials</li>
            <li>Start with: comparisons and workflow demos</li>
            <li>Avoid: promoting tools you cannot explain clearly</li>
          </ul>
        </div>
      </section>

      <section id="quiz" className="quizSection shell">
        <div className="sectionHeader">
          <p className="eyebrow">Free quiz</p>
          <h2>Get your offer-fit result</h2>
          <p>Choose the answers that best describe where you are right now. Your result updates when the quiz is complete.</p>
        </div>

        <div className="quizGrid">
          <div className="quizPanel">
            <div className="progressWrap">
              <span>{completed} of {questions.length} answered</span>
              <span>{progress}%</span>
              <div className="progress"><span style={{ width: `${progress}%` }} /></div>
            </div>

            {questions.map((question, index) => (
              <fieldset className="question" key={question.key}>
                <legend><span>{index + 1}</span>{question.label}</legend>
                <div className="options">
                  {question.options.map((option) => (
                    <button
                      type="button"
                      className={answers[question.key] === option ? 'option active' : 'option'}
                      key={option}
                      onClick={() => setAnswer(question.key, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <aside className="resultPanel">
            {!profile ? (
              <div className="emptyResult">
                <span className="resultIcon">⌁</span>
                <h3>Your match will appear here</h3>
                <p>Finish the quiz to see your recommended affiliate offer type, traffic strategy, what to avoid, and first 3 steps.</p>
              </div>
            ) : (
              <div className="resultCard">
                <div className="miniBadge">Your Best Offer Match</div>
                <h3>{profile.title}</h3>
                <p className="resultLabel">You’re a <strong>{profile.label}</strong></p>
                <p>{profile.summary}</p>
                <div className="infoBlock">
                  <h4>Best Traffic Strategy</h4>
                  <p>{profile.strategy}</p>
                </div>
                <div className="infoBlock warning">
                  <h4>What To Avoid</h4>
                  <p>{profile.avoid}</p>
                </div>
                <div className="infoBlock">
                  <h4>First 3 Steps</h4>
                  <ol>
                    {profile.steps.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                </div>
                <div className="leadBox">
                  <h4>Want the full plan?</h4>
                  <p>Get your personalized affiliate promotion plan with content angles, an offer research checklist, and beginner action steps.</p>
                  <form onSubmit={submitLead}>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                    <button type="submit" disabled={captureStatus === 'loading'}>{captureStatus === 'loading' ? 'Sending…' : 'Send My Full Plan'}</button>
                  </form>
                  {captureMessage && <p className={captureStatus === 'error' ? 'error' : 'success'}>{captureMessage}</p>}
                </div>
                <button className="button reset" type="button" onClick={resetQuiz}>Retake Quiz</button>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="problem shell">
        <div>
          <p className="eyebrow">The problem</p>
          <h2>Most Beginners Pick Offers Backwards</h2>
        </div>
        <p>They start with whatever program sounds popular, then wonder why their content does not convert. OfferMatch AI helps you check niche fit, traffic fit, beginner difficulty, commission model, and content style before you waste weeks promoting the wrong thing.</p>
      </section>

      <section id="how" className="how shell">
        <div className="sectionHeader">
          <p className="eyebrow">How it works</p>
          <h2>From confusion to clear promotion path</h2>
        </div>
        <div className="steps">
          <div><span>1</span><h3>Answer the quiz</h3><p>Tell us your niche, traffic source, content style, budget, and goal.</p></div>
          <div><span>2</span><h3>Get your offer match</h3><p>See your recommended offer type and why it fits your answers.</p></div>
          <div><span>3</span><h3>Start promoting smarter</h3><p>Use your traffic strategy and first 3 steps to start researching better-fit programs.</p></div>
        </div>
      </section>

      <section className="features shell">
        {[
          ['Quick Offer-Fit Quiz', 'Know what type of offer makes sense before you start promoting.'],
          ['Personalized Match Result', 'Stop guessing and focus on a realistic promotion path.'],
          ['Traffic Strategy Guidance', 'Avoid pushing the right offer on the wrong platform.'],
          ['Beginner Action Steps', 'Move from research mode into action.']
        ].map(([title, text]) => (
          <article key={title}><h3>{title}</h3><p>{text}</p></article>
        ))}
      </section>

      <section className="cta shell">
        <p className="eyebrow">Free tool + starter kit funnel</p>
        <h2>Stop Guessing What to Promote</h2>
        <p>Take the 2-minute quiz and get a clearer affiliate offer direction today.</p>
        <a className="button primary" href="#quiz">Find My Offer Match</a>
      </section>

      <section className="faq shell">
        <div className="sectionHeader"><p className="eyebrow">FAQ</p><h2>Quick answers</h2></div>
        <details><summary>Is this for complete beginners?</summary><p>Yes. OfferMatch AI is designed for people still figuring out what affiliate offers to promote.</p></details>
        <details><summary>Does this recommend specific affiliate programs?</summary><p>The MVP recommends offer categories and promotion paths. Specific program recommendations can be added later.</p></details>
        <details><summary>Is this financial advice?</summary><p>No. It is an educational tool to help users think through affiliate offer selection.</p></details>
        <details><summary>Is the result guaranteed to make money?</summary><p>No. Results depend on your audience, content, consistency, and execution.</p></details>
      </section>

      <footer className="footer shell">
        <span>© {new Date().getFullYear()} OfferMatch AI</span>
        <span><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></span>
      </footer>
    </main>
  );
}
