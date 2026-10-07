import { useState, useRef, useEffect } from "react";
import { api } from "../api";
import { IconWhatsApp, IconSend, IconCheck } from "../components/Icons";
const now = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
const FLUXO = {
    inicio: {
        bot: "Olá! 👋 Seja bem-vindo ao atendimento Marmopedras.\n\nSou o assistente virtual. Vou coletar algumas informações para direcionar você ao vendedor ideal. Podemos começar?\n\nQual é o seu nome completo?",
        next: "nome",
        tipo: "input",
    },
    nome: {
        bot: "",
        next: "localizacao",
        tipo: "input",
    },
    localizacao: {
        bot: "Prazer, {{nome}}! 😊\n\nQual é a sua cidade e bairro? Isso nos ajuda a identificar a loja e o vendedor mais próximos de você.",
        next: "tipoObra",
        tipo: "input",
    },
    tipoObra: {
        bot: "Entendido! Agora me conte: qual é o tipo da sua obra ou projeto?",
        next: "projetoMedidas",
        tipo: "opcoes",
        opcoes: ["🏠 Residencial — casa ou apartamento", "🏢 Comercial — loja, escritório ou hotel", "🔧 Reforma parcial", "🏗️ Obra nova", "Outro"],
    },
    projetoMedidas: {
        bot: "Ótimo! Para dimensionar melhor o material necessário, descreva brevemente o projeto e as medidas aproximadas da área a ser revestida (ex: \"cozinha 12m² + banheiro 6m²\").",
        next: "material",
        tipo: "input",
    },
    material: {
        bot: "Perfeito! Você já tem o material definido ou precisa de indicação?",
        next: "corEstilo",
        tipo: "opcoes",
        opcoes: ["✅ Sim, já sei qual material quero", "🔍 Preciso de indicação do especialista", "📋 Tenho algumas opções em mente"],
    },
    corEstilo: {
        bot: "Excelente! Quais são suas preferências de cor e estilo para os materiais?",
        next: "encaminhamento",
        tipo: "opcoes",
        opcoes: ["⬜ Neutros — branco, bege, cinza", "🟫 Tons naturais — pedra, mármore, madeira", "⬛ Escuros — preto, grafite, antracite", "🎨 Cores vibrantes", "Sem preferência"],
    },
    encaminhamento: {
        bot: "",
        next: "fim",
        tipo: "input",
    },
    fim: {
        bot: "",
        next: "fim",
        tipo: "input",
    },
};
const RESUMO_KEYS = ["nome", "localizacao", "tipoObra", "projetoMedidas", "material", "corEstilo"];
export default function ChatbotWhatsApp() {
    const [msgs, setMsgs] = useState([
        { from: "bot", text: FLUXO.inicio.bot, time: now() },
    ]);
    const [step, setStep] = useState("nome");
    const [input, setInput] = useState("");
    const [dados, setDados] = useState({});
    const [encaminhado, setEncaminhado] = useState(false);
    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [msgs]);
    const pushBot = (text) => {
        setMsgs((m) => [...m, { from: "bot", text, time: now() }]);
    };
    const pushUser = (text) => {
        setMsgs((m) => [...m, { from: "user", text, time: now() }]);
    };
    const advance = (userText, currentStep) => {
        const fluxo = FLUXO[currentStep];
        const newDados = { ...dados, [currentStep]: userText };
        setDados(newDados);
        const nextStep = fluxo.next;
        if (nextStep === "encaminhamento") {
            api("salvarLead", newDados).catch(() => { });
            // Build summary message
            setTimeout(() => {
                pushBot(`Perfeito! Aqui está o resumo do seu atendimento:\n\n` +
                    `👤 Nome: ${newDados.nome || "—"}\n` +
                    `📍 Localização: ${newDados.localizacao || "—"}\n` +
                    `🏗️ Tipo de obra: ${newDados.tipoObra || "—"}\n` +
                    `📐 Projeto/Medidas: ${newDados.projetoMedidas || "—"}\n` +
                    `🪨 Material: ${newDados.material || "—"}\n` +
                    `🎨 Cor/Estilo: ${newDados.corEstilo || "—"}\n\n` +
                    `Vou encaminhar você agora para um de nossos especialistas. Em instantes, um vendedor entrará em contato pelo WhatsApp!\n\n` +
                    `⏱️ Tempo estimado de resposta: até 5 minutos em horário comercial.`);
                setEncaminhado(true);
                setStep("fim");
            }, 800);
            return;
        }
        if (nextStep === "fim")
            return;
        // Build next bot message
        let botMsg = FLUXO[nextStep].bot;
        botMsg = botMsg.replace("{{nome}}", newDados.nome || "");
        if (botMsg) {
            setTimeout(() => {
                pushBot(botMsg);
                setStep(nextStep);
            }, 600);
        }
        else {
            setStep(nextStep);
        }
    };
    const handleSend = (text) => {
        const value = (text ?? input).trim();
        if (!value || encaminhado)
            return;
        pushUser(value);
        setInput("");
        advance(value, step);
    };
    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    const currentOpcoes = step !== "fim" && step !== "encaminhamento" ? FLUXO[step]?.opcoes : undefined;
    const showInput = !encaminhado && step !== "fim";
    return (<div className="page-scroll flex-1 flex flex-col overflow-hidden px-8 py-7 gap-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#25D366", color: "#fff" }}>
          <IconWhatsApp size={20}/>
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1c0a0d" }}>Chatbot WhatsApp</h1>
          <p className="text-sm" style={{ color: "#7a5c60" }}>Fluxo de pré-atendimento ao cliente</p>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0 chat-layout">
        {/* Chat window */}
        <div className="flex-1 flex flex-col rounded-2xl overflow-hidden min-h-0" style={{ background: "rgba(255,252,248,0.7)", border: "1px solid rgba(255,250,244,0.9)", boxShadow: "0 2px 20px rgba(92,26,34,0.06)" }}>
          {/* Chat top bar */}
          <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0" style={{ background: "#5c1a22", color: "#fff" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#25D366" }}>
              <IconWhatsApp size={18}/>
            </div>
            <div>
              <div className="text-sm font-semibold">Marmopedras Atendimento</div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#4ade80" }}/>
                Online agora
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3" style={{ background: "rgba(245,240,235,0.4)" }}>
            {msgs.map((msg, i) => (<div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                {msg.from === "bot" && (<div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-auto" style={{ background: "#5c1a22" }}>
                    <IconWhatsApp size={13}/>
                  </div>)}
                <div className="max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed" style={msg.from === "bot"
                ? { background: "#fff", color: "#1c0a0d", borderBottomLeftRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", whiteSpace: "pre-line" }
                : { background: "#5c1a22", color: "#fff", borderBottomRightRadius: "4px" }}>
                  {msg.text}
                  <div className="flex items-center justify-end gap-1 mt-1" style={{ opacity: 0.5, fontSize: "10px" }}>
                    {msg.time}
                    {msg.from === "user" && <IconCheck size={10}/>}
                  </div>
                </div>
              </div>))}

            {/* Options */}
            {showInput && currentOpcoes && (<div className="flex flex-wrap gap-2 mt-1 justify-start pl-9">
                {currentOpcoes.map((op) => (<button key={op} onClick={() => handleSend(op)} className="px-3 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-80" style={{ background: "rgba(92,26,34,0.07)", color: "#5c1a22", border: "1px solid rgba(92,26,34,0.15)" }}>
                    {op}
                  </button>))}
              </div>)}

            {/* Encaminhado */}
            {encaminhado && (<div className="flex justify-center mt-2">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold" style={{ background: "#d1fae5", color: "#065f46" }}>
                  <IconCheck size={13}/>
                  Encaminhado para atendimento humano
                </div>
              </div>)}

            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          {showInput && (<div className="flex items-end gap-3 px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(201,151,110,0.12)", background: "rgba(255,252,248,0.9)" }}>
              <textarea rows={1} placeholder="Digite sua mensagem…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: "rgba(255,252,248,0.8)", border: "1px solid rgba(92,26,34,0.12)", color: "#1c0a0d", maxHeight: "96px" }}/>
              <button onClick={() => handleSend()} className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity" style={{ background: "#5c1a22", color: "#fff" }}>
                <IconSend size={16}/>
              </button>
            </div>)}
        </div>

        {/* Side info */}
        <div className="chat-side w-64 flex-shrink-0 flex flex-col gap-4">
          {/* Fluxo */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,252,248,0.7)", border: "1px solid rgba(255,250,244,0.9)", boxShadow: "0 2px 20px rgba(92,26,34,0.06)" }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#5c1a22" }}>
              Etapas do Fluxo
            </div>
            <ol className="flex flex-col gap-3">
              {[
            { key: "nome", label: "Nome completo" },
            { key: "localizacao", label: "Cidade / bairro" },
            { key: "tipoObra", label: "Tipo de obra" },
            { key: "projetoMedidas", label: "Projeto e medidas" },
            { key: "material", label: "Material definido" },
            { key: "corEstilo", label: "Cor e estilo" },
            { key: "encaminhamento", label: "Encaminhamento" },
        ].map((etapa, i) => {
            const done = RESUMO_KEYS.includes(etapa.key) && !!dados[etapa.key];
            const isEnc = etapa.key === "encaminhamento" && encaminhado;
            return (<li key={etapa.key} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={done || isEnc
                    ? { background: "#5c1a22", color: "#fff" }
                    : { background: "rgba(92,26,34,0.08)", color: "#9b7e82" }}>
                      {done || isEnc ? <IconCheck size={10}/> : i + 1}
                    </div>
                    <span className="text-xs" style={{ color: done || isEnc ? "#1c0a0d" : "#9b7e82", fontWeight: done || isEnc ? 500 : 400 }}>
                      {etapa.label}
                    </span>
                  </li>);
        })}
            </ol>
          </div>

          {/* Dados coletados */}
          {Object.keys(dados).length > 0 && (<div className="rounded-2xl p-5" style={{ background: "rgba(255,252,248,0.7)", border: "1px solid rgba(255,250,244,0.9)", boxShadow: "0 2px 20px rgba(92,26,34,0.06)" }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#5c1a22" }}>
                Dados Coletados
              </div>
              <div className="flex flex-col gap-2">
                {RESUMO_KEYS.filter((k) => dados[k]).map((k) => (<div key={k}>
                    <div className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: "#9b7e82" }}>
                      {k === "nome" ? "Nome" : k === "localizacao" ? "Localização" : k === "tipoObra" ? "Tipo de obra" : k === "projetoMedidas" ? "Projeto" : k === "material" ? "Material" : "Cor/Estilo"}
                    </div>
                    <div className="text-xs font-medium leading-snug" style={{ color: "#1c0a0d" }}>{dados[k]}</div>
                  </div>))}
              </div>
            </div>)}

          {/* Restart */}
          <button onClick={() => {
            setMsgs([{ from: "bot", text: FLUXO.inicio.bot, time: now() }]);
            setStep("nome");
            setInput("");
            setDados({});
            setEncaminhado(false);
        }} className="w-full py-2.5 rounded-xl text-xs font-semibold hover:opacity-80 transition-opacity" style={{ background: "rgba(92,26,34,0.07)", color: "#5c1a22", border: "1px solid rgba(92,26,34,0.1)" }}>
            Reiniciar simulação
          </button>
        </div>
      </div>
    </div>);
}
