// ── Catálogo fixo de categorias e tipos (acabamentos) ──────────────────
export const CATEGORIAS = ["Granitos", "Mármores", "Quartzitos", "Sintéticos", "Dolomíticos"];
export const TIPOS = ["Escovado", "Acetinado", "Polido"]; // + opção em branco

// Código sempre com 3 dígitos mínimos: 1 -> "001". Códigos não numéricos (legado) ficam como estão.
export const fmtCodigo = (c) => {
    if (c === undefined || c === null || c === "") return "—";
    const s = String(c).trim();
    return /^\d+$/.test(s) ? s.padStart(3, "0") : s;
};
// Chave única do material (código; cai para o nome em registros antigos sem código)
export const matKey = (m) => String(m.cod ?? m.codigo ?? m.nome);
export const matCod = (m) => m.cod ?? m.codigo;
// "Granitos · Polido"
export const descMaterial = (m) => [m.categoria, m.tipo].filter(Boolean).join(" · ");
// Movimentação: "tipo" é Entrada/Saída/Transferência; o acabamento vem em "tipo_material"
export const descMov = (m) => [m.categoria, m.tipo_material].filter(Boolean).join(" · ");
// Lista de categorias para filtros: as 5 oficiais + qualquer categoria antiga ainda presente nos dados
export const categoriasComLegado = (materiais = []) => {
    const extras = [...new Set(materiais.map((m) => m.categoria).filter(Boolean))].filter((c) => !CATEGORIAS.includes(c));
    return [...CATEGORIAS, ...extras];
};
