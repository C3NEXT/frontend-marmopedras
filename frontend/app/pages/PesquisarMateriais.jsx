import { useState, useEffect } from "react";
import { api } from "../api";
import { IconSearch, IconFilter, IconTag, IconAlert, IconBox } from "../components/Icons";
import { TIPOS, fmtCodigo, matKey, categoriasComLegado } from "../constants";
const statusConfig = {
    ok: { label: "Normal", bg: "#d1fae5", color: "#065f46" },
    baixo: { label: "Baixo", bg: "#fef3c7", color: "#92400e" },
    crítico: { label: "Crítico", bg: "#fee2e2", color: "#991b1b" },
};
export default function PesquisarMateriais() {
    const [materiais, setMateriais] = useState([]);
    useEffect(() => {
        api("listarMateriais").then(setMateriais).catch(() => { });
    }, []);
    const categorias = ["Todos", ...categoriasComLegado(materiais)];
    const [query, setQuery] = useState("");
    const [categoria, setCategoria] = useState("Todos");
    const [tipoFiltro, setTipoFiltro] = useState("Todos");
    const [statusFiltro, setStatusFiltro] = useState("Todos");
    const filtered = materiais.filter((m) => {
        const q = query.toLowerCase().trim();
        const matchQ = m.nome.toLowerCase().includes(q) || String(m.cod ?? "").toLowerCase().includes(q) || fmtCodigo(m.cod).toLowerCase().includes(q);
        const matchTipo = tipoFiltro === "Todos" || (tipoFiltro === "Em branco" ? !m.tipo : m.tipo === tipoFiltro);
        const matchCat = categoria === "Todos" || m.categoria === categoria;
        const matchSt = statusFiltro === "Todos" || m.status === statusFiltro.toLowerCase();
        return matchQ && matchCat && matchTipo && matchSt;
    });
    return (<div className="page-scroll flex-1 overflow-y-auto px-8 py-7 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#1c0a0d" }}>
            Pesquisar Materiais
          </h1>
          <p className="text-sm" style={{ color: "#7a5c60" }}>
            {materiais.length} materiais cadastrados · {materiais.filter(m => m.status !== "ok").length} com atenção
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "#9b7e82" }}>
          <IconBox size={14}/>
          <span>{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9b7e82" }}>
            <IconSearch size={16}/>
          </span>
          <input type="text" placeholder="Buscar por nome ou código (ex.: 001)…" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={{
            background: "rgba(255,252,248,0.7)",
            border: "1px solid rgba(92,26,34,0.12)",
            color: "#1c0a0d",
        }}/>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-xs mr-1 flex items-center gap-1" style={{ color: "#9b7e82" }}>
            <IconFilter size={13}/> Categoria:
          </span>
          {categorias.map((c) => (<button key={c} onClick={() => setCategoria(c)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={categoria === c
                ? { background: "#5c1a22", color: "#fff" }
                : { background: "rgba(255,252,248,0.7)", color: "#7a5c60", border: "1px solid rgba(92,26,34,0.1)" }}>
              {c}
            </button>))}
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-xs mr-1" style={{ color: "#9b7e82" }}>Tipo:</span>
          {["Todos", ...TIPOS, "Em branco"].map((t) => (<button key={t} onClick={() => setTipoFiltro(t)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={tipoFiltro === t
                ? { background: "#5c1a22", color: "#fff" }
                : { background: "rgba(255,252,248,0.7)", color: "#7a5c60", border: "1px solid rgba(92,26,34,0.1)" }}>
              {t}
            </button>))}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs mr-1" style={{ color: "#9b7e82" }}>Status:</span>
          {["Todos", "Ok", "Baixo", "Crítico"].map((s) => (<button key={s} onClick={() => setStatusFiltro(s)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={statusFiltro === s
                ? { background: "#5c1a22", color: "#fff" }
                : { background: "rgba(255,252,248,0.7)", color: "#7a5c60", border: "1px solid rgba(92,26,34,0.1)" }}>
              {s}
            </button>))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,252,248,0.7)", border: "1px solid rgba(255,250,244,0.9)", boxShadow: "0 2px 20px rgba(92,26,34,0.06)" }}>
        <div className="table-scroll-wrap">
        <table className="w-full" style={{ minWidth: "700px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(201,151,110,0.12)" }}>
              {["Código", "Material", "Categoria", "Tipo", "Estoque", "Mínimo", "Localização", "Status"].map((h) => (<th key={h} className="text-left px-5 py-3.5 text-[10.5px] font-semibold tracking-widest uppercase" style={{ color: "#9b7e82" }}>
                  {h}
                </th>))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (<tr>
                <td colSpan={8} className="px-5 py-12 text-center text-sm" style={{ color: "#9b7e82" }}>
                  Nenhum material encontrado para os filtros selecionados.
                </td>
              </tr>) : (filtered.map((m, i) => {
            const st = statusConfig[m.status];
            return (<tr key={matKey(m)} className="transition-colors hover:bg-white/40" style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.6)" : "none" }}>
                    <td className="px-5 py-3.5 text-xs font-mono font-semibold" style={{ color: "#5c1a22" }}>
                      {fmtCodigo(m.cod)}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium" style={{ color: "#1c0a0d" }}>
                      {m.nome}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-xs" style={{ color: "#7a5c60" }}>
                        <IconTag size={12}/>
                        {m.categoria}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#7a5c60" }}>
                      {m.tipo || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-sm tabular-nums font-semibold" style={{ color: "#1c0a0d" }}>
                      {m.estoque} <span className="font-normal text-xs" style={{ color: "#9b7e82" }}>{m.unidade}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm tabular-nums" style={{ color: "#9b7e82" }}>
                      {m.minimo} {m.unidade}
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#7a5c60" }}>
                      {m.local}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                  </tr>);
        }))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
            { label: "Total de SKUs", value: materiais.length, icon: <IconBox size={16}/>, color: "#5c1a22" },
            { label: "Saldo Baixo", value: materiais.filter(m => m.status === "baixo").length, icon: <IconAlert size={16}/>, color: "#92400e" },
            { label: "Estoque Crítico", value: materiais.filter(m => m.status === "crítico").length, icon: <IconAlert size={16}/>, color: "#991b1b" },
        ].map((card) => (<div key={card.label} className="rounded-xl px-5 py-4 flex items-center gap-4" style={{ background: "rgba(255,252,248,0.7)", border: "1px solid rgba(255,250,244,0.9)", boxShadow: "0 1px 8px rgba(92,26,34,0.04)" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(201,151,110,0.1)", color: card.color }}>
              {card.icon}
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</div>
              <div className="text-xs" style={{ color: "#9b7e82" }}>{card.label}</div>
            </div>
          </div>))}
      </div>
    </div>);
}
