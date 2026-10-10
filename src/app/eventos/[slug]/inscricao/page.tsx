import { permanentRedirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

// A inscrição agora fica na própria página do evento. Esta rota continua
// existindo só para não quebrar links antigos (anúncios, compartilhamentos).
export default async function InscricaoPage({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/eventos/${encodeURIComponent(slug)}#inscricao`);
}
