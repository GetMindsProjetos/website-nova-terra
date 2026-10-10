import MeshBackground from "./MeshBackground";

// Fundo único e fixo do site (no layout raiz): fica parado atrás do conteúdo,
// que desliza por cima. Nas páginas internas um véu claro (.fixed-bg::after)
// mantém o texto corrido legível; a home o desliga com data-bg-strong. Usa a altura "large viewport" (lvh) para não redesenhar
// as manchas quando a barra do navegador do celular some ao rolar.
// Menu e rodapé em vidro e o véu ficam em globals.css (.site-header, footer, .fixed-bg).
export default function FixedBackground() {
  return (
    <div
      data-fixed-bg
      aria-hidden="true"
      className="fixed-bg pointer-events-none fixed inset-x-0 top-0 -z-10 h-[100vh] supports-[height:100lvh]:h-[100lvh]"
    >
      <MeshBackground />
    </div>
  );
}
