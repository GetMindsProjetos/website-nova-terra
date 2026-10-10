"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DefinirSenhaPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // O link de convite/recuperação do Supabase entrega um token no
    // hash da URL. O client-side já processa isso automaticamente
    // (detectSessionInUrl) e estabelece a sessão — só precisamos
    // aguardar esse processo antes de liberar o formulário.
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setReady(true);
      } else {
        setError(
          "Link inválido ou expirado. Peça um novo convite ao administrador."
        );
      }
    });
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setLoading(false);

    if (updateError) {
      setError("Não foi possível definir a senha. Tente novamente.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/admin");
      router.refresh();
    }, 1500);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-terra-50/60 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-terra-100 bg-white p-8 shadow-sm">
        <p className="text-center font-serif text-xl font-medium text-night-900">
          Definir senha
        </p>
        <p className="mt-1 text-center text-sm text-night-800/70">
          Escolha a senha que você vai usar para acessar o painel.
        </p>

        {success ? (
          <p className="mt-6 rounded-lg bg-terra-50 px-4 py-3 text-center text-sm text-terra-700">
            Senha definida! Redirecionando...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-night-900"
              >
                Nova senha
              </label>
              <input
                id="password"
                type="password"
                required
                disabled={!ready}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500 disabled:bg-terra-50/60"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-night-900"
              >
                Confirmar senha
              </label>
              <input
                id="confirm"
                type="password"
                required
                disabled={!ready}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500 disabled:bg-terra-50/60"
                placeholder="Repita a senha"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!ready || loading}
              className="w-full rounded-full bg-terra-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-terra-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Salvar senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
