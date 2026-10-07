import { useState, useEffect } from "react";
import { api } from "../api";
import { IconTransfer, IconCheck, IconSearch, IconMapPin } from "../components/Icons";
import { fmtCodigo, matKey, matCod, descMaterial, descMov } from "../constants";
import { CodigoBadge, MaterialResumo } from "../components/MaterialInfo";
const locais = ["Depósito A", "Depósito B", "Depósito C", "Depósito D"];
const SuccessToast = ({ onClose }) => (<div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl" style={{ background: "#1c0a0d", color: "#fff", minWidth: "300px" }}>
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#c9976e" }}>
      <IconCheck size={14}/>
    </div>
    <div>
      <div className="text-sm font-semibold">Transferência registrada!</div>
      <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>Localização atualizada no estoque</div>
    </div>
    <button onClick={onClose} className="ml-auto text-xs opacity-50 hover:opacity-100">✕</button>
  </div>);
export default function Transferencia() {
    const [materiais, setMateriais] = useState([]);
    const [ultimasTransferencias, setUltimas] = useState([]);
    const carregar = () => {
        api("listarMateriais").then(setMateriais).catch(() => { });
        api("ultimasMovimentacoes", { tipo: "transferencias" }).then(setUltimas).catch(() => { });
    };
    useEffect(() => { carregar(); }, []);
    const [form, setForm] = useState({ material: "", quantidade: "", origem: "", destino: "", obs: "" });
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const materialSel = materiais.find((m) => matKey(m) === form.material);
    const disponivelOrigem = materialSel && form.origem ? materialSel.estoques[form.origem] ?? 0 : null;
    const validate = () => {
        const e = {};
        if (!form.material)
            e.material = "Selecione um material";
        if (!form.origem)
            e.origem = "Selecione a origem";
        if (!form.destino)
            e.destino = "Selecione o destino";
        if (form.origem === form.destino && form.origem)
            e.destino = "Origem e destino devem ser diferentes";
        const q = Number(form.quantidade);
        if (!form.quantidade || isNaN(q) || q <= 0)
            e.quantidade = "Quantidade inválida";
        if (disponivelOrigem !== null && q > disponivelOrigem)
            e.quantidade = `Apenas ${disponivelOrigem} ${materialSel?.unidade} disponíveis em ${form.origem}`;
        return e;
    };
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length > 0) {
            setErrors(e);
            return;
        }
        try {
            await api("registrarTransferencia", { material: materialSel?.nome ?? form.material, codigo: matCod(materialSel || {}), quantidade: form.quantidade, origem: form.origem, destino: form.destino, obs: form.obs });
            carregar();
        }
        catch (err) {
            setErrors(err.campos || { quantidade: err.message });
            return;
        }
        setSuccess(true);
        setForm({ material: "", quantidade: "", origem: "", destino: "", obs: "" });
        setErrors({});
        setTimeout(() => setSuccess(false), 4000);
    };
    const cardStyle = {
        background: "rgba(255,252,248,0.7)",
        border: "1px solid rgba(255,250,244,0.9)",
        boxShadow: "0 2px 20px rgba(92,26,34,0.06)",
    };
    const inputStyle = (err) => ({
        background: "rgba(255,252,248,0.8)",
        border: err ? "1px solid #f87171" : "1px solid rgba(92,26,34,0.12)",
        color: "#1c0a0d",
    });
    const Label = ({ children }) => (<label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
      {children}
    </label>);
    return (<div className="page-scroll flex-1 overflow-y-auto px-8 py-7 flex flex-col gap-6">
      {success && <SuccessToast onClose={() => setSuccess(false)}/>}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(92,26,34,0.08)", color: "#5c1a22" }}>
          <IconTransfer size={18}/>
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1c0a0d" }}>Transferência / Localização</h1>
          <p className="text-sm" style={{ color: "#7a5c60" }}>Mova materiais entre depósitos e locais de estoque</p>
        </div>
      </div>

      <div className="flex gap-6 flex-wrap">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-[320px] rounded-2xl p-7 flex flex-col gap-5" style={cardStyle}>
          <h2 className="text-base font-semibold" style={{ color: "#1c0a0d" }}>Dados da Transferência</h2>

          {/* Material */}
          <div>
            <Label>Material *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9b7e82" }}><IconSearch size={14}/></span>
              <select value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value, origem: "", quantidade: "" }))} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none appearance-none" style={inputStyle(errors.material)}>
                <option value="">Selecione um material…</option>
                {materiais.map((m) => <option key={matKey(m)} value={matKey(m)}>{fmtCodigo(matCod(m))} · {m.nome}{descMaterial(m) ? ` (${descMaterial(m)})` : ""}</option>)}
              </select>
            </div>
            {errors.material && <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{errors.material}</p>}
          </div>

          {materialSel && <MaterialResumo material={materialSel}/>}

          {/* Estoque por local */}
          {materialSel && (<div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(201,151,110,0.15)" }}>
              <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(201,151,110,0.08)", color: "#7a5c60" }}>
                Estoque por localização
              </div>
              <div className="grid grid-cols-4 divide-x" style={{ borderTop: "1px solid rgba(201,151,110,0.1)" }}>
                {locais.map((l) => {
                const qty = materialSel.estoques[l] ?? 0;
                return (<div key={l} className="px-3 py-2.5 text-center">
                      <div className="text-[10px] mb-1" style={{ color: "#9b7e82" }}>{l}</div>
                      <div className="text-sm font-bold" style={{ color: qty > 0 ? "#1c0a0d" : "#c4b5b8" }}>
                        {qty} <span className="text-[10px] font-normal">{materialSel.unidade}</span>
                      </div>
                    </div>);
            })}
              </div>
            </div>)}

          {/* Origem → Destino */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Label><span className="flex items-center gap-1"><IconMapPin size={11}/> Origem *</span></Label>
              <select value={form.origem} onChange={(e) => setForm((f) => ({ ...f, origem: e.target.value, quantidade: "" }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none appearance-none" style={inputStyle(errors.origem)}>
                <option value="">Selecione…</option>
                {locais.filter((l) => !materialSel || (materialSel.estoques[l] ?? 0) > 0).map((l) => (<option key={l}>{l}</option>))}
              </select>
              {errors.origem && <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{errors.origem}</p>}
            </div>

            <div className="flex-shrink-0 pb-2" style={{ color: "#c9976e" }}>
              <IconTransfer size={18}/>
            </div>

            <div className="flex-1">
              <Label><span className="flex items-center gap-1"><IconMapPin size={11}/> Destino *</span></Label>
              <select value={form.destino} onChange={(e) => setForm((f) => ({ ...f, destino: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none appearance-none" style={inputStyle(errors.destino)}>
                <option value="">Selecione…</option>
                {locais.filter((l) => l !== form.origem).map((l) => <option key={l}>{l}</option>)}
              </select>
              {errors.destino && <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{errors.destino}</p>}
            </div>
          </div>

          {/* Quantidade */}
          <div>
            <Label>Quantidade *</Label>
            <div className="flex gap-2 items-center">
              <input type="number" min="0" max={disponivelOrigem ?? undefined} placeholder="0" value={form.quantidade} onChange={(e) => setForm((f) => ({ ...f, quantidade: e.target.value }))} className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle(errors.quantidade)}/>
              {materialSel && <span className="text-sm" style={{ color: "#9b7e82" }}>{materialSel.unidade}</span>}
            </div>
            {disponivelOrigem !== null && !errors.quantidade && (<p className="text-xs mt-1" style={{ color: "#9b7e82" }}>
                Disponível em {form.origem}: {disponivelOrigem} {materialSel?.unidade}
              </p>)}
            {errors.quantidade && <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{errors.quantidade}</p>}
          </div>

          {/* Obs */}
          <div>
            <Label>Observações</Label>
            <textarea rows={2} placeholder="Motivo da transferência…" value={form.obs} onChange={(e) => setForm((f) => ({ ...f, obs: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={inputStyle()}/>
          </div>

          <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" style={{ background: "#5c1a22", color: "#fff" }}>
            <IconTransfer size={15}/>
            Confirmar Transferência
          </button>
        </form>

        {/* Recent transfers */}
        <div className="w-72 flex-shrink-0">
          <div className="rounded-2xl p-6" style={cardStyle}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "#1c0a0d" }}>Transferências de Hoje</h3>
            <div className="flex flex-col gap-4">
              {ultimasTransferencias.map((t, i) => (<div key={i} style={{ borderBottom: i < ultimasTransferencias.length - 1 ? "1px solid rgba(201,151,110,0.12)" : "none", paddingBottom: i < ultimasTransferencias.length - 1 ? "1rem" : 0 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold tabular-nums" style={{ color: "#5c1a22" }}>{t.hora}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#f3f4f6", color: "#374151" }}>{t.qtd}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <CodigoBadge codigo={t.codigo ?? t.cod}/>
                    <span className="text-xs font-medium" style={{ color: "#1c0a0d" }}>{t.material}</span>
                  </div>
                  {descMov(t) && <div className="text-[11px] mb-1" style={{ color: "#9b7e82" }}>{descMov(t)}</div>}
                  <div className="flex items-center gap-2 text-[11px]" style={{ color: "#9b7e82" }}>
                    <span>{t.de}</span>
                    <IconTransfer size={10}/>
                    <span>{t.para}</span>
                  </div>
                </div>))}
            </div>
          </div>
        </div>
      </div>
    </div>);
}
