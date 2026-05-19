export default function PrivacyPage() {
  return (
    <main className="legal shell">
      <article>
        <a className="logo" href="/"><span className="logoIcon">✓</span><span><strong>OfferMatch</strong><em>AI</em></span></a>
        <h1>Privacy Policy</h1>
        <p>OfferMatch AI is an educational affiliate offer selection tool. This MVP does not store quiz answers in a database.</p>
        <p>If you submit your email through the demo form, connect it only to an email platform or webhook you control. Do not collect sensitive personal information through this tool.</p>
        <p>Future versions may collect quiz responses, email addresses, and result categories to deliver personalized reports and improve recommendations.</p>
        <p><a href="/">Back to home</a></p>
      </article>
    </main>
  );
}
