import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { Cabecalho } from "@/components/site/cabecalho";
import { Rodape } from "@/components/site/rodape";
import { WhatsappFlutuante } from "@/components/site/botao-whatsapp";
import { obterConfiguracoesPublicas } from "@/lib/veiculos/publico";
import { env } from "@/lib/env";
import "../globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Revenda de Veículos — carros seminovos",
    template: "%s | Revenda de Veículos",
  },
  description:
    "Carros seminovos revisados, com procedência. Veja o estoque e fale com a gente no WhatsApp.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Revenda de Veículos",
  },
};

/** Layout do site público — tema escuro por padrão. */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const configuracoes = await obterConfiguracoesPublicas().catch(() => null);
  const nomeLoja = configuracoes?.nome_loja ?? "Revenda";
  const whatsapp = configuracoes?.whatsapp ?? "";

  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} dark`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <Cabecalho nomeLoja={nomeLoja} whatsapp={whatsapp} />
        <div className="flex-1">{children}</div>
        <Rodape configuracoes={configuracoes} />
        <WhatsappFlutuante whatsapp={whatsapp} />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
