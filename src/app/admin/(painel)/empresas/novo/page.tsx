import EmpresaForm from "@/components/admin/EmpresaForm";

export const metadata = {
  title: "Nova empresa | Painel Admin",
};

export default function NovaEmpresaPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-night-900">
        Nova empresa
      </h1>
      <div className="mt-6">
        <EmpresaForm />
      </div>
    </div>
  );
}
