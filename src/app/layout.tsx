import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BYTEON 2026 | National Level Coding Contest | Zypherix '26",
  description: "Official landing page for Byteon Coding Event at Zypherix National Level IT Fest, Jamia Hamdard Kannur Campus. 27 Jan 2026. Cash Prize Pool ₹9,000/-.",
  keywords: ["Byteon", "Zypherix", "Coding Competition", "Hackathon", "Jamia Hamdard", "Kannur", "IT Fest", "Programming", "Kannur Campus"],
  openGraph: {
    title: "BYTEON 2026 // National Level Coding Competition",
    description: "Join Byteon on 27 Jan at Zypherix IT Fest. ₹6000 First Prize, ₹3000 Second Prize. Organized at Jamia Hamdard Kannur Campus.",
    type: "website",
    images: [{ url: "/poster.jpg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#050811] text-emerald-50 antialiased selection:bg-[#00f5a0] selection:text-black">
        {children}
      </body>
    </html>
  );
}
