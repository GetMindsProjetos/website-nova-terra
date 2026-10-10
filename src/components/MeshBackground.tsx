// Fundo decorativo: manchas de laranja que se misturam com bordas suaves e
// se movem em trajetórias diferentes (efeito "mesh gradient"). Só CSS (transform): sem JS nem
// WebGL, e parado com prefers-reduced-motion. Estilos em globals.css (.mesh).
// Laranja suave com toques de amarelo; o tom mais saturado é terra-500 a 35%.
// Texto sobre este fundo deve ser night-900 (> 7:1 no pior ponto).
export default function MeshBackground({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`mesh ${className}`}>
      <span className="mesh__blob mesh__blob--a" />
      <span className="mesh__blob mesh__blob--b" />
      <span className="mesh__blob mesh__blob--c" />
      <span className="mesh__blob mesh__blob--d" />
      <span className="mesh__blob mesh__blob--e" />
      <span className="mesh__blob mesh__blob--f" />
    </div>
  );
}
