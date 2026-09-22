import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Markivo — AI Marketing Platform',
  description: 'AI-powered marketing platform for e-commerce businesses',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
