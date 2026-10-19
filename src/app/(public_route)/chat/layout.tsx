/**
 * O globals.css reduz a fonte raiz para 0.8rem (pensado para o painel interno).
 * No chat do cliente, usado no celular, volta ao tamanho padrão do navegador:
 * textos legíveis e inputs com 16px, o que evita o zoom automático do iPhone.
 */
export default function ChatClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`html, body { font-size: 100%; }`}</style>
      {children}
    </>
  );
}
