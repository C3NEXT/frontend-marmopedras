import { useState, useEffect } from "react";
import { api } from "../api";
import { IconCheck } from "../components/Icons";
const MARBLE_BG = "https://images.unsplash.com/photo-1770065805058-3bfed55e23ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400";
const IconEye = ({ open }) => open ? (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>) : (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>);
const IconUser = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>);
const IconMail = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>);
const IconLock = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>);
const IconPhone = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.64 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.55 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>);
const IconBuilding = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 9h1v1H9zM9 13h1v1H9zM9 17h1v1H9zM14 9h1v1h-1zM14 13h1v1h-1zM14 17h1v1h-1z"/>
    <path d="M9 21V3"/>
  </svg>);
const inputBase = {
    background: "rgba(255,252,248,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    borderRadius: "12px",
    width: "100%",
    padding: "11px 40px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
};
function FieldInput({ icon, placeholder, type = "text", value, onChange, error, right, }) {
    return (<div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.45)" }}>
          {icon}
        </span>
        <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputBase, ...(error ? { borderColor: "#f87171" } : {}) }} onFocus={(e) => { if (!error)
        e.currentTarget.style.borderColor = "rgba(201,151,110,0.7)"; }} onBlur={(e) => { if (!error)
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}/>
        {right && (<span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: "rgba(255,255,255,0.4)" }}>
            {right}
          </span>)}
      </div>
      {error && <p className="text-xs mt-1 pl-1" style={{ color: "#f87171" }}>{error}</p>}
    </div>);
}
export default function Auth({ onAuth }) {
    const [mode, setMode] = useState("login");
    const [showPw, setShowPw] = useState(false);
    const [showPw2, setShowPw2] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPw, setLoginPw] = useState("");
    const [loginErrors, setLoginErrors] = useState({});
    const [regNome, setRegNome] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regTel, setRegTel] = useState("");
    const [regCargo, setRegCargo] = useState("");
    const [regPw, setRegPw] = useState("");
    const [regPw2, setRegPw2] = useState("");
    const [regErrors, setRegErrors] = useState({});
    const validateLogin = () => {
        const e = {};
        if (!loginEmail)
            e.email = "Informe o e-mail";
        else if (!/\S+@\S+\.\S+/.test(loginEmail))
            e.email = "E-mail inválido";
        if (!loginPw)
            e.pw = "Informe a senha";
        else if (loginPw.length < 6)
            e.pw = "Mínimo 6 caracteres";
        return e;
    };
    const validateRegister = () => {
        const e = {};
        if (!regNome.trim())
            e.nome = "Informe seu nome completo";
        if (!regEmail)
            e.email = "Informe o e-mail";
        else if (!/\S+@\S+\.\S+/.test(regEmail))
            e.email = "E-mail inválido";
        if (!regTel.trim())
            e.tel = "Informe o telefone";
        if (!regPw)
            e.pw = "Informe a senha";
        else if (regPw.length < 6)
            e.pw = "Mínimo 6 caracteres";
        if (regPw !== regPw2)
            e.pw2 = "As senhas não coincidem";
        return e;
    };
    const [loading, setLoading] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        if (loading)
            return;
        const errs = validateLogin();
        if (Object.keys(errs).length > 0) {
            setLoginErrors(errs);
            return;
        }
        setLoading(true);
        try {
            const { token, usuario } = await api("login", { email: loginEmail, senha: loginPw });
            localStorage.setItem("token", token);
            onAuth(usuario);
        }
        catch (err) {
            setLoginErrors({ pw: err.message || "Falha ao entrar" });
        }
        finally {
            setLoading(false);
        }
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        if (loading)
            return;
        const errs = validateRegister();
        if (Object.keys(errs).length > 0) {
            setRegErrors(errs);
            return;
        }
        setLoading(true);
        try {
            await api("register", { nome: regNome, email: regEmail, telefone: regTel, cargo: regCargo, senha: regPw });
        }
        catch (err) {
            const c = err.campos || {};
            setRegErrors(err.campos ? { nome: c.nome, email: c.email, pw: c.senha } : { email: err.message });
            setLoading(false);
            return;
        }
        setLoading(false);
        setRegistered(true);
        setTimeout(() => {
            setRegistered(false);
            setMode("login");
            setLoginEmail(regEmail);
        }, 2200);
    };
    const cargos = ["Funcionário", "Gerente de Estoque", "Vendedor", "Administrador", "Outro"];
    return (<div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden" style={{
            backgroundImage: `url(${MARBLE_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(61,15,22,0.82) 0%, rgba(92,26,34,0.55) 60%, rgba(40,10,14,0.7) 100%)" }}/>

        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
              <svg width="26" height="26" viewBox="0 0 36 36" fill="none">
                <path d="M4 30V8l10 14L24 8v22" stroke="#c9976e" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 8l8 4v18" stroke="#c9976e" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: "#f5ede4" }}>Marmopedras</div>
              <div className="text-[9px] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>Pedras que constroem histórias</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 px-10 pb-12">
          <div className="mb-10">
            <div className="w-8 h-px mb-6" style={{ background: "#c9976e" }}/>
            <h2 className="text-4xl font-bold leading-tight mb-4" style={{ color: "#f5ede4" }}>
              Controle total<br />do seu estoque<br />de pedras.
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", maxWidth: "340px" }}>
              Gerencie entradas, saídas, transferências e distribuição de materiais com elegância e precisão.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Gestão de estoque", "Histórico completo", "Alertas de saldo", "Chatbot integrado"].map((f) => (<span key={f} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#c9976e" }}/>
                {f}
              </span>))}
          </div>

          <p className="text-[11px] mt-8" style={{ color: "rgba(255,255,255,0.25)" }}>
            Powered by <strong style={{ color: "rgba(255,255,255,0.4)" }}>NEXT</strong> · © 2026 Marmopedras
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 overflow-y-auto relative" style={{ background: "#3d0f16" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(ellipse 80% 60% at 60% 20%, rgba(201,151,110,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 20% 80%, rgba(92,26,34,0.3) 0%, transparent 70%)",
        }}/>

        <div className="relative z-10 w-full max-w-[400px]">
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
              <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
                <path d="M4 30V8l10 14L24 8v22" stroke="#c9976e" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 8l8 4v18" stroke="#c9976e" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-base font-bold" style={{ color: "#f5ede4" }}>Marmopedras</div>
          </div>

          <div className="flex rounded-xl mb-8 p-1" style={{ background: "rgba(255,255,255,0.06)" }}>
            {["login", "register"].map((m) => (<button key={m} onClick={() => { setMode(m); setLoginErrors({}); setRegErrors({}); setRegistered(false); }} className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all" style={mode === m
                ? { background: "#5c1a22", color: "#f5ede4", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }
                : { color: "rgba(255,255,255,0.4)" }}>
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>))}
          </div>

          {mode === "login" && (<form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: "#f5ede4" }}>Bem-vindo de volta</h1>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>Acesse sua conta Marmopedras</p>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <FieldInput icon={<IconMail />} placeholder="E-mail" type="email" value={loginEmail} onChange={(v) => { setLoginEmail(v); setLoginErrors((e) => ({ ...e, email: "" })); }} error={loginErrors.email}/>
                <FieldInput icon={<IconLock />} placeholder="Senha" type={showPw ? "text" : "password"} value={loginPw} onChange={(v) => { setLoginPw(v); setLoginErrors((e) => ({ ...e, pw: "" })); }} error={loginErrors.pw} right={<span onClick={() => setShowPw((p) => !p)}><IconEye open={showPw}/></span>}/>
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-xs hover:opacity-80 transition-opacity" style={{ color: "#c9976e" }}>
                  Esqueceu a senha?
                </button>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity mt-1" style={{ background: "#c9976e", color: "#fff" }}>
                Entrar no sistema
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }}/>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>ou</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }}/>
              </div>

              <button type="button" onClick={() => setMode("register")} className="w-full py-3 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
                Criar nova conta
              </button>
            </form>)}

          {mode === "register" && !registered && (<form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: "#f5ede4" }}>Criar conta</h1>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>Preencha os dados para solicitar acesso</p>
              </div>

              <div className="flex flex-col gap-3 mt-1">
                <FieldInput icon={<IconUser />} placeholder="Nome completo *" value={regNome} onChange={(v) => { setRegNome(v); setRegErrors((e) => ({ ...e, nome: "" })); }} error={regErrors.nome}/>
                <FieldInput icon={<IconMail />} placeholder="E-mail *" type="email" value={regEmail} onChange={(v) => { setRegEmail(v); setRegErrors((e) => ({ ...e, email: "" })); }} error={regErrors.email}/>
                <FieldInput icon={<IconPhone />} placeholder="Telefone / WhatsApp *" value={regTel} onChange={(v) => { setRegTel(v); setRegErrors((e) => ({ ...e, tel: "" })); }} error={regErrors.tel}/>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <select value={regCargo} onChange={(e) => setRegCargo(e.target.value)} className="appearance-none w-full" style={{ ...inputBase, paddingLeft: "14px", color: regCargo ? "#fff" : "rgba(255,255,255,0.4)" }}>
                        <option value="">Cargo</option>
                        {cargos.map((c) => <option key={c} value={c} style={{ color: "#1c0a0d" }}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <FieldInput icon={<IconLock />} placeholder="Senha * (mín. 6 caracteres)" type={showPw ? "text" : "password"} value={regPw} onChange={(v) => { setRegPw(v); setRegErrors((e) => ({ ...e, pw: "" })); }} error={regErrors.pw} right={<span onClick={() => setShowPw((p) => !p)}><IconEye open={showPw}/></span>}/>
                <FieldInput icon={<IconLock />} placeholder="Confirmar senha *" type={showPw2 ? "text" : "password"} value={regPw2} onChange={(v) => { setRegPw2(v); setRegErrors((e) => ({ ...e, pw2: "" })); }} error={regErrors.pw2} right={<span onClick={() => setShowPw2((p) => !p)}><IconEye open={showPw2}/></span>}/>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity mt-1" style={{ background: "#c9976e", color: "#fff" }}>
                Solicitar acesso
              </button>

              <p className="text-[11px] text-center leading-relaxed" style={{ color: "rgba(255,255,255,0.28)" }}>
                Ao criar sua conta você concorda com os termos de uso e a política de privacidade da Marmopedras.
              </p>
            </form>)}

          {mode === "register" && registered && (<div className="flex flex-col items-center gap-5 text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(201,151,110,0.15)", border: "2px solid #c9976e" }}>
                <IconCheck size={28}/>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ color: "#f5ede4" }}>Conta criada!</h2>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Seu acesso foi solicitado com sucesso.<br />
                  Redirecionando para o login…
                </p>
              </div>
              <div className="w-32 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full" style={{
                background: "#c9976e",
                animation: "progress 2.2s linear forwards",
                width: "0%",
            }}/>
              </div>
              <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
            </div>)}
        </div>
      </div>
    </div>);
}
