import { useState, useEffect } from "react";
import { api } from "../api";
import { IconUp, IconCheck, IconSearch, IconMapPin, IconCalendar } from "../components/Icons";
import { fmtCodigo, matKey, matCod, descMaterial, descMov } from "../constants";
import { CodigoBadge, MaterialResumo } from "../components/MaterialInfo";
const obras = [
    "Obra Residencial — Av. das Américas, 4500",
    "Condomínio Bela Vista — Bloco C",
    "Reforma Comercial — R. do Comércio, 120",
    "Hotel Panorama — Suítes 301-320",
    "Escritório Corporativo — Torre Sul",
];
const SuccessToast = ({ onClose }) => (<div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl" style={{ background: "#1c0a0d", color: "#fff", minWidth: "280px" }}>
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#c9976e" }}>
      <IconCheck size={14}/>
    </div>
    <div>
      <div className="text-sm font-semibold">Saída registrada com sucesso!</div>
      <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>Estoque atualizado</div>
    </div>
    <button onClick={onClose} className="ml-auto text-xs opacity-50 hover:opacity-100">✕</button>
  </div>);
export default function RegistrarSaida() {
    const [materiais, setMateriais] = useState([]);
    const [ultimasSaidas, setUltimas] = useState([]);
    const carregar = () => {
        api("listarMateriais").then(setMateriais).catch(() => { });
        api("ultimasMovimentacoes", { tipo: "saidas" }).then(setUltimas).catch(() => { });
    };
    useEffect(() => { carregar(); }, []);
    const [form, setForm] = useState({
        material: "",
        quantidade: "",
        obra: "",
        data: new Date().toISOString().slice(0, 10),
        responsavel: "",
        obs: "",
    });
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const materialSel = materiais.find((m) => matKey(m) === form.material);
    const validate = () => {
        const e = {};
        if (!form.material)
            e.material = "Selecione um material";
        const q = Number(form.quantidade);
        if (!form.quantidade || isNaN(q) || q <= 0)
            e.quantidade = "Quantidade inválida";
        if (materialSel && q > materialSel.estoque)
            e.quantidade = `Estoque insuficiente (disponível: ${materialSel.estoque} ${materialSel.unidade})`;
        if (!form.obra)
            e.obra = "Informe a obra de destino";
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
            await api("registrarSaida", { material: materialSel?.nome ?? form.material, codigo: matCod(materialSel || {}), quantidade: form.quantidade, obra: form.obra, data: form.data, responsavel: form.responsavel, obs: form.obs });
            carregar();
        }
        catch (err) {
            setErrors(err.campos || { quantidade: err.message });
            return;
        }
        setSuccess(true);
        setForm({ material: "", quantidade: "", obra: "", data: new Date().toISOString().slice(0, 10), responsavel: "", obs: "" });
        setErrors({});
        setTimeout(() => setSuccess(false), 4000);
    };
    return (<div className="page-scroll flex-1 overflow-y-auto px-8 py-7 flex flex-col gap-6">
      {success && <SuccessToast onClose={() => setSuccess(false)}/>}

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(185,28,28,0.07)", color: "#b91c1c" }}>
          <IconUp size={18}/>
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1c0a0d" }}>Registrar Saída</h1>
          <p className="text-sm" style={{ color: "#7a5c60" }}>Retire materiais do estoque para obras e projetos</p>
        </div>
      </div>

      <div className="flex gap-6 flex-wrap">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-[320px] rounded-2xl p-7 flex flex-col gap-5" style={{ background: "rgba(255,252,248,0.7)", border: "1px solid rgba(255,250,244,0.9)", boxShadow: "0 2px 20px rgba(92,26,34,0.06)" }}>
          <h2 className="text-base font-semibold mb-1" style={{ color: "#1c0a0d" }}>Dados da Saída</h2>

          {/* Material */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
              Material *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9b7e82" }}>
                <IconSearch size={14}/>
              </span>
              <select value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value, quantidade: "" }))} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none appearance-none" style={{
            background: "rgba(255,252,248,0.8)",
            border: errors.material ? "1px solid #f87171" : "1px solid rgba(92,26,34,0.12)",
            color: form.material ? "#1c0a0d" : "#9b7e82",
        }}>
                <option value="">Selecione um material…</option>
                {materiais.map((m) => (<option key={matKey(m)} value={matKey(m)}>
                    {fmtCodigo(matCod(m))} · {m.nome}{descMaterial(m) ? ` (${descMaterial(m)})` : ""} — {m.estoque} {m.unidade} disp.
                  </option>))}
              </select>
            </div>
            {errors.material && <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{errors.material}</p>}
          </div>

          {materialSel && <MaterialResumo material={materialSel}/>}

          {/* Estoque atual */}
          {materialSel && (<div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(201,151,110,0.08)", border: "1px solid rgba(201,151,110,0.15)" }}>
              <div className="text-xs" style={{ color: "#7a5c60" }}>
                Estoque atual: <strong style={{ color: "#5c1a22" }}>{materialSel.estoque} {materialSel.unidade}</strong>
              </div>
            </div>)}

          {/* Quantidade */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
              Quantidade *
            </label>
            <div className="flex gap-2">
              <input type="number" min="0" max={materialSel?.estoque} placeholder="0" value={form.quantidade} onChange={(e) => setForm((f) => ({ ...f, quantidade: e.target.value }))} className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none" style={{
            background: "rgba(255,252,248,0.8)",
            border: errors.quantidade ? "1px solid #f87171" : "1px solid rgba(92,26,34,0.12)",
            color: "#1c0a0d",
        }}/>
              {materialSel && (<span className="flex items-center px-3 text-sm" style={{ color: "#9b7e82" }}>
                  {materialSel.unidade}
                </span>)}
            </div>
            {errors.quantidade && <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{errors.quantidade}</p>}
          </div>

          {/* Obra */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
              <span className="flex items-center gap-1.5"><IconMapPin size={12}/> Obra / Destino *</span>
            </label>
            <select value={form.obra} onChange={(e) => setForm((f) => ({ ...f, obra: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none appearance-none" style={{
            background: "rgba(255,252,248,0.8)",
            border: errors.obra ? "1px solid #f87171" : "1px solid rgba(92,26,34,0.12)",
            color: form.obra ? "#1c0a0d" : "#9b7e82",
        }}>
              <option value="">Selecione a obra…</option>
              {obras.map((o) => <option key={o}>{o}</option>)}
            </select>
            {errors.obra && <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{errors.obra}</p>}
          </div>

          {/* Data + Responsável */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
                <span className="flex items-center gap-1.5"><IconCalendar size={12}/> Data</span>
              </label>
              <input type="date" value={form.data} onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,252,248,0.8)", border: "1px solid rgba(92,26,34,0.12)", color: "#1c0a0d" }}/>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
                Responsável
              </label>
              <input type="text" placeholder="Nome do responsável" value={form.responsavel} onChange={(e) => setForm((f) => ({ ...f, responsavel: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,252,248,0.8)", border: "1px solid rgba(92,26,34,0.12)", color: "#1c0a0d" }}/>
            </div>
          </div>

          {/* Obs */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
              Observações
            </label>
            <textarea rows={2} placeholder="Informações adicionais…" value={form.obs} onChange={(e) => setForm((f) => ({ ...f, obs: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: "rgba(255,252,248,0.8)", border: "1px solid rgba(92,26,34,0.12)", color: "#1c0a0d" }}/>
          </div>

          <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90" style={{ background: "#5c1a22", color: "#fff" }}>
            <IconUp size={15}/>
            Confirmar Saída
          </button>
        </form>

        {/* Recent exits */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-4">
          <div className="rounded-2xl p-6" style={{ background: "rgba(255,252,248,0.7)", border: "1px solid rgba(255,250,244,0.9)", boxShadow: "0 2px 20px rgba(92,26,34,0.06)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "#1c0a0d" }}>Últimas Saídas Hoje</h3>
            <div className="flex flex-col gap-4">
              {ultimasSaidas.map((s, i) => (<div key={i} style={{ borderBottom: i < ultimasSaidas.length - 1 ? "1px solid rgba(201,151,110,0.12)" : "none", paddingBottom: i < ultimasSaidas.length - 1 ? "1rem" : 0 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold tabular-nums" style={{ color: "#5c1a22" }}>{s.hora}</span>
                    <span className="text-xs font-semibold" style={{ color: "#991b1b", background: "#fee2e2", padding: "2px 8px", borderRadius: "99px" }}>{s.qtd}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <CodigoBadge codigo={s.codigo ?? s.cod}/>
                    <span className="text-xs font-medium" style={{ color: "#1c0a0d" }}>{s.material}</span>
                  </div>
                  {descMov(s) && <div className="text-[11px] mb-0.5" style={{ color: "#9b7e82" }}>{descMov(s)}</div>}
                  <div className="text-[11px]" style={{ color: "#9b7e82" }}>{s.obra}</div>
                </div>))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "rgba(185,28,28,0.04)", border: "1px solid rgba(185,28,28,0.08)" }}>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#b91c1c" }}>Atenção</h3>
            <p className="text-xs leading-relaxed" style={{ color: "#7a5c60" }}>
              Verifique sempre se a quantidade disponível é suficiente para a obra. Itens com estoque crítico serão sinalizados automaticamente.
            </p>
          </div>
        </div>
      </div>
    </div>);
}
