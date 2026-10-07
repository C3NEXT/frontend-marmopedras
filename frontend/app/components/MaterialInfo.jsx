import { fmtCodigo } from "../constants";

export const CodigoBadge = ({ codigo }) => {
    if (codigo === undefined || codigo === null || codigo === "") return null;
    return (<span className="inline-block px-1.5 py-0.5 rounded text-[10.5px] font-mono font-semibold flex-shrink-0" style={{ background: "rgba(92,26,34,0.08)", color: "#5c1a22" }}>
      {fmtCodigo(codigo)}
    </span>);
};

export const MaterialResumo = ({ material }) => {
    if (!material) return null;
    return (<div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 rounded-xl text-xs" style={{ background: "rgba(201,151,110,0.08)", border: "1px solid rgba(201,151,110,0.15)", color: "#7a5c60" }}>
      <span>Código: <strong className="font-mono" style={{ color: "#5c1a22" }}>{fmtCodigo(material.cod ?? material.codigo)}</strong></span>
      <span>Categoria: <strong style={{ color: "#5c1a22" }}>{material.categoria || "—"}</strong></span>
      <span>Tipo: <strong style={{ color: "#5c1a22" }}>{material.tipo || "—"}</strong></span>
    </div>);
};
