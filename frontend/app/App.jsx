"use client";

import { useState, useEffect } from "react";
import { api } from "./api";
// Pages
import Auth from "./pages/Auth";
import PesquisarMateriais from "./pages/PesquisarMateriais";
import RegistrarEntrada from "./pages/RegistrarEntrada";
import RegistrarSaida from "./pages/RegistrarSaida";
import Transferencia from "./pages/Transferencia";
import DistribuicaoEstoque from "./pages/DistribuicaoEstoque";
import HistoricoMovimentacoes from "./pages/HistoricoMovimentacoes";
import ChatbotWhatsApp from "./pages/ChatbotWhatsApp";
import { fmtCodigo, descMov } from "./constants";
// ── Icons ─────────────────────────────────────────────────────────────
const IconBox = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>);
const IconSearch = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>);
const IconDown = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 5v14M5 12l7 7 7-7"/>
  </svg>);
const IconUp = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 19V5M5 12l7-7 7 7"/>
  </svg>);
const IconTransfer = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M17 2l4 4-4 4M3 11V7a4 4 0 0 1 4-4h11M7 22l-4-4 4-4M21 13v4a4 4 0 0 1-4 4H6"/>
  </svg>);
const IconDistrib = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>);
const IconHistory = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>);
const IconWhatsApp = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>);
const IconLogout = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>);
const IconBell = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>);
const IconUser = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>);
const IconAlert = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>);
const IconFlash = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
  </svg>);
const IconChevron = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6"/>
  </svg>);
