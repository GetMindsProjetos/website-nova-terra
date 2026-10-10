import CTAButton from "@/components/CTAButton";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-14 text-center sm:px-6 sm:py-24">
      <p className="font-serif text-6xl font-medium text-terra-600" aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 font-serif text-2xl font-medium text-night-900 sm:text-3xl">
        Não encontramos esta página
      </h1>
      <p className="mt-3 leading-relaxed text-night-800/75">
        O endereço pode ter mudado ou não existir mais. Mas você é muito bem-vindo
        aqui — escolha um caminho abaixo para continuar.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <CTAButton href="/">Início</CTAButton>
        <CTAButton href="/eventos" variant="secondary">
          Eventos
        </CTAButton>
        <CTAButton href="/redes" variant="secondary">
          Redes
        </CTAButton>
        <CTAButton href="/como-doar" variant="secondary">
          Como Doar
        </CTAButton>
        <CTAButton href="/fale-conosco" variant="secondary">
          Fale Conosco
        </CTAButton>
      </div>
    </section>
  );
}
