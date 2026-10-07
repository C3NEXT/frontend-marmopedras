import "./globals.css";

export const metadata = {
  title: "Marmopedras | Gestão de Estoque",
  description: "Sistema de gestão de estoque Marmopedras",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
