import { useState, useEffect } from "react";
import { api } from "../api";
import { IconBarChart, IconMapPin, IconAlert } from "../components/Icons";

const statusStyle = {
    ok: { bg: "#d1fae5", color: "#065f46", label: "Normal" },
    baixo: { bg: "#fef3c7", color: "#92400e", label: "Baixo" },
    crítico: { bg: "#fee2e2", color: "#991b1b", label: "Crítico" },
};

const categoriaColor = {
    Revestimento: "#5c1a22",
    Argamassa: "#92400e",
    Rejunte: "#7c3aed",
    Impermeabilizante: "#0369a1",
    Adesivo: "#065f46",
    "Pedra Natural": "#c9976e",
};

export default function DistribuicaoEstoque() {
    const [depositos, setDepositos] = useState([]);

    useEffect(() => {
        api("distribuicao").then(setDepositos).catch(() => {});
    }, []);

    const [selectedDep, setSelectedDep] = useState(null);
    const [viewMode, setViewMode] = useState("grid");
    const shown = selectedDep ? depositos.filter((d) => d.id === selectedDep) : depositos;
    const totalMateriais = depositos.flatMap((d) => d.materiais).length;
    const totalCriticos = depositos.flatMap((d) => d.materiais).filter((m) => m.status === "crítico").length;

    return (
        <div className="page-scroll flex-1 overflow-y-auto px-8 py-7 flex flex-col gap-6">
            <div className="distrib-toolbar flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(92,26,34,0.08)", color: "#5c1a22" }}
                    >
                        <IconBarChart size={18} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: "#1c0a0d" }}>
                            Distribuição no Estoque
                        </h1>
                        <p className="text-sm" style={{ color: "#7a5c60" }}>
                            {totalMateriais} itens · {depositos.length} depósitos · {totalCriticos} em situação crítica
                        </p>
                    </div>
                </div>

                <div className="distrib-filter-btns flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1 flex-wrap">
                        {[{ id: null, label: "Todos" }, ...depositos.map((d) => ({ id: d.id, label: d.nome }))].map((opt) => (
                            <button
                                key={String(opt.id)}
                                onClick={() => setSelectedDep(opt.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                style={
                                    selectedDep === opt.id
                                        ? { background: "#5c1a22", color: "#fff" }
                                        : {
                                              background: "rgba(255,252,248,0.7)",
                                              color: "#7a5c60",
                                              border: "1px solid rgba(92,26,34,0.1)",
                                          }
                                }
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div
                        className="flex rounded-lg overflow-hidden"
                        style={{ border: "1px solid rgba(92,26,34,0.12)" }}
                    >
                        {["grid", "list"].map((m) => (
                            <button
                                key={m}
                                onClick={() => setViewMode(m)}
                                className="px-3 py-1.5 text-xs font-medium"
                                style={
                                    viewMode === m
                                        ? { background: "#5c1a22", color: "#fff" }
                                        : { background: "rgba(255,252,248,0.7)", color: "#7a5c60" }
                                }
                            >
                                {m === "grid" ? "Cards" : "Lista"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="distrib-depot-grid grid grid-cols-4 gap-4">
                {depositos.map((dep) => {
                    const criticos = dep.materiais.filter((m) => m.status === "crítico").length;
                    const pct = Math.round((dep.materiais.length / dep.capacidade) * 100 * 10);

                    return (
                        <button
                            key={dep.id}
                            onClick={() => setSelectedDep(selectedDep === dep.id ? null : dep.id)}
                            className="rounded-2xl p-4 text-left transition-all"
                            style={{
                                background:
                                    selectedDep === dep.id
                                        ? "rgba(92,26,34,0.08)"
                                        : "rgba(255,252,248,0.7)",
                                border:
                                    selectedDep === dep.id
                                        ? "1px solid rgba(92,26,34,0.2)"
                                        : "1px solid rgba(255,250,244,0.9)",
                                boxShadow: "0 2px 12px rgba(92,26,34,0.05)",
                            }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    className="text-xs font-bold uppercase tracking-widest"
                                    style={{ color: "#5c1a22" }}
                                >
                                    {dep.nome}
                                </span>

                                {criticos > 0 && (
                                    <span
                                        className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                        style={{ background: "#fee2e2", color: "#991b1b" }}
                                    >
                                        <IconAlert size={10} /> {criticos}
                                    </span>
                                )}
                            </div>

                            <div className="text-xl font-bold mb-1" style={{ color: "#1c0a0d" }}>
                                {dep.materiais.length}
                            </div>

                            <div className="text-xs mb-3" style={{ color: "#9b7e82" }}>
                                materiais · {pct}% ocup.
                            </div>

                            <div
                                className="h-1.5 rounded-full overflow-hidden"
                                style={{ background: "rgba(92,26,34,0.08)" }}
                            >
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${Math.min(pct, 100)}%`,
                                        background: pct > 80 ? "#b91c1c" : "#c9976e",
                                    }}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>

            {viewMode === "grid" ? (
                <div className="flex flex-col gap-6">
                    {shown.map((dep) => (
                        <div
                            key={dep.id}
                            className="rounded-2xl overflow-hidden"
                            style={{
                                background: "rgba(255,252,248,0.7)",
                                border: "1px solid rgba(255,250,244,0.9)",
                                boxShadow: "0 2px 20px rgba(92,26,34,0.06)",
                            }}
                        >
                            <div
                                className="flex items-center gap-3 px-6 py-4"
                                style={{ borderBottom: "1px solid rgba(201,151,110,0.1)" }}
                            >
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: "rgba(92,26,34,0.07)", color: "#5c1a22" }}
                                >
                                    <IconMapPin size={15} />
                                </div>

                                <div>
                                    <span className="font-semibold text-sm" style={{ color: "#1c0a0d" }}>
                                        {dep.nome}
                                    </span>
                                    <span className="text-xs ml-2" style={{ color: "#9b7e82" }}>
                                        {dep.materiais.length} materiais
                                    </span>
                                </div>
                            </div>

                            <div
                                className="grid grid-cols-2 md:grid-cols-4 gap-px"
                                style={{ background: "rgba(201,151,110,0.08)" }}
                            >
                                {dep.materiais.map((m) => {
                                    const st = statusStyle[m.status];
                                    const pct = Math.min(
                                        Math.round((m.qtd / (m.minimo * 3)) * 100),
                                        100
                                    );

                                    return (
                                        <div
                                            key={m.nome}
                                            className="p-4"
                                            style={{ background: "rgba(255,252,248,0.9)" }}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <span
                                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                                    style={{
                                                        background: `${categoriaColor[m.categoria]}15`,
                                                        color: categoriaColor[m.categoria],
                                                    }}
                                                >
                                                    {m.categoria}
                                                </span>

                                                <span
                                                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                                    style={{ background: st.bg, color: st.color }}
                                                >
                                                    {st.label}
                                                </span>
                                            </div>

                                            <div
                                                className="text-xs font-semibold mb-2 leading-snug"
                                                style={{ color: "#1c0a0d" }}
                                            >
                                                {m.nome}
                                            </div>

                                            <div
                                                className="text-lg font-bold mb-1"
                                                style={{ color: "#5c1a22" }}
                                            >
                                                {m.qtd}{" "}
                                                <span
                                                    className="text-xs font-normal"
                                                    style={{ color: "#9b7e82" }}
                                                >
                                                    {m.unidade}
                                                </span>
                                            </div>

                                            <div
                                                className="h-1 rounded-full overflow-hidden"
                                                style={{ background: "rgba(92,26,34,0.08)" }}
                                            >
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${pct}%`,
                                                        background:
                                                            m.status === "crítico"
                                                                ? "#b91c1c"
                                                                : m.status === "baixo"
                                                                ? "#d97706"
                                                                : "#c9976e",
                                                    }}
                                                />
                                            </div>

                                            <div
                                                className="text-[10px] mt-1"
                                                style={{ color: "#c4b5b8" }}
                                            >
                                                mín. {m.minimo} {m.unidade}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div
                    className="rounded-2xl"
                    style={{
                        background: "rgba(255,252,248,0.7)",
                        border: "1px solid rgba(255,250,244,0.9)",
                        boxShadow: "0 2px 20px rgba(92,26,34,0.06)",
                    }}
                >
                    <div className="table-scroll-wrap overflow-hidden rounded-2xl">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: "1px solid rgba(201,151,110,0.12)" }}>
                                    {["Local", "Material", "Categoria", "Qtd.", "Mínimo", "Status"].map(
                                        (h) => (
                                            <th
                                                key={h}
                                                className="text-left px-5 py-3.5 text-[10.5px] font-semibold tracking-widest uppercase"
                                                style={{ color: "#9b7e82" }}
                                            >
                                                {h}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {shown.flatMap((dep) =>
                                    dep.materiais.map((m, i) => {
                                        const st = statusStyle[m.status];

                                        return (
                                            <tr
                                                key={`${dep.id}-${i}`}
                                                className="hover:bg-white/40 transition-colors"
                                                style={{
                                                    borderBottom: "1px solid rgba(255,255,255,0.6)",
                                                }}
                                            >
                                                <td
                                                    className="px-5 py-3 text-xs font-semibold"
                                                    style={{ color: "#5c1a22" }}
                                                >
                                                    {dep.nome}
                                                </td>

                                                <td
                                                    className="px-5 py-3 text-sm font-medium"
                                                    style={{ color: "#1c0a0d" }}
                                                >
                                                    {m.nome}
                                                </td>

                                                <td className="px-5 py-3">
                                                    <span
                                                        className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                                                        style={{
                                                            background: `${categoriaColor[m.categoria]}15`,
                                                            color: categoriaColor[m.categoria],
                                                        }}
                                                    >
                                                        {m.categoria}
                                                    </span>
                                                </td>

                                                <td
                                                    className="px-5 py-3 text-sm font-bold tabular-nums"
                                                    style={{ color: "#1c0a0d" }}
                                                >
                                                    {m.qtd}{" "}
                                                    <span
                                                        className="font-normal text-xs"
                                                        style={{ color: "#9b7e82" }}
                                                    >
                                                        {m.unidade}
                                                    </span>
                                                </td>

                                                <td
                                                    className="px-5 py-3 text-sm tabular-nums"
                                                    style={{ color: "#9b7e82" }}
                                                >
                                                    {m.minimo} {m.unidade}
                                                </td>

                                                <td className="px-5 py-3">
                                                    <span
                                                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                                                        style={{ background: st.bg, color: st.color }}
                                                    >
                                                        {st.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
