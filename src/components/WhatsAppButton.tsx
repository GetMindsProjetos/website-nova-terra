import { whatsappLink } from "@/lib/site";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Olá! Vim pelo site da Nova Terra e gostaria de falar com vocês.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp (abre em nova aba)"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 flex min-h-[44px] items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-night-900 shadow-lg shadow-black/20 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-900 active:scale-95"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-night-900" aria-hidden="true" focusable="false">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.82L2 22l5.4-1.42a9.9 9.9 0 0 0 4.64 1.18h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2m0 1.8a8.1 8.1 0 0 1 8.1 8.1c0 4.47-3.63 8.1-8.1 8.1a8.03 8.03 0 0 1-4.1-1.12l-.29-.17-3.2.84.86-3.12-.19-.32a8.03 8.03 0 0 1-1.24-4.31 8.1 8.1 0 0 1 8.16-8m-4.5 4.15c-.19 0-.5.07-.76.36s-1 .97-1 2.37 1.02 2.75 1.16 2.94c.14.19 1.98 3.02 4.8 4.24.67.29 1.2.46 1.6.59.68.22 1.29.19 1.78.11.54-.08 1.66-.68 1.9-1.34s.24-1.22.17-1.34c-.07-.12-.26-.19-.55-.34s-1.66-.82-1.92-.91c-.26-.1-.44-.14-.63.14s-.73.9-.9 1.09c-.16.19-.33.21-.61.07-.29-.14-1.2-.44-2.29-1.41-.85-.75-1.42-1.68-1.59-1.96-.16-.29-.02-.44.13-.58.13-.13.29-.34.43-.5s.19-.29.29-.48c.1-.19.05-.36-.02-.5-.07-.14-.63-1.55-.88-2.12-.23-.55-.47-.48-.65-.49z" />
      </svg>
      Fale conosco
    </a>
  );
}
