import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CallPilot AI | Outbound Campaigns",
  description: "Manage compliant AI-assisted outbound calling campaigns."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}