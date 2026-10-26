import { notFound } from "next/navigation";

export const metadata = {
  title: "Donate - Support African Language Preservation",
  description: "Support Sigana African Heritage Language School's mission to preserve African languages. Your donation helps fund curriculum development, teacher training, and student scholarships.",
  keywords: ["donate to language school", "support African languages", "language preservation donation", "heritage language support"],
  alternates: {
    canonical: "https://www.heritage-languageschool.com/donate",
  },
  openGraph: {
    title: "Support Our Mission | Sigana African Heritage Language School",
    description: "Help us preserve African languages for future generations. Every donation makes a difference.",
    url: "https://www.heritage-languageschool.com/donate",
  },
};

// Donations are temporarily hidden: every /donate route returns a 404.
// Remove the notFound() call (and restore the nav/footer/about/sitemap links) to re-enable.
export default function DonateLayout({ children }) {
  notFound();
  return children;
}
