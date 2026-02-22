import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cognitory Deck",
  description: "Services factories powered by AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=UnifrakturMaguntia&family=Crimson+Text:wght@400;600;700&family=Cinzel:wght@400;500;600;700;800;900&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
