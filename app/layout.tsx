import "./globals.css";
import NextAuthSessionProvider from "@/components/SessionProvider";
import SplashScreen from "@/components/SplashScreen";
import ProgressBarProvider from "@/components/ProgressBarProvider";
export const metadata = {
  title: "NutriLogic",
  description: "Sistem Optimasi Diet & Latihan Fisik AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-[#050505] text-white antialiased">
        <NextAuthSessionProvider>
          <SplashScreen />
          <ProgressBarProvider />
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}