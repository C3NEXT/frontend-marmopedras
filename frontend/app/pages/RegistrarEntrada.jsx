import { useState, useEffect } from "react";
import { api } from "../api";
import { IconDown, IconCheck, IconSearch, IconCalendar, IconMapPin } from "../components/Icons";
import { CATEGORIAS, TIPOS, fmtCodigo, matKey, matCod, descMaterial, descMov } from "../constants";
import { CodigoBadge } from "../components/MaterialInfo";
const locais = ["Depósito A", "Depósito B", "Depósito C", "Depósito D"];
const SuccessToast = ({ onClose, detalhe }) => (<div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl" style={{ background: "#1c0a0d", color: "#fff", minWidth: "280px" }}>
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#c9976e" }}>
      <IconCheck size={14}/>
    </div>
    <div>
      <div className="text-sm font-semibold">Entrada registrada com sucesso!</div>
      <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
        {detalhe || "Estoque atualizado"}
      </div>
    </div>
    <button onClick={onClose} className="ml-auto text-xs opacity-50 hover:opacity-100">✕</button>
  </div>);
export default function RegistrarEntrada() {
    const [materiais, setMateriais] = useState([]);
    const [ultimasEntradas, setUltimas] = useState([]);
    const carregarUltimas = () => api("ultimasMovimentacoes", { tipo: "entradas" })
        .then((l) => setUltimas(l.map((m) => ({ hora: m.hora, material: m.material, codigo: m.codigo ?? m.cod, categoria: m.categoria, tipo_material: m.tipo_material, qtd: m.qtd, obs: m.nota, responsavel: m.responsavel }))))
        .catch(() => { });
    const carregarMateriais = () => api("listarMateriais").then(setMateriais).catch(() => { });
    useEffect(() => {
        carregarMateriais();
        carregarUltimas();
    }, []);
    const formVazio = () => ({
        modo: "existente",
        material: "",
        nomeNovo: "",
        categoria: "",
        tipo: "",
        quantidade: "",
        unidade: "m²",
        local: "Depósito A",
        nota: "",
        data: new Date().toISOString().slice(0, 10),
        obs: "",
    });
    const [form, setForm] = useState(formVazio);
    const [success, setSuccess] = useState(false);
    const [detalheToast, setDetalheToast] = useState("");
    const [errors, setErrors] = useState({});
    const novo = form.modo === "novo";
    const materialSel = !novo ? materiais.find((m) => matKey(m) === form.material) : null;
    const proximoPrevisto = (() => {
        const nums = materiais.map((m) => Number(matCod(m))).filter((n) => Number.isFinite(n));
        return fmtCodigo((nums.length ? Math.max(...nums) : 0) + 1);
    })();
    const selecionarMaterial = (key) => {
        const m = materiais.find((x) => matKey(x) === key);
        setForm((f) => ({ ...f, material: key, categoria: m?.categoria || "", tipo: m?.tipo || "", unidade: m?.unidade || f.unidade }));
    };
    const trocarModo = (modo) => setForm((f) => ({ ...f, modo, material: "", nomeNovo: "", categoria: "", tipo: "" }));
    const validate = () => {
        const e = {};
        if (novo) {
            if (!form.nomeNovo.trim())
                e.nomeNovo = "Informe o nome do material";
            if (!form.categoria)
                e.categoria = "Selecione a categoria";
        }
        else if (!form.material)
            e.material = "Selecione um material";
        if (!form.quantidade || isNaN(Number(form.quantidade)) || Number(form.quantidade) <= 0)
            e.quantidade = "Informe uma quantidade válida";
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
            const payload = {
                material: novo ? form.nomeNovo.trim() : (materialSel?.nome ?? form.material),
                codigo: novo ? undefined : matCod(materialSel || {}),
                novoMaterial: novo,
                categoria: form.categoria,
                tipo: form.tipo,
                unidade: form.unidade,
                quantidade: form.quantidade,
                local: form.local,
                nota: form.nota,
                data: form.data,
                obs: form.obs,
            };
            const r = await api("registrarEntrada", payload);
            const cod = r?.codigo ?? r?.cod ?? (novo ? null : matCod(materialSel || {}));
            setDetalheToast(novo && cod ? `Material criado com o código ${fmtCodigo(cod)}` : "Estoque atualizado");
            carregarUltimas();
            carregarMateriais();
        }
        catch (err) {
            setErrors(err.campos || { quantidade: err.message });
            return;
        }
        setSuccess(true);
        setForm(formVazio());
        setErrors({});
        setTimeout(() => setSuccess(false), 4000);
    };
    const field = (label, key, type = "text", placeholder = "") => (<div>
      <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
        {label}
      </label>
      <input type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all" style={{
            background: "rgba(255,252,248,0.8)",
            border: errors[key] ? "1px solid #f87171" : "1px solid rgba(92,26,34,0.12)",
            color: "#1c0a0d",
        }}/>
      {errors[key] && <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{errors[key]}</p>}
    </div>);
    return (<div className="page-scroll flex-1 overflow-y-auto px-8 py-7 flex flex-col gap-6">
      {success && <SuccessToast onClose={() => setSuccess(false)} detalhe={detalheToast}/>}

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(92,26,34,0.08)", color: "#5c1a22" }}>
          <IconDown size={18}/>
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1c0a0d" }}>Registrar Entrada</h1>
          <p className="text-sm" style={{ color: "#7a5c60" }}>Adicione materiais ao estoque</p>
        </div>
      </div>

      <div className="flex gap-6 flex-wrap">
        <form onSubmit={handleSubmit} className="flex-1 min-w-[320px] rounded-2xl p-7 flex flex-col gap-5" style={{ background: "rgba(255,252,248,0.7)", border: "1px solid rgba(255,250,244,0.9)", boxShadow: "0 2px 20px rgba(92,26,34,0.06)" }}>
          <h2 className="text-base font-semibold mb-1" style={{ color: "#1c0a0d" }}>
            Dados da Entrada
          </h2>

          <div>
            <div className="flex gap-1 mb-3">
              {[["existente", "Material existente"], ["novo", "+ Novo material"]].map(([id, label]) => (<button type="button" key={id} onClick={() => trocarModo(id)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={form.modo === id
                ? { background: "#5c1a22", color: "#fff" }
                : { background: "rgba(255,252,248,0.8)", color: "#7a5c60", border: "1px solid rgba(92,26,34,0.1)" }}>
                  {label}
                </button>))}
            </div>

            {!novo ? (<>
                <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
                  Material *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9b7e82" }}>
                    <IconSearch size={14}/>
                  </span>
                  <select value={form.material} onChange={(e) => selecionarMaterial(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none appearance-none" style={{
                background: "rgba(255,252,248,0.8)",
                border: errors.material ? "1px solid #f87171" : "1px solid rgba(92,26,34,0.12)",
                color: form.material ? "#1c0a0d" : "#9b7e82",
            }}>
                    <option value="">Selecione um material…</option>
                    {materiais.map((m) => (<option key={matKey(m)} value={matKey(m)}>
                        {fmtCodigo(matCod(m))} · {m.nome}{descMaterial(m) ? ` (${descMaterial(m)})` : ""}
                      </option>))}
                  </select>
                </div>
                {errors.material && <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{errors.material}</p>}
              </>) : (<>
                <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
                  Nome do material *
                </label>
                <input type="text" placeholder="Ex.: Preto São Gabriel" value={form.nomeNovo} onChange={(e) => setForm((f) => ({ ...f, nomeNovo: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{
                background: "rgba(255,252,248,0.8)",
                border: errors.nomeNovo ? "1px solid #f87171" : "1px solid rgba(92,26,34,0.12)",
                color: "#1c0a0d",
            }}/>
                {errors.nomeNovo && <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{errors.nomeNovo}</p>}
                <p className="text-xs mt-1.5" style={{ color: "#9b7e82" }}>
                  Código previsto: <strong className="font-mono" style={{ color: "#5c1a22" }}>{proximoPrevisto}</strong> (definido ao salvar)
                </p>
              </>)}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
                Categoria{novo ? " *" : ""}
              </label>
              <select value={form.categoria} disabled={!novo} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none appearance-none disabled:opacity-70" style={{
                background: "rgba(255,252,248,0.8)",
                border: errors.categoria ? "1px solid #f87171" : "1px solid rgba(92,26,34,0.12)",
                color: form.categoria ? "#1c0a0d" : "#9b7e82",
            }}>
                <option value="">{novo ? "Selecione…" : "—"}</option>
                {form.categoria && !CATEGORIAS.includes(form.categoria) && <option value={form.categoria}>{form.categoria}</option>}
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.categoria && <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{errors.categoria}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
                Tipo
              </label>
              <select value={form.tipo} disabled={!novo} onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none appearance-none disabled:opacity-70" style={{ background: "rgba(255,252,248,0.8)", border: "1px solid rgba(92,26,34,0.12)", color: form.tipo ? "#1c0a0d" : "#9b7e82" }}>
                <option value="">Em branco</option>
                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
                Quantidade *
              </label>
              <input type="number" min="0" placeholder="0" value={form.quantidade} onChange={(e) => setForm((f) => ({ ...f, quantidade: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{
            background: "rgba(255,252,248,0.8)",
            border: errors.quantidade ? "1px solid #f87171" : "1px solid rgba(92,26,34,0.12)",
            color: "#1c0a0d",
        }}/>
              {errors.quantidade && <p className="text-xs mt-1" style={{ color: "#b91c1b" }}>{errors.quantidade}</p>}
            </div>
            <div className="w-24">
              <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
                Unidade
              </label>
              <select value={form.unidade} onChange={(e) => setForm((f) => ({ ...f, unidade: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none appearance-none" style={{ background: "rgba(255,252,248,0.8)", border: "1px solid rgba(92,26,34,0.12)", color: "#1c0a0d" }}>
                {["m²", "sacos", "kg", "latas", "tubos", "peças", "un"].map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
              <span className="flex items-center gap-1.5"><IconMapPin size={12}/> Destino</span>
            </label>
            <select value={form.local} onChange={(e) => setForm((f) => ({ ...f, local: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none appearance-none" style={{ background: "rgba(255,252,248,0.8)", border: "1px solid rgba(92,26,34,0.12)", color: "#1c0a0d" }}>
              {locais.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
                <span className="flex items-center gap-1.5"><IconCalendar size={12}/> Data</span>
              </label>
              <input type="date" value={form.data} onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,252,248,0.8)", border: "1px solid rgba(92,26,34,0.12)", color: "#1c0a0d" }}/>
            </div>
            <div className="flex-1">
              {field("Nota Fiscal", "nota", "text", "NF 00000")}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#7a5c60" }}>
              Observações
            </label>
            <textarea rows={3} placeholder="Observações opcionais…" value={form.obs} onChange={(e) => setForm((f) => ({ ...f, obs: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: "rgba(255,252,248,0.8)", border: "1px solid rgba(92,26,34,0.12)", color: "#1c0a0d" }}/>
          </div>

          <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90" style={{ background: "#5c1a22", color: "#fff" }}>
            <IconDown size={15}/>
            Confirmar Entrada
          </button>
        </form>

        <div className="w-72 flex-shrink-0 flex flex-col gap-4">
          <div className="rounded-2xl p-6" style={{ background: "rgba(255,252,248,0.7)", border: "1px solid rgba(255,250,244,0.9)", boxShadow: "0 2px 20px rgba(92,26,34,0.06)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "#1c0a0d" }}>
              Últimas Entradas Hoje
            </h3>
            <div className="flex flex-col gap-4">
              {ultimasEntradas.map((e, i) => (<div key={i} className="flex flex-col gap-1" style={{ borderBottom: i < ultimasEntradas.length - 1 ? "1px solid rgba(201,151,110,0.12)" : "none", paddingBottom: i < ultimasEntradas.length - 1 ? "1rem" : 0 }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tabular-nums" style={{ color: "#5c1a22" }}>{e.hora}</span>
                    <span className="text-xs font-semibold" style={{ color: "#065f46", background: "#d1fae5", padding: "2px 8px", borderRadius: "99px" }}>{e.qtd}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CodigoBadge codigo={e.codigo}/>
                    <span className="text-xs font-medium" style={{ color: "#1c0a0d" }}>{e.material}</span>
                  </div>
                  {descMov(e) && <div className="text-[11px]" style={{ color: "#9b7e82" }}>{descMov(e)}</div>}
                  <div className="text-[11px]" style={{ color: "#9b7e82" }}>{e.obs} · {e.responsavel}</div>
                </div>))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "rgba(92,26,34,0.04)", border: "1px solid rgba(92,26,34,0.08)" }}>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7a5c60" }}>
              Dica
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "#7a5c60" }}>
              Certifique-se de informar corretamente o número da nota fiscal para facilitar a rastreabilidade e conferências futuras.
            </p>
          </div>
        </div>
      </div>
    </div>);
}
