import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import React from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "DeepSeek",
  description: "Open-source AI assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <ClerkProvider>
          <AppContextProvider>
            <Toaster toastOptions={
              {
                success:{style:{background:"black",color:"white"}},
                error:{style:{background:"red",color:"white"}},
              }
            } />
            {children}
          </AppContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
