import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const childHood = localFont({
  src: "../../public/child-hood/Child Hood.otf",
  variable: "--font-childhood",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BYTEON 2027 | National Level Coding Contest | Zypherix '27",
  description: "Official landing page for Byteon Coding Event at Zypherix National Level IT Fest, Jamia Hamdard Kannur Campus. 27 Jan 2027. Cash Prize Pool ₹9,000/-.",
  keywords: ["Byteon", "Zypherix", "Coding Competition", "Hackathon", "Jamia Hamdard", "Kannur", "IT Fest", "Programming", "Kannur Campus"],
  openGraph: {
    title: "BYTEON 2027 // National Level Coding Competition",
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
    <html lang="en" className={`dark scroll-smooth ${childHood.variable}`}>
      <body className="min-h-screen bg-[#050811] text-emerald-50 antialiased selection:bg-[#fec195] selection:text-black">
        {children}
      </body>
    </html>
  );
}
