import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chetavani (चेतावनी) — Community Anti-Scam Registry for India on Arkiv',
  description: 'Self-expiring, tamper-evident scam registry for India on Arkiv DB-Chain (Tiramisu testnet). Protecting citizens against Digital Arrests, fake loan apps, and UPI phishing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cyber-bg min-h-screen text-white antialiased">
        {children}
      </body>
    </html>
  );
}
