export const CATEGORIAS = ["Granitos", "Mármores", "Quartzitos", "Sintéticos", "Dolomíticos"];
export const TIPOS = ["Escovado", "Acetinado", "Polido"];

export const fmtCodigo = (c) => {
    if (c === undefined || c === null || c === "") return "—";
    const s = String(c).trim();
    return /^\d+$/.test(s) ? s.padStart(3, "0") : s;
};

export const matKey = (m) => String(m.cod ?? m.codigo ?? m.nome);
export const matCod = (m) => m.cod ?? m.codigo;

export const descMaterial = (m) => [m.categoria, m.tipo].filter(Boolean).join(" · ");

export const descMov = (m) => [m.categoria, m.tipo_material].filter(Boolean).join(" · ");

export const categoriasComLegado = (materiais = []) => {
    const extras = [...new Set(materiais.map((m) => m.categoria).filter(Boolean))].filter((c) => !CATEGORIAS.includes(c));
    return [...CATEGORIAS, ...extras];
};
