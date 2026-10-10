// Fundo decorativo: gradiente laranja com manchas de luz em movimento lento.
// Só CSS (transform), sem JS. O véu escuro em globals.css (.aurora::after)
// mantém texto branco >= 4,5:1 em qualquer ponto da animação.
export default function AnimatedGradient({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`aurora ${className}`}>
      <span className="aurora__blob aurora__blob--a" />
      <span className="aurora__blob aurora__blob--b" />
      <span className="aurora__blob aurora__blob--c" />
    </div>
  );
}