const IconList = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>);
const IconMenu = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>);
const IconX = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>);
const navItems = [
    { id: "painel", label: "Painel Geral", icon: <IconBox />, section: "ESTOQUE" },
    { id: "pesquisar", label: "Pesquisar Materiais", icon: <IconSearch /> },
    { id: "entrada", label: "Registrar Entrada", icon: <IconDown /> },
    { id: "saida", label: "Registrar Saída", icon: <IconUp /> },
    { id: "transferencia", label: "Transferência / Local.", icon: <IconTransfer /> },
    { id: "distribuicao", label: "Distribuição no Estoque", icon: <IconDistrib /> },
    { id: "historico", label: "Histórico de Movimentações", icon: <IconHistory /> },
    { id: "chatbot", label: "Chatbot WhatsApp", icon: <IconWhatsApp />, section: "ATENDIMENTO" },
];
// ── Static data ────────────────────────────────────────────────────────
const MARBLE_HERO = "https://images.unsplash.com/photo-1770065805058-3bfed55e23ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";
const MARBLE_SMALL = "https://images.unsplash.com/photo-1558346648-9757f2fa4474?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400";
const tipoBadge = (tipo) => {
    if (tipo === "Entrada")
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" style={{ background: "#d1fae5", color: "#065f46" }}>Entrada</span>;
    if (tipo === "Saída")
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" style={{ background: "#fee2e2", color: "#991b1b" }}>Saída</span>;
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" style={{ background: "#f3f4f6", color: "#374151" }}>Transfer.</span>;
};
// ── Sidebar nav list (shared between desktop aside + mobile drawer) ────
const iniciais = (n) => (n || "?").split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("");
function NavList({ activeNav, setActiveNav, onSelect, onLogout, user, }) {
    const handle = (id) => { setActiveNav(id); onSelect?.(); };
    return (<>
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 flex items-center justify-center rounded flex-shrink-0" style={{ background: "rgba(255,255,255,0.12)" }}>
            <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
              <path d="M4 30V8l10 14L24 8v22" stroke="#c9976e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M24 8l8 4v18" stroke="#c9976e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <div>
            <div className="text-base font-bold tracking-wide leading-tight" style={{ color: "#f0e4d4" }}>Marmopedras</div>
            <div className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>Pedras que constroem histórias</div>
          </div>
        </div>
        <div className="mt-4 text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
          powered by <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 700 }}>NEXT</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
        {navItems.map((item) => (<div key={item.id}>
            {item.section && (<div className="text-[10px] tracking-widest uppercase font-semibold px-3 mt-5 mb-2" style={{ color: "rgba(255,255,255,0.38)" }}>
                {item.section}
              </div>)}
            <button onClick={() => handle(item.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 text-left" style={activeNav === item.id
                ? { background: "rgba(255,255,255,0.12)", color: "#f0e4d4", borderLeft: "3px solid #c9976e", paddingLeft: "9px" }
                : { color: "rgba(255,255,255,0.65)" }}>
              <span style={{ opacity: activeNav === item.id ? 1 : 0.7, flexShrink: 0 }}>{item.icon}</span>
              <span className={activeNav === item.id ? "font-medium" : ""}>{item.label}</span>
            </button>
          </div>))}
      </nav>

      {/* User */}
      <div className="px-4 py-5 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "#c9976e", color: "#fff" }}>
{iniciais(user?.nome)}
          </div>
          <div>
            <div className="text-sm font-medium" style={{ color: "#f0e4d4" }}>{user?.nome}</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{user?.cargo || "Funcionário"}</div>
          </div>
        </div>
        <button className="flex items-center gap-2 text-xs w-full hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.5)" }} onClick={onLogout}>
          <IconLogout />
          Sair do sistema
        </button>
      </div>
    </>);
}
// ── Painel Geral ───────────────────────────────────────────────────────
function PainelGeral({ navigate }) {
    const [dados, setDados] = useState(null);
    useEffect(() => {
        api("painel").then(setDados).catch(() => { });
    }, []);
    const c = dados?.cards || {};
    const movements = dados?.ultimasMovimentacoes || [];
    const statCards = [
        { icon: <IconBox />, label: "TOTAL DE SKUS", value: String(c.totalSkus ?? "—"), sub: "materiais cadastrados", color: "#5c1a22", alert: false },
        { icon: <IconDown />, label: "ENTRADAS HOJE", value: String(c.entradasHoje ?? "—"), sub: "registradas hoje", color: "#5c1a22", alert: false },
        { icon: <IconUp />, label: "SAÍDAS HOJE", value: String(c.saidasHoje ?? "—"), sub: `para ${c.obrasHoje ?? 0} obras distintas`, color: "#5c1a22", alert: false },
        { icon: <IconAlert />, label: "SALDO BAIXO", value: String(c.saldoBaixo ?? "—"), sub: "abaixo do mínimo", color: "#c0392b", alert: true },
    ];
    const acoes = [
        { label: "Registrar Entrada", icon: <IconDown />, id: "entrada", active: true },
        { label: "Registrar Saída", icon: <IconUp />, id: "saida", active: false },
        { label: "Pesquisar Material", icon: <IconSearch />, id: "pesquisar", active: false },
        { label: "Transferência", icon: <IconTransfer />, id: "transferencia", active: false },
    ];
    return (<>
      {/* ── Desktop header with marble bg ── */}
      <header className="painel-header-desktop relative items-end justify-between overflow-hidden" style={{ minHeight: "140px" }}>
        <div className="absolute right-0 top-0 h-full" style={{
            width: "55%",
            backgroundImage: `url(${MARBLE_HERO})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 30%, #000 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 30%, #000 100%)",
        }}/>
        <div className="absolute inset-0" style={{ background: "#f5f0eb", zIndex: -1 }}/>
        <div className="relative z-10 px-8 pb-6 pt-8">
          <h1 className="text-3xl font-bold mb-1" style={{ color: "#1c0a0d" }}>Painel Geral</h1>
          <p className="text-sm" style={{ color: "#7a5c60" }}>Resumo das movimentações do dia</p>
        </div>
        <div className="relative z-10 flex flex-col items-end px-8 pb-4 pt-4 gap-3">
          <div className="text-right text-xs font-bold tracking-widest uppercase leading-relaxed" style={{ color: "#c9976e" }}>
            Qualidade<br /><span style={{ color: "#5c1a22" }}>em cada</span><br />Detalhe
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: "#1c0a0d" }}>11/09/2026</span>
            <span style={{ color: "#999" }}>|</span>
            <span className="text-sm font-medium" style={{ color: "#1c0a0d" }}>14:30</span>
            <span style={{ color: "#999" }}>|</span>
            <button style={{ color: "#5c1a22" }}><IconBell /></button>
            <span style={{ color: "#999" }}>|</span>
            <button className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: "#ccc", color: "#5c1a22" }}>
              <IconUser />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile header (simple) ── */}
      <div className="painel-header-mobile px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold" style={{ color: "#1c0a0d" }}>Painel Geral</h1>
        <p className="text-xs mt-0.5" style={{ color: "#7a5c60" }}>Resumo das movimentações do dia</p>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto painel-content-padding painel-content-flex">

        {/* Left column */}
        <div className="painel-left flex flex-col gap-5">

          {/* Stat cards — 2 col on mobile, 4 col on desktop */}
          <div className="painel-stat-grid">
            {statCards.map((card) => (<div key={card.label} className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "#fff" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.alert ? "#fee2e2" : "#f5f0eb", color: card.color }}>
                  {card.icon}
                </div>
                <div>
                  <div className="text-[10px] font-semibold tracking-widest uppercase mb-1" style={{ color: card.alert ? "#c0392b" : "#9b7e82" }}>
                    {card.label}
                  </div>
                  <div className="painel-stat-value font-bold leading-none mb-1" style={{ color: card.alert ? "#c0392b" : "#1c0a0d" }}>
                    {card.value}
                  </div>
                  <div className="text-xs" style={{ color: "#9b7e82" }}>{card.sub}</div>
                </div>
              </div>))}
          </div>

          {/* Movimentações */}
          <div className="rounded-2xl" style={{ background: "#fff" }}>
            <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: "#f5f0eb" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#f5f0eb", color: "#5c1a22" }}>
                  <IconList />
                </div>
                <h2 className="text-base font-bold" style={{ color: "#1c0a0d" }}>Últimas Movimentações</h2>
              </div>
              <button className="text-xs" style={{ color: "#5c1a22" }} onClick={() => navigate("historico")}>
                Ver todos →
              </button>
            </div>

            {/* Desktop table */}
            <div className="painel-mov-table">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #f5f0eb" }}>
                    {["HORA", "TIPO", "CÓD.", "MATERIAL", "QTD."].map((h) => (<th key={h} className="text-left px-6 py-3 text-[11px] font-semibold tracking-widest" style={{ color: "#9b7e82" }}>{h}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {movements.map((row, i) => (<tr key={i} style={{ borderBottom: i < movements.length - 1 ? "1px solid #f9f6f3" : "none" }}>
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: "#4a3338" }}>{row.hora}</td>
                      <td className="px-6 py-4">{tipoBadge(row.tipo)}</td>
                      <td className="px-6 py-4 text-xs font-mono font-semibold" style={{ color: "#5c1a22" }}>{fmtCodigo(row.codigo ?? row.cod)}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: "#1c0a0d" }}>
                        {row.material}
                        {descMov(row) && <div className="text-[11px]" style={{ color: "#9b7e82" }}>{descMov(row)}</div>}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-medium" style={{ color: "#9b7e82" }}>{row.qtd}</td>
                    </tr>))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="painel-mov-cards flex flex-col">
              {movements.map((row, i) => (<div key={i} className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: i < movements.length - 1 ? "1px solid #f9f6f3" : "none" }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-semibold tabular-nums flex-shrink-0" style={{ color: "#5c1a22" }}>{row.hora}</span>
                    {tipoBadge(row.tipo)}
                    <span className="text-xs truncate" style={{ color: "#1c0a0d" }}><span className="font-mono font-semibold" style={{ color: "#5c1a22" }}>{fmtCodigo(row.codigo ?? row.cod)}</span> · {row.material}</span>
                  </div>
                  <span className="text-xs font-semibold flex-shrink-0" style={{ color: "#9b7e82" }}>{row.qtd}</span>
                </div>))}
            </div>
          </div>

          {/* Quote */}
          <div className="flex items-start gap-3">
            <div className="w-1 rounded-full flex-shrink-0 mt-1" style={{ background: "#c9976e", height: "36px" }}/>
            <div>
              <p className="text-sm italic" style={{ color: "#5c1a22" }}>"Mais que pedras, soluções para grandes projetos."</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: "#9b7e82" }}>Marmopedras</p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="painel-right flex flex-col gap-4">
          {/* Ações Rápidas */}
          <div className="rounded-2xl p-5" style={{ background: "#fff" }}>
            <div className="flex items-center gap-2 mb-4">
              <span style={{ color: "#c9976e" }}><IconFlash /></span>
              <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "#5c1a22" }}>Ações Rápidas</span>
            </div>
            <div className="painel-acoes-grid">
              {acoes.map((action) => (<button key={action.label} onClick={() => navigate(action.id)} className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90" style={action.active
                ? { background: "#5c1a22", color: "#fff" }
                : { background: "transparent", color: "#1c0a0d", border: "1px solid #ede8e3" }}>
                  <div className="flex items-center gap-3">{action.icon}{action.label}</div>
                  <IconChevron />
                </button>))}
            </div>
          </div>

          {/* Materiais Críticos */}
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "#fff" }}>
            <div className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-2xl overflow-hidden" style={{ backgroundImage: `url(${MARBLE_SMALL})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.35 }}/>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span style={{ color: "#c0392b" }}><IconAlert /></span>
                <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "#c0392b" }}>Materiais Críticos</span>
              </div>
              <ul className="painel-criticos-grid gap-2 mb-4">
                {(dados?.criticos || []).map((m) => (<li key={typeof m === "string" ? m : (m.cod ?? m.codigo ?? m.nome)} className="flex items-center gap-2 text-sm" style={{ color: "#1c0a0d" }}>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#c0392b" }}/>
                    {typeof m === "string" ? m : `${fmtCodigo(m.cod ?? m.codigo)} · ${m.nome}`}
                  </li>))}
              </ul>
              <button className="text-sm font-medium" style={{ color: "#5c1a22" }} onClick={() => navigate("pesquisar")}>
                Ver todos →
              </button>
            </div>
          </div>

          <div className="text-right text-xs" style={{ color: "#9b7e82" }}>
            Powered by <strong>NEXT</strong> /
          </div>
        </div>
      </div>
    </>);
}
// ── Page title map ─────────────────────────────────────────────────────
const pageTitles = {
    pesquisar: { title: "Pesquisar Materiais", sub: "Consulte e filtre materiais do estoque" },
    entrada: { title: "Registrar Entrada", sub: "Adicione materiais ao estoque" },
    saida: { title: "Registrar Saída", sub: "Retire materiais para obras e projetos" },
    transferencia: { title: "Transferência / Local.", sub: "Mova materiais entre depósitos" },
    distribuicao: { title: "Distribuição no Estoque", sub: "Visão geral dos depósitos" },
    historico: { title: "Histórico de Movimentações", sub: "Registro completo de movimentações" },
    chatbot: { title: "Chatbot WhatsApp", sub: "Simulação do fluxo de pré-atendimento" },
};
// ── App ────────────────────────────────────────────────────────────────
export default function App() {
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);
    const [activeNav, setActiveNav] = useState("painel");
    const [drawerOpen, setDrawerOpen] = useState(false);
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            setChecking(false);
            return;
        }
        api("me").then(setUser).catch(() => localStorage.removeItem("token")).finally(() => setChecking(false));
    }, []);
    if (checking)
        return null;
    if (!user)
        return <Auth onAuth={setUser}/>;
    const navigate = (id) => setActiveNav(id);
    const logout = () => { localStorage.removeItem("token"); setUser(null); setActiveNav("painel"); };
    return (<div className="flex h-screen overflow-hidden font-sans" style={{ background: "#f5f0eb" }}>

      {/* ══ Desktop sidebar (hidden on mobile) ══ */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 h-full overflow-y-auto" style={{ background: "#5c1a22", color: "#fff" }}>
        <NavList activeNav={activeNav} setActiveNav={navigate} onLogout={logout} user={user}/>
      </aside>

      {/* ══ Mobile drawer overlay ══ */}
      {drawerOpen && (<div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div className="absolute inset-0" style={{ background: "rgba(28,10,13,0.55)", backdropFilter: "blur(2px)" }} onClick={() => setDrawerOpen(false)}/>
          {/* Drawer */}
          <div className="relative z-50 flex flex-col w-72 h-full overflow-hidden" style={{ background: "#5c1a22", color: "#fff", boxShadow: "4px 0 32px rgba(0,0,0,0.35)" }}>
            {/* Close button */}
            <button onClick={() => setDrawerOpen(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}>
              <IconX />
            </button>
            <NavList activeNav={activeNav} setActiveNav={navigate} onSelect={() => setDrawerOpen(false)} onLogout={logout} user={user}/>
          </div>
        </div>)}

      {/* ══ Main ══ */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ background: "#5c1a22" }}>
          <button onClick={() => setDrawerOpen(true)} className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}>
            <IconMenu />
          </button>

          {/* Logo center */}
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
              <path d="M4 30V8l10 14L24 8v22" stroke="#c9976e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M24 8l8 4v18" stroke="#c9976e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span className="text-sm font-bold" style={{ color: "#f0e4d4" }}>Marmopedras</span>
          </div>

          <div className="flex items-center gap-2">
            <button style={{ color: "rgba(255,255,255,0.7)" }}><IconBell /></button>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#c9976e", color: "#fff" }}>
{iniciais(user?.nome)}
            </div>
          </div>
        </div>

        {/* Non-painel top bar (desktop only shows date; mobile just shows title) */}
        {activeNav !== "painel" && (<header className="flex items-center justify-between px-4 lg:px-8 pt-4 lg:pt-7 pb-3 lg:pb-5 flex-shrink-0">
            <div>
              <h1 className="text-lg lg:text-2xl font-bold mb-0.5" style={{ color: "#1c0a0d" }}>
                {pageTitles[activeNav]?.title}
              </h1>
              <p className="text-xs lg:text-sm" style={{ color: "#7a5c60" }}>
                {pageTitles[activeNav]?.sub}
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-sm font-medium" style={{ color: "#4a3338" }}>11/09/2026</span>
              <span style={{ color: "#c4b5b8" }}>|</span>
              <span className="text-sm font-medium" style={{ color: "#4a3338" }}>14:30</span>
              <span style={{ color: "#c4b5b8" }}>|</span>
              <button style={{ color: "#5c1a22" }}><IconBell /></button>
              <span style={{ color: "#c4b5b8" }}>|</span>
              <button className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: "#d8cfc9", color: "#5c1a22" }}>
                <IconUser />
              </button>
            </div>
          </header>)}

        {/* Page content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {activeNav === "painel" && <PainelGeral navigate={navigate}/>}
          {activeNav === "pesquisar" && <PesquisarMateriais />}
          {activeNav === "entrada" && <RegistrarEntrada />}
          {activeNav === "saida" && <RegistrarSaida />}
          {activeNav === "transferencia" && <Transferencia />}
          {activeNav === "distribuicao" && <DistribuicaoEstoque />}
          {activeNav === "historico" && <HistoricoMovimentacoes />}
          {activeNav === "chatbot" && <ChatbotWhatsApp />}
        </div>
      </main>
    </div>);
}
