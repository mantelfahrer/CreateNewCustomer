import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import StoreProvider from "./StoreProvider";

export const metadata: Metadata = {
  title: "Create New Customer",
  description:
    "Generate customer requirements for a fictional software project",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className="body">
          {children}
          <footer className="footer">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
          </footer>
        </body>
      </html>
    </StoreProvider>
  );
}
