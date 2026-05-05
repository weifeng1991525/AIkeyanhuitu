import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'MedAI Pro - 医学科研AI平台',
    template: '%s | MedAI Pro',
  },
  description:
    '基于先进AI技术的医学科研辅助平台，提供假说图生成、技术路线图规划、科研绘图等智能科研工具。',
  keywords: [
    'MedAI Pro',
    '医学科研',
    'AI辅助',
    '假说生成',
    '技术路线图',
    '科研绘图',
    'Medical Research AI',
  ],
  authors: [{ name: 'MedAI Pro Team' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#0A1628',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'MedAI Pro',
    title: 'MedAI Pro - 医学科研AI平台',
    description:
      '基于先进AI技术的医学科研辅助平台，助力研究者高效完成科研任务。',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-navy-500 text-gray-200 font-body antialiased">
        {children}
      </body>
    </html>
  );
}
