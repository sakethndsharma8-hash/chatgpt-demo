import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DemoFlow — Automation Demo Simulator",
  description: "Internal sales demo simulator for AI lead qualification workflows."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
