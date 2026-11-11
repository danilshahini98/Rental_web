import type { Metadata } from "next";
import "./globals.css";
import { CarIconDefs } from "@/components/car-icon-defs";

export const metadata: Metadata = {
  title: "RentAlbania",
  description:
    "Browse independent car rental businesses across Albania, compare cars and prices, and send a free booking request.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <CarIconDefs />
        {children}
      </body>
    </html>
  );
}
