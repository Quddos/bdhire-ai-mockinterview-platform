import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Qudmeet.click",
  description: "Qudmeet is SaaS AI automation and Career Acing application, establish to help you build, earn, and enhance neccessary technologies required to land your dreama and aspiration. We provide varies of Tools and Features such as AI Demo interview, Job Opportunity, File Conversion and tools etc.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8184615979985575"
            crossOrigin="anonymous"
          />
        </head>
        <body className={inter.className}>
          <Toaster/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
