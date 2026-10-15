"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { configuracoesSchema, veiculoSchema } from "@/lib/veiculos/schema";
import type { StatusVeiculo } from "@/types/database";

export interface ResultadoSalvar {
  ok: boolean;
  erro?: string;
  id?: string;
}

function revalidarAdmin(id?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/veiculos");
  if (id) revalidatePath(`/admin/veiculos/${id}`);

  // o site público usa ISR: sem isso a mudança só apareceria no próximo ciclo
  revalidatePath("/");
  revalidatePath("/veiculos");
  revalidatePath("/veiculos/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

/** Cria ou atualiza um veículo. O slug é gerado pelo banco na criação. */
export async function salvarVeiculo(
  id: string | null,
  valores: unknown,
): Promise<ResultadoSalvar> {
  const parsed = veiculoSchema.safeParse(valores);
  if (!parsed.success) {
    return { ok: false, erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const dados = parsed.data;

  if (id) {
    const { error } = await supabase.from("veiculos").update(dados).eq("id", id);
    if (error) return { ok: false, erro: error.message };
    revalidarAdmin(id);
    return { ok: true, id };
  }

  const { data, error } = await supabase
    .from("veiculos")
    .insert(dados)
    .select("id")
    .single();

  if (error) return { ok: false, erro: error.message };
  revalidarAdmin();
  return { ok: true, id: data.id };
}

export async function excluirVeiculo(id: string): Promise<ResultadoSalvar> {
  const supabase = await createClient();

  // apaga os arquivos do Storage antes das linhas (o cascade leva as linhas de foto)
  const { data: fotos } = await supabase
    .from("veiculo_fotos")
    .select("url")
    .eq("veiculo_id", id);

  const caminhos = (fotos ?? [])
    .map((f) => caminhoDoStorage(f.url))
    .filter((c): c is string => c !== null);

  if (caminhos.length > 0) {
    await supabase.storage.from("veiculos").remove(caminhos);
  }

  const { error } = await supabase.from("veiculos").delete().eq("id", id);
  if (error) return { ok: false, erro: error.message };

  revalidarAdmin();
  return { ok: true };
}

export async function atualizarStatus(
  id: string,
  status: StatusVeiculo,
): Promise<ResultadoSalvar> {
  const supabase = await createClient();
  const { error } = await supabase.from("veiculos").update({ status }).eq("id", id);
  if (error) return { ok: false, erro: error.message };
  revalidarAdmin(id);
  return { ok: true, id };
}

export async function alternarDestaque(
  id: string,
  destaque: boolean,
): Promise<ResultadoSalvar> {
  const supabase = await createClient();
  const { error } = await supabase.from("veiculos").update({ destaque }).eq("id", id);
  if (error) return { ok: false, erro: error.message };
  revalidarAdmin(id);
  return { ok: true, id };
}

/* ------------------------------- fotos ---------------------------------- */

/** "https://x.supabase.co/storage/v1/object/public/veiculos/abc/1.jpg" -> "abc/1.jpg" */
function caminhoDoStorage(url: string): string | null {
  const marcador = "/object/public/veiculos/";
  const i = url.indexOf(marcador);
  return i === -1 ? null : url.slice(i + marcador.length);
}

export async function registrarFoto(
  veiculoId: string,
  url: string,
): Promise<ResultadoSalvar> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("veiculo_fotos")
    .select("id", { count: "exact", head: true })
    .eq("veiculo_id", veiculoId);

  const total = count ?? 0;
  const { error } = await supabase.from("veiculo_fotos").insert({
    veiculo_id: veiculoId,
    url,
    ordem: total,
    is_capa: total === 0,
  });

  if (error) return { ok: false, erro: error.message };
  revalidarAdmin(veiculoId);
  return { ok: true, id: veiculoId };
}

export async function removerFoto(
  fotoId: string,
  veiculoId: string,
): Promise<ResultadoSalvar> {
  const supabase = await createClient();

  const { data: foto } = await supabase
    .from("veiculo_fotos")
    .select("url, is_capa")
    .eq("id", fotoId)
    .maybeSingle();

  const { error } = await supabase.from("veiculo_fotos").delete().eq("id", fotoId);
  if (error) return { ok: false, erro: error.message };

  if (foto) {
    const caminho = caminhoDoStorage(foto.url);
    if (caminho) await supabase.storage.from("veiculos").remove([caminho]);

    // se a capa saiu, a primeira foto restante assume
    if (foto.is_capa) {
      const { data: restante } = await supabase
        .from("veiculo_fotos")
        .select("id")
        .eq("veiculo_id", veiculoId)
        .order("ordem", { ascending: true })
        .limit(1);

      if (restante?.[0]) {
        await supabase
          .from("veiculo_fotos")
          .update({ is_capa: true })
          .eq("id", restante[0].id);
      }
    }
  }

  revalidarAdmin(veiculoId);
  return { ok: true, id: veiculoId };
}

export async function definirCapa(
  fotoId: string,
  veiculoId: string,
): Promise<ResultadoSalvar> {
  const supabase = await createClient();

  // o índice único permite só uma capa por veículo: limpa antes de marcar
  const { error: erroLimpeza } = await supabase
    .from("veiculo_fotos")
    .update({ is_capa: false })
    .eq("veiculo_id", veiculoId)
    .eq("is_capa", true);
  if (erroLimpeza) return { ok: false, erro: erroLimpeza.message };

  const { error } = await supabase
    .from("veiculo_fotos")
    .update({ is_capa: true })
    .eq("id", fotoId);
  if (error) return { ok: false, erro: error.message };

  revalidarAdmin(veiculoId);
  return { ok: true, id: veiculoId };
}

/** Recebe os ids na ordem final e grava o campo `ordem`. */
export async function reordenarFotos(
  veiculoId: string,
  idsEmOrdem: string[],
): Promise<ResultadoSalvar> {
  const supabase = await createClient();

  for (const [indice, id] of idsEmOrdem.entries()) {
    const { error } = await supabase
      .from("veiculo_fotos")
      .update({ ordem: indice })
      .eq("id", id)
      .eq("veiculo_id", veiculoId);
    if (error) return { ok: false, erro: error.message };
  }

  revalidarAdmin(veiculoId);
  return { ok: true, id: veiculoId };
}

/* ---------------------------- configurações ------------------------------ */

export async function salvarConfiguracoes(valores: unknown): Promise<ResultadoSalvar> {
  const parsed = configuracoesSchema.safeParse(valores);
  if (!parsed.success) {
    return { ok: false, erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("configuracoes")
    .update(parsed.data)
    .eq("id", 1);

  if (error) return { ok: false, erro: error.message };

  revalidatePath("/admin/configuracoes");
  revalidatePath("/", "layout");
  return { ok: true };
}

/* ------------------------- métricas do site público ---------------------- */

/** Registra o clique no botão do WhatsApp (política de insert é pública). */
export async function registrarClique(veiculoId: string | null): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.from("cliques_whatsapp").insert({ veiculo_id: veiculoId });
  } catch {
    // métrica não pode quebrar o contato com o cliente
  }
}
