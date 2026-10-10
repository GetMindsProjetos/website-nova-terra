import NoticiaForm from "@/components/admin/NoticiaForm";

export const metadata = {
  title: "Nova notícia | Painel Admin",
};

export default function NovaNoticiaPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-night-900">
        Nova notícia
      </h1>
      <div className="mt-6">
        <NoticiaForm />
      </div>
    </div>
  );
}
