import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taeshigee API",
  description: "Task management API server",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
