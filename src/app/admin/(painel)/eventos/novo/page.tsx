import EventoForm from "@/components/admin/EventoForm";

export const metadata = {
  title: "Novo evento | Painel Admin",
};

export default function NovoEventoPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-night-900">
        Novo evento
      </h1>
      <div className="mt-6">
        <EventoForm />
      </div>
    </div>
  );
}
