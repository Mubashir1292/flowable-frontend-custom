import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ModelerLayout from "../components/ModelerLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flowable Modeler",
  description: "Modern BPMN Process Modeler",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ModelerLayout>{children}</ModelerLayout>
      </body>
    </html>
  );
}