import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { site } from '@/data/site';
import './globals.css';
import './signature.css';
import './campaign.css';
import './essence.css';
const metadataBase = new URL(site.seo.url || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000'));
export const metadata: Metadata = { metadataBase, title: site.seo.title, description: site.seo.description, ...(site.seo.url ? { alternates: { canonical: '/' } } : {}), openGraph: { title: site.seo.title, description: site.seo.description, locale: 'pt_BR', type: 'website' }, twitter: { card: 'summary_large_image', title: site.seo.title, description: site.seo.description } };
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>) {return <html lang="pt-BR"><body style={{'--paper':site.colors.paper,'--ink':site.colors.ink,'--taupe':site.colors.taupe,'--champagne':site.colors.champagne,'--dark':site.colors.dark} as CSSProperties}>{children}</body></html>}

import './paula.css';
import './hero-header.css';
