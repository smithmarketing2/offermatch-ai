import './globals.css';

export const metadata = {
  title: 'OfferMatch AI — Find Your Best Affiliate Offer',
  description: 'Take a 2-minute quiz and get matched with the affiliate offer type that fits your niche, traffic source, budget, and experience level.',
  openGraph: {
    title: 'OfferMatch AI',
    description: 'Find your best affiliate offer in under 2 minutes.',
    type: 'website'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
