import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mutuelle ENSPY - Plateforme de Gestion",
  description:
    "Plateforme de gestion de la Mutuelle des Enseignants de l'ENSPY. Gérez vos épargnes, emprunts, cotisations et bien plus.",
  keywords: "mutuelle, ENSPY, épargne, emprunt, cotisation, gestion financière",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

