import "./globals.css";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SpeedFix",
  description: "Premium Home Service Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "15px 40px",
            borderBottom: "1px solid #eee",
            backgroundColor: "#ffffff",
          }}
        >
          <Image
            src="/logo.png"
            alt="SpeedFix"
            width={120}
            height={40}
            priority
          />

          <nav style={{ display: "flex", gap: "25px", fontWeight: 500 }}>
            <span>Services</span>
            <span>About</span>
            <span>Contact</span>
          </nav>
        </header>

        {/* Main Content */}
        <main style={{ padding: "40px" }}>{children}</main>

      </body>
    </html>
  );
}