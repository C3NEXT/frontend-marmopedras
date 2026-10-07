import { useState, useEffect } from "react";
import { api } from "../api";
import { IconHistory, IconFilter, IconDown, IconUp, IconTransfer, IconCalendar } from "../components/Icons";
import { fmtCodigo, descMov } from "../constants";
const tipoIcon = { Entrada: <IconDown size={13}/>, Saída: <IconUp size={13}/>, Transferência: <IconTransfer size={13}/> };
const tipoStyle = {
    Entrada: { bg: "#d1fae5", color: "#065f46" },
    Saída: { bg: "#fee2e2", color: "#991b1b" },
    Transferência: { bg: "#f3f4f6", color: "#374151" },
};
const ITEMS_PER_PAGE = 8;
export default function HistoricoMovimentacoes() {
    const [tipoFiltro, setTipoFiltro] = useState("Todos");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [busca, setBusca] = useState("");
    const [page, setPage] = useState(1);
    const [itens, setItens] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [resumo, setResumo] = useState({});
    useEffect(() => {
        const t = setTimeout(() => {
            api("listarMovimentacoes", { tipo: tipoFiltro, inicio: dataInicio || undefined, fim: dataFim || undefined, busca, page, limit: ITEMS_PER_PAGE })
                .then((r) => {
                setItens(r.itens.map((i) => ({ ...i, id: i.objectId })));
                setTotal(r.total);
                setTotalPages(r.totalPages);
                setResumo(r.resumo || {});
            })
                .catch(() => { });
        }, 300);
        return () => clearTimeout(t);
    }, [tipoFiltro, dataInicio, dataFim, busca, page]);
    const filtered = { length: total };
    const paginated = itens;
    const cardStyle = {
        background: "rgba(255,252,248,0.7)",
        border: "1px solid rgba(255,250,244,0.9)",
        boxShadow: "0 2px 20px rgba(92,26,34,0.06)",
    };
    // Summary
    const entradas = resumo["Entrada"] || 0;
    const saidas = resumo["Saída"] || 0;
    const transferencias = resumo["Transferência"] || 0;
    return (<div className="page-scroll flex-1 overflow-y-auto px-8 py-7 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(92,26,34,0.08)", color: "#5c1a22" }}>
          <IconHistory size={18}/>
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1c0a0d" }}>Histórico de Movimentações</h1>
          <p className="text-sm" style={{ color: "#7a5c60" }}>Registro completo de entradas, saídas e transferências</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
            { label: "Entradas", value: entradas, icon: <IconDown size={15}/>, color: "#065f46", bg: "#d1fae5" },
            { label: "Saídas", value: saidas, icon: <IconUp size={15}/>, color: "#991b1b", bg: "#fee2e2" },
            { label: "Transferências", value: transferencias, icon: <IconTransfer size={15}/>, color: "#374151", bg: "#f3f4f6" },
        ].map((c) => (<div key={c.label} className="rounded-xl px-5 py-4 flex items-center gap-4" style={cardStyle}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: c.bg, color: c.color }}>
              {c.icon}
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</div>
              <div className="text-xs" style={{ color: "#9b7e82" }}>{c.label} registradas</div>
            </div>
          </div>))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-5 flex flex-wrap gap-4 items-end" style={cardStyle}>
        {/* Busca */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>Buscar</label>
          <input type="text" placeholder="Material, código ou responsável…" value={busca} onChange={(e) => { setBusca(e.target.value); setPage(1); }} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,252,248,0.8)", border: "1px solid rgba(92,26,34,0.12)", color: "#1c0a0d" }}/>
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
            <span className="flex items-center gap-1"><IconFilter size={11}/> Tipo</span>
          </label>
          <div className="flex gap-1">
            {["Todos", "Entrada", "Saída", "Transferência"].map((t) => (<button key={t} onClick={() => { setTipoFiltro(t); setPage(1); }} className="px-3 py-2 rounded-lg text-xs font-medium transition-all" style={tipoFiltro === t ? { background: "#5c1a22", color: "#fff" } : { background: "rgba(255,252,248,0.8)", color: "#7a5c60", border: "1px solid rgba(92,26,34,0.1)" }}>
                {t}
              </button>))}
          </div>
        </div>

        {/* Datas */}
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
              <span className="flex items-center gap-1"><IconCalendar size={11}/> De</span>
            </label>
            <input type="date" value={dataInicio} onChange={(e) => { setDataInicio(e.target.value); setPage(1); }} className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,252,248,0.8)", border: "1px solid rgba(92,26,34,0.12)", color: "#1c0a0d" }}/>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>Até</label>
            <input type="date" value={dataFim} onChange={(e) => { setDataFim(e.target.value); setPage(1); }} className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,252,248,0.8)", border: "1px solid rgba(92,26,34,0.12)", color: "#1c0a0d" }}/>
          </div>
          {(dataInicio || dataFim || busca || tipoFiltro !== "Todos") && (<button onClick={() => { setDataInicio(""); setDataFim(""); setBusca(""); setTipoFiltro("Todos"); setPage(1); }} className="px-3 py-2.5 rounded-xl text-xs font-medium" style={{ background: "rgba(92,26,34,0.06)", color: "#5c1a22" }}>
              Limpar
            </button>)}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl" style={cardStyle}>
        <div className="table-scroll-wrap">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(201,151,110,0.12)" }}>
              {["Data", "Hora", "Tipo", "Cód.", "Material", "Qtd.", "Local / Destino", "Responsável", "NF"].map((h) => (<th key={h} className="text-left px-5 py-3.5 text-[10.5px] font-semibold tracking-widest uppercase" style={{ color: "#9b7e82" }}>{h}</th>))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (<tr>
                <td colSpan={9} className="px-5 py-12 text-center text-sm" style={{ color: "#9b7e82" }}>
                  Nenhuma movimentação encontrada para os filtros selecionados.
                </td>
              </tr>) : paginated.map((m, i) => {
            const st = tipoStyle[m.tipo];
            return (<tr key={m.id} className="hover:bg-white/40 transition-colors" style={{ borderBottom: i < paginated.length - 1 ? "1px solid rgba(255,255,255,0.6)" : "none" }}>
                  <td className="px-5 py-3.5 text-xs tabular-nums" style={{ color: "#7a5c60" }}>{m.data}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold tabular-nums" style={{ color: "#5c1a22" }}>{m.hora}</td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit" style={{ background: st.bg, color: st.color }}>
                      {tipoIcon[m.tipo]}
                      {m.tipo}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono font-semibold" style={{ color: "#5c1a22" }}>{fmtCodigo(m.codigo ?? m.cod)}</td>
                  <td className="px-5 py-3.5">
                    <div className="text-sm font-medium" style={{ color: "#1c0a0d" }}>{m.material}</div>
                    {descMov(m) && <div className="text-[11px]" style={{ color: "#9b7e82" }}>{descMov(m)}</div>}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold tabular-nums" style={{ color: "#1c0a0d" }}>{m.qtd}</td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: "#7a5c60", maxWidth: "180px" }}>{m.local}</td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: "#7a5c60" }}>{m.responsavel}</td>
                  <td className="px-5 py-3.5 text-xs font-mono" style={{ color: "#9b7e82" }}>{m.nota}</td>
                </tr>);
        })}
          </tbody>
        </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (<div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid rgba(201,151,110,0.12)" }}>
            <span className="text-xs" style={{ color: "#9b7e82" }}>
              {filtered.length} registros · pág. {page}/{totalPages}
            </span>
            <div className="flex gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40" style={{ background: "rgba(255,252,248,0.8)", color: "#5c1a22", border: "1px solid rgba(92,26,34,0.12)" }}>
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (<button key={p} onClick={() => setPage(p)} className="w-8 h-8 rounded-lg text-xs font-medium" style={page === p ? { background: "#5c1a22", color: "#fff" } : { background: "rgba(255,252,248,0.8)", color: "#5c1a22", border: "1px solid rgba(92,26,34,0.12)" }}>
                  {p}
                </button>))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40" style={{ background: "rgba(255,252,248,0.8)", color: "#5c1a22", border: "1px solid rgba(92,26,34,0.12)" }}>
                →
              </button>
            </div>
          </div>)}
      </div>

      {/* Footer quote */}
      <div className="flex items-start gap-3 mt-auto">
        <div className="w-0.5 rounded-full flex-shrink-0" style={{ background: "#c9976e", height: "36px" }}/>
        <div>
          <p className="text-sm italic" style={{ color: "#5c1a22" }}>"Mais que pedras, soluções para grandes projetos."</p>
          <p className="text-xs font-semibold mt-0.5" style={{ color: "#9b7e82" }}>Marmopedras</p>
        </div>
      </div>
    </div>);
}
