import { useState } from "react";
import { api } from "../api";
import { IconCheck } from "../components/Icons";

const MARBLE =
  "https://images.unsplash.com/photo-1770065805058-3bfed55e23ee?auto=format&fit=crop&w=1800&q=90";

const colors = {
  wine: "#591c29",
  wineDark: "#350c18",
  wineSoft: "#782f3c",
  gold: "#b68a68",
};
function LogoM({ size = 58 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="mpLogoLeft" gradientUnits="userSpaceOnUse" x1="8" y1="10" x2="32" y2="54">
          <stop offset="0" stopColor="#3a0b17" />
          <stop offset="1" stopColor="#6e2535" />
        </linearGradient>

        <linearGradient id="mpLogoRight" gradientUnits="userSpaceOnUse" x1="56" y1="10" x2="40" y2="54">
          <stop offset="0" stopColor="#8b3a48" />
          <stop offset=".55" stopColor="#a8606a" />
          <stop offset="1" stopColor="#c79c74" />
        </linearGradient>
      </defs>

      <polygon
        points="8,54 8,10 18,10 32,32 32,47 18,25 18,54"
        fill="url(#mpLogoLeft)" stroke="url(#mpLogoLeft)"
        strokeWidth="1.2" strokeLinejoin="round"
      />
      <polygon
        points="56,54 56,10 46,10 32,32 32,47 46,25 46,54"
        fill="url(#mpLogoRight)" stroke="url(#mpLogoRight)"
        strokeWidth="1.2" strokeLinejoin="round"
      />
      <polygon points="32,32 32,47 39,36" fill="#2a0711" opacity=".28" />
    </svg>
  );
}


function Icon({ name, size = 20 }) {
  const paths = {
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
      </>
    ),
    phone: (
      <path d="M21 16.5v3a2 2 0 0 1-2.2 2A18 18 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h3a2 2 0 0 1 2 1.7l.5 2.6a2 2 0 0 1-.6 1.8L8 10.5a14 14 0 0 0 5.5 5.5l1.4-1.4a2 2 0 0 1 1.8-.6l2.6.5a2 2 0 0 1 1.7 2Z" />
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    eyeOff: (
      <>
        <path d="M3 3 21 21" />
        <path d="M10.5 6.2A10.8 10.8 0 0 1 12 6c6.5 0 10 6 10 6s-1.2 2.1-3.2 3.6M6.5 7.7C3.6 9.3 2 12 2 12s3.5 6 10 6a11 11 0 0 0 4.1-.8" />
      </>
    ),
    box: (
      <>
        <path d="m12 2 9 5-9 5-9-5 9-5Z" />
        <path d="M3 7v10l9 5 9-5V7M12 12v10" />
      </>
    ),
    list: (
      <>
        <path d="M9 5h12M9 12h12M9 19h12" />
        <circle cx="4" cy="5" r="1" />
        <circle cx="4" cy="12" r="1" />
        <circle cx="4" cy="19" r="1" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    transfer: (
      <>
        <path d="M4 7h16M16 3l4 4-4 4" />
        <path d="M20 17H4M8 13l-4 4 4 4" />
      </>
    ),
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="mp-feature">
      <div className="mp-feature-icon">
        <Icon name={icon} size={23} />
      </div>

      <div className="mp-feature-text">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function Field({
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  right,
  autoComplete,
}) {
  return (
    <div className="mp-field-group">
      <div className={`mp-field ${error ? "mp-field-error" : ""}`}>
        <span className="mp-field-icon">
          <Icon name={icon} size={19} />
        </span>

        <input
          type={type}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />

        {right && <div className="mp-field-right">{right}</div>}
      </div>

      {error && <p className="mp-error">{error}</p>}
    </div>
  );
}

function EyeButton({ visible, onClick }) {
  const label = visible ? "Ocultar senha" : "Mostrar senha";

  return (
    <button
      type="button"
      className="mp-eye"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={visible}
    >
      <Icon name={visible ? "eye" : "eyeOff"} size={19} />
    </button>
  );
}

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");

  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const cargos = [
    "Funcionário",
    "Gerente de Estoque",
    "Vendedor",
    "Administrador",
    "Outro",
  ];

  const validateLogin = () => {
    const errors = {};

    if (!loginEmail.trim()) {
      errors.email = "Informe o e-mail";
    } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      errors.email = "E-mail inválido";
    }

    if (!loginPw) {
      errors.pw = "Informe a senha";
    } else if (loginPw.length < 6) {
      errors.pw = "Mínimo 6 caracteres";
    }

    return errors;
  };

  const validateRegister = () => {
    const errors = {};

    if (!regNome.trim()) {
      errors.nome = "Informe seu nome completo";
    }

    if (!regEmail.trim()) {
      errors.email = "Informe o e-mail";
    } else if (!/\S+@\S+\.\S+/.test(regEmail)) {
      errors.email = "E-mail inválido";
    }

    if (!regTel.trim()) {
      errors.tel = "Informe o telefone";
    }

    if (!regPw) {
      errors.pw = "Informe a senha";
    } else if (regPw.length < 6) {
      errors.pw = "Mínimo 6 caracteres";
    }

    if (regPw !== regPw2) {
      errors.pw2 = "As senhas não coincidem";
    }

    return errors;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loading) return;

    const errors = validateLogin();

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const { token, usuario } = await api("login", {
        email: loginEmail,
        senha: loginPw,
      });

      localStorage.setItem("token", token);
      onAuth(usuario);
    } catch (error) {
      setLoginErrors({
        pw: error.message || "Falha ao entrar",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (loading) return;

    const errors = validateRegister();

    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await api("register", {
        nome: regNome,
        email: regEmail,
        telefone: regTel,
        cargo: regCargo,
        senha: regPw,
      });
    } catch (error) {
      const campos = error.campos || {};

      setRegErrors(
        error.campos
          ? {
              nome: campos.nome,
              email: campos.email,
              tel: campos.telefone,
              pw: campos.senha,
            }
          : {
              email: error.message || "Erro ao cadastrar",
            }
      );

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

  const changeMode = (nextMode) => {
    if (loading) return;

    setMode(nextMode);
    setLoginErrors({});
    setRegErrors({});
    setRegistered(false);
  };

  return (
    <main className="mp-auth">
      <style>{`
        .mp-auth {
          --mp-wine: ${colors.wine};
          --mp-wine-dark: ${colors.wineDark};
          --mp-wine-soft: ${colors.wineSoft};
          --mp-gold: ${colors.gold};

          position: relative;
          display: grid;
          grid-template-columns: 57% 43%;
          min-height: 100vh;
          min-height: 100dvh;
          overflow: hidden;
          isolation: isolate;
          background:
            linear-gradient(
              rgba(255, 250, 244, .34),
              rgba(255, 250, 244, .2)
            ),
            url("${MARBLE}") center / cover;
          background-color: #efe6db;
          color: #281b1d;
          font-family: Arial, Helvetica, sans-serif;
        }

        .mp-auth,
        .mp-auth * {
          box-sizing: border-box;
        }

        /* ---------- Palco de pedras (fundo) ---------- */

        .mp-stage {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .mp-slab {
          position: absolute;
          inset: 0;
        }

        .mp-slab > i {
          position: absolute;
          inset: 0;
          display: block;
        }

        /* Laje vinho (fundo direito) */
        .mp-slab-wine > i {
          clip-path: polygon(64% 0, 100% 0, 100% 100%, 64% 100%);
          background:
            linear-gradient(
              150deg,
              rgba(92, 22, 38, .84),
              rgba(48, 9, 20, .9)
            ),
            url("${MARBLE}") 85% 20% / 150% auto;
        }

        /* Laje cinza / marrom (centro) */
        .mp-slab-stone {
          filter:
            drop-shadow(-2px 0 0 rgba(255, 247, 232, .55))
            drop-shadow(-18px 10px 26px rgba(24, 10, 12, .28));
        }

        .mp-slab-stone > i {
          clip-path: polygon(
            66% 0,
            88% 0,
            88% 100%,
            51% 100%,
            51% 12%
          );
          background:
            linear-gradient(
              135deg,
              rgba(70, 56, 48, .38),
              rgba(120, 104, 92, .2)
            ),
            url("${MARBLE}") 62% 40% / 170% auto;
          filter: grayscale(.55) sepia(.3) brightness(.78) contrast(1.15);
        }

        /* Lajes claras (base) */
        .mp-slab-light-back {
          filter:
            drop-shadow(0 -2px 0 rgba(255, 249, 238, .7))
            drop-shadow(0 -14px 24px rgba(30, 12, 14, .22));
        }

        .mp-slab-light-back > i {
          clip-path: polygon(
            27% 100%,
            74% 69%,
            100% 76%,
            100% 100%
          );
          background:
            linear-gradient(
              rgba(255, 251, 244, .14),
              rgba(214, 196, 178, .18)
            ),
            url("${MARBLE}") 10% 90% / 140% auto;
          filter: sepia(.2) saturate(.7) brightness(.96);
        }

        .mp-slab-light-front {
          filter:
            drop-shadow(0 -2px 0 rgba(255, 250, 240, .85))
            drop-shadow(0 -10px 20px rgba(30, 12, 14, .2));
        }

        .mp-slab-light-front > i {
          clip-path: polygon(
            40% 100%,
            68% 85%,
            100% 90%,
            100% 100%
          );
          background:
            linear-gradient(
              rgba(255, 252, 246, .2),
              rgba(230, 214, 198, .16)
            ),
            url("${MARBLE}") 70% 100% / 130% auto;
          filter: sepia(.15) saturate(.75) brightness(1.08);
        }

        /* Frisos de luz na laje vinho */
        .mp-glow {
          position: absolute;
          top: 0;
          width: 3px;
          background: linear-gradient(
            to bottom,
            rgba(255, 233, 205, .1),
            rgba(238, 196, 156, .95) 35%,
            rgba(210, 150, 110, .55) 80%,
            transparent
          );
          box-shadow: 0 0 16px rgba(228, 172, 128, .55);
        }

        .mp-glow-one {
          left: 87.4%;
          height: 74%;
        }

        .mp-glow-two {
          left: 98.4%;
          height: 66%;
          opacity: .75;
        }

        /* Véu claro sobre o lado esquerdo */
        .mp-auth::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            linear-gradient(
              100deg,
              rgba(255, 251, 246, .66) 0%,
              rgba(255, 251, 246, .42) 42%,
              rgba(255, 251, 246, 0) 62%
            );
        }

        /* ---------- Coluna esquerda ---------- */

        .mp-left {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
          min-height: 100vh;
          min-height: 100dvh;
          padding: clamp(34px, 4.4vw, 64px)
                   clamp(40px, 6.5vw, 108px)
                   clamp(28px, 3.4vw, 46px)
                   clamp(40px, 8.4vw, 120px);
        }

        .mp-brand {
          width: fit-content;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-left: clamp(30px, 7.4vw, 108px);
        }

        .mp-brand-name {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(28px, 2.5vw, 38px);
          line-height: 1.05;
          letter-spacing: -.035em;
          color: var(--mp-wine-dark);
          font-weight: 400;
          margin-top: 2px;
        }

        .mp-brand-tag {
          margin-top: 9px;
          color: #5f4c4e;
          font-size: 8.5px;
          font-weight: 600;
          letter-spacing: .2em;
          white-space: nowrap;
        }

        .mp-brand-powered {
          margin-top: 13px;
          font-size: 11px;
          color: #8d807e;
        }

        .mp-brand-powered strong {
          color: #37282a;
          font-weight: 800;
          letter-spacing: .08em;
        }

        .mp-intro {
          max-width: 640px;
          margin: 28px 0 30px;
        }

        .mp-short-line {
          display: block;
          width: 54px;
          height: 2px;
          background: linear-gradient(to right, #823b47, #d4b28d);
          margin-bottom: 26px;
        }

        .mp-heading {
          color: #2c1319;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          font-size: clamp(36px, 3.15vw, 50px);
          letter-spacing: -.035em;
          line-height: 1.07;
          margin: 0;
        }

        .mp-description {
          max-width: 480px;
          margin: 18px 0 0;
          font-size: clamp(14px, 1.18vw, 17px);
          color: #5c524f;
          line-height: 1.55;
        }

        .mp-features {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 26px;
          max-width: 560px;
        }

        .mp-feature {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
          min-height: 86px;
          padding: 14px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, .72);
          background: rgba(255, 255, 255, .5);
          box-shadow: 0 8px 26px rgba(74, 53, 42, .07);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .mp-feature-icon {
          flex: 0 0 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(226, 208, 195, .85);
          color: #6a2833;
        }

        .mp-feature-text {
          min-width: 0;
        }

        .mp-feature h3 {
          font-size: 13px;
          color: #2a2123;
          font-weight: 700;
          line-height: 1.35;
          margin: 0 0 3px;
        }

        .mp-feature p {
          font-size: 11.5px;
          line-height: 1.4;
          color: #6f6560;
          margin: 0;
          max-width: 17ch;
        }

        .mp-left-footer {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-left: calc(-1 * clamp(0px, 4vw, 60px));
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .2em;
          color: #6f635f;
        }

        .mp-left-footer::before {
          content: "";
          width: 46px;
          height: 2px;
          background: #8b4a50;
        }

        /* ---------- Coluna direita / cartão ---------- */

        .mp-right {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: 0;
          min-height: 100vh;
          min-height: 100dvh;
          padding: 40px clamp(20px, 3vw, 52px);
        }

        .mp-card {
          position: relative;
          width: 100%;
          max-width: 500px;
          padding: clamp(26px, 2.6vw, 38px);
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, .72);
          background:
            linear-gradient(
              135deg,
              rgba(255, 253, 250, .74),
              rgba(246, 239, 232, .62)
            );
          backdrop-filter: blur(18px) saturate(1.12);
          -webkit-backdrop-filter: blur(18px) saturate(1.12);
          box-shadow:
            0 30px 70px rgba(25, 5, 10, .3),
            0 6px 18px rgba(25, 5, 10, .1),
            inset 0 1px 0 rgba(255, 255, 255, .8);
        }

        .mp-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 3px;
          background: rgba(238, 231, 224, .72);
          border-radius: 11px;
          margin-bottom: 30px;
          overflow: hidden;
        }

        .mp-tab {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 44px;
          background: transparent;
          border: 0;
          border-radius: 9px;
          color: #796b69;
          font-size: 14.5px;
          font-weight: 500;
          cursor: pointer;
          transition: background .2s ease, color .2s ease, box-shadow .2s ease;
        }

        .mp-tab:focus-visible,
        .mp-submit:focus-visible,
        .mp-eye:focus-visible {
          outline: 2px solid #8b3a4a;
          outline-offset: 2px;
        }

        .mp-tab.active {
          background: linear-gradient(115deg, #6b1825, #4a101b);
          color: #fff;
          box-shadow: 0 6px 14px rgba(83, 19, 30, .24);
        }

        .mp-card-title {
          font-family: Georgia, "Times New Roman", serif;
          color: #30171b;
          font-size: clamp(28px, 2.5vw, 37px);
          letter-spacing: -.035em;
          font-weight: 400;
          line-height: 1.12;
          margin: 0;
        }

        .mp-card-subtitle {
          margin: 8px 0 22px;
          font-size: 14.5px;
          line-height: 1.45;
          color: #6c6563;
        }

        .mp-form {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .mp-field {
          display: flex;
          align-items: center;
          min-height: 52px;
          width: 100%;
          border-radius: 11px;
          border: 1px solid rgba(255, 255, 255, .55);
          background: rgba(255, 255, 255, .62);
          box-shadow: 0 6px 14px rgba(36, 25, 21, .05);
          overflow: hidden;
          transition: border-color .2s, box-shadow .2s;
        }

        .mp-field:focus-within {
          border-color: #b58a8a;
          box-shadow:
            0 0 0 3px rgba(106, 33, 46, .1),
            0 6px 14px rgba(36, 25, 21, .05);
        }

        .mp-field-error {
          border-color: #c35f68;
        }

        .mp-field-icon {
          color: #694049;
          padding: 0 14px 0 18px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .mp-field input {
          flex: 1;
          width: 100%;
          min-width: 0;
          min-height: 50px;
          padding: 10px 8px 10px 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #302226;
          font-size: 14px;
          font-family: inherit;
          box-shadow: none;
        }

        .mp-field input::placeholder {
          color: #9d928d;
        }

        .mp-field input:-webkit-autofill,
        .mp-field input:-webkit-autofill:hover,
        .mp-field input:-webkit-autofill:focus,
        .mp-field input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #fbf6f1 inset !important;
          -webkit-text-fill-color: #302226 !important;
          caret-color: #302226;
          transition: background-color 9999s ease-out;
          border-radius: 0;
        }

        .mp-field-right {
          display: flex;
          padding-right: 10px;
          align-items: center;
          flex-shrink: 0;
        }

        .mp-eye {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #7b6265;
          cursor: pointer;
        }

        .mp-eye:hover {
          color: #591c29;
          background: rgba(243, 235, 229, .9);
        }

        .mp-error {
          padding: 6px 4px 0;
          color: #ba4455;
          font-size: 12px;
          margin: 0;
        }

        .mp-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 100%;
          min-height: 54px;
          margin-top: 8px;
          padding: 14px 52px;
          border: 0;
          border-radius: 11px;
          background: linear-gradient(115deg, #701723, #470a14);
          color: white;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(81, 18, 28, .22);
          transition: transform .2s, box-shadow .2s;
        }

        .mp-submit svg {
          position: absolute;
          right: 22px;
        }

        .mp-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(81, 18, 28, .3);
        }

        .mp-submit:disabled {
          cursor: wait;
          opacity: .7;
        }

        .mp-select {
          width: 100%;
          min-height: 52px;
          padding: 0 15px;
          border: 1px solid rgba(255, 255, 255, .55);
          border-radius: 11px;
          background: rgba(255, 255, 255, .62);
          box-shadow: 0 6px 14px rgba(36, 25, 21, .05);
          color: #35262b;
          font-size: 14px;
          font-family: inherit;
          outline: 0;
        }

        .mp-select:focus {
          border-color: #b58a8a;
          box-shadow: 0 0 0 3px rgba(106, 33, 46, .1);
        }

        .mp-terms {
          text-align: center;
          font-size: 11px;
          color: #877c76;
          line-height: 1.6;
          margin: 2px 0 0;
        }

        .mp-card-footer {
          margin-top: 26px;
          padding-top: 18px;
          text-align: center;
          border-top: 1px solid rgba(220, 208, 198, .8);
          font-size: 12px;
          color: #8d807b;
        }

        .mp-card-footer strong {
          color: #372528;
          font-weight: 800;
          letter-spacing: .08em;
        }

        .mp-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          padding: 26px 0;
          text-align: center;
        }

        .mp-success-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: rgba(232, 217, 205, .9);
          color: #5b2430;
        }

        .mp-success p {
          color: #6f6461;
          line-height: 1.65;
          font-size: 14px;
          margin: 0;
        }

        /* ---------- Responsivo ---------- */

        @media (max-width: 1300px) {
          .mp-left {
            padding-right: 40px;
          }

          .mp-feature {
            padding: 12px;
            gap: 10px;
          }

          .mp-feature-icon {
            width: 44px;
            height: 44px;
            flex-basis: 44px;
          }
        }

        @media (max-width: 1050px) {
          .mp-auth {
            grid-template-columns: 52% 48%;
          }

          .mp-left {
            padding: 32px 28px 28px 40px;
          }

          .mp-brand {
            margin-left: 10px;
          }

          .mp-features {
            gap: 9px;
          }

          .mp-feature {
            flex-direction: column;
            align-items: flex-start;
            min-height: 112px;
          }

          .mp-feature p {
            max-width: none;
          }

          .mp-left-footer {
            margin-left: -12px;
          }

          .mp-card {
            padding: 26px;
          }
        }

        @media (max-width: 800px) {
          .mp-auth {
            display: flex;
            flex-direction: column;
            overflow: visible;
          }

          .mp-auth::before,
          .mp-stage {
            display: none;
          }

          .mp-left {
            min-height: auto;
            padding: 32px 28px 38px;
          }

          .mp-brand {
            align-self: center;
            margin: 0;
          }

          .mp-intro {
            margin: 40px auto 0;
            width: 100%;
            max-width: 620px;
          }

          .mp-feature {
            flex-direction: row;
            align-items: center;
            min-height: 84px;
          }

          .mp-left-footer {
            margin: 35px 0 0;
          }

          .mp-right {
            min-height: auto;
            padding: 55px 25px;
            background:
              linear-gradient(
                145deg,
                rgba(63, 15, 26, .9),
                rgba(46, 10, 19, .92)
              ),
              url("${MARBLE}") center / cover;
          }
        }

        @media (max-width: 540px) {
          .mp-left {
            padding: 28px 19px 31px;
          }

          .mp-brand-name {
            font-size: 30px;
          }

          .mp-intro {
            margin-top: 34px;
          }

          .mp-heading {
            font-size: 34px;
          }

          .mp-description {
            font-size: 13.5px;
            margin-top: 16px;
          }

          .mp-br {
            display: none;
          }

          .mp-features {
            gap: 9px;
          }

          .mp-feature {
            flex-direction: column;
            align-items: flex-start;
            padding: 12px;
            gap: 8px;
          }

          .mp-feature-icon {
            width: 40px;
            height: 40px;
            flex-basis: 40px;
          }

          .mp-feature h3 {
            font-size: 12px;
          }

          .mp-feature p {
            font-size: 11px;
            max-width: none;
          }

          .mp-left-footer {
            font-size: 9px;
          }

          .mp-right {
            padding: 32px 13px 45px;
          }

          .mp-card {
            padding: 24px 18px;
            border-radius: 20px;
          }

          .mp-tabs {
            margin-bottom: 26px;
          }

          .mp-tab {
            min-height: 42px;
            font-size: 13px;
          }

          .mp-card-title {
            font-size: 29px;
          }

          .mp-card-subtitle {
            font-size: 13px;
          }

          .mp-field {
            min-height: 50px;
          }

          .mp-field input {
            min-height: 48px;
          }

          .mp-submit {
            min-height: 52px;
            font-size: 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mp-auth *,
          .mp-auth *::before,
          .mp-auth *::after {
            transition: none !important;
          }
        }
      `}</style>

      <div className="mp-stage" aria-hidden="true">
        <div className="mp-slab mp-slab-wine">
          <i />
        </div>
        <div className="mp-glow mp-glow-one" />
        <div className="mp-glow mp-glow-two" />
        <div className="mp-slab mp-slab-stone">
          <i />
        </div>
        <div className="mp-slab mp-slab-light-back">
          <i />
        </div>
        <div className="mp-slab mp-slab-light-front">
          <i />
        </div>
      </div>

      <section className="mp-left">
        <header className="mp-brand">
          <LogoM size={64} />

          <div className="mp-brand-name">Marmopedras</div>

          <div className="mp-brand-tag">
            PEDRAS QUE CONSTROEM HISTÓRIAS
          </div>

          <div className="mp-brand-powered">
            powered by <strong>NEXT</strong>
          </div>
        </header>

        <div className="mp-intro">
          <span className="mp-short-line" />

          <h2 className="mp-heading">
            Controle e sofisticação
            <br />
            para o estoque de pedras.
          </h2>

          <p className="mp-description">
            Gerencie entradas, saídas, transferências
            <br className="mp-br" /> e a distribuição do seu estoque com mais
            <br className="mp-br" /> organização, segurança e eficiência.
          </p>

          <div className="mp-features">
            <Feature
              icon="box"
              title="Gestão de estoque"
              description="Visualize e organize seus materiais"
            />

            <Feature
              icon="list"
              title="Histórico completo"
              description="Acompanhe todas as movimentações"
            />

            <Feature
              icon="bell"
              title="Alertas de saldo"
              description="Evite falta de materiais no estoque"
            />

            <Feature
              icon="transfer"
              title="Controle de movimentações"
              description="Entradas, saídas e transferências"
            />
          </div>
        </div>

        <footer className="mp-left-footer">
          QUALIDADE EM CADA DETALHE
        </footer>
      </section>

      <section className="mp-right">
        <div className="mp-card">
          <div className="mp-tabs" role="group" aria-label="Acesso">
            <button
              type="button"
              className={`mp-tab ${mode === "login" ? "active" : ""}`}
              aria-pressed={mode === "login"}
              onClick={() => changeMode("login")}
            >
              Entrar
            </button>

            <button
              type="button"
              className={`mp-tab ${mode === "register" ? "active" : ""}`}
              aria-pressed={mode === "register"}
              onClick={() => changeMode("register")}
            >
              Criar conta
            </button>
          </div>

          {mode === "login" && (
            <form onSubmit={handleLogin} className="mp-form">
              <div>
                <h1 className="mp-card-title">Bem-vindo de volta</h1>

                <p className="mp-card-subtitle">
                  Acesse sua conta Marmopedras
                </p>
              </div>

              <Field
                icon="mail"
                placeholder="E-mail"
                type="email"
                autoComplete="username"
                value={loginEmail}
                onChange={(value) => {
                  setLoginEmail(value);
                  setLoginErrors((prev) => ({ ...prev, email: "" }));
                }}
                error={loginErrors.email}
              />

              <Field
                icon="lock"
                placeholder="Senha"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                value={loginPw}
                onChange={(value) => {
                  setLoginPw(value);
                  setLoginErrors((prev) => ({ ...prev, pw: "" }));
                }}
                error={loginErrors.pw}
                right={
                  <EyeButton
                    visible={showPw}
                    onClick={() => setShowPw((prev) => !prev)}
                  />
                }
              />

              <button
                type="submit"
                className="mp-submit"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar no sistema"}

                {!loading && <Icon name="arrow" size={20} />}
              </button>
            </form>
          )}

          {mode === "register" && !registered && (
            <form onSubmit={handleRegister} className="mp-form">
              <div>
                <h1 className="mp-card-title">Criar conta</h1>

                <p className="mp-card-subtitle">
                  Preencha os dados para solicitar acesso
                </p>
              </div>

              <Field
                icon="user"
                placeholder="Nome completo *"
                autoComplete="name"
                value={regNome}
                onChange={(value) => {
                  setRegNome(value);
                  setRegErrors((prev) => ({ ...prev, nome: "" }));
                }}
                error={regErrors.nome}
              />

              <Field
                icon="mail"
                placeholder="E-mail *"
                type="email"
                autoComplete="email"
                value={regEmail}
                onChange={(value) => {
                  setRegEmail(value);
                  setRegErrors((prev) => ({ ...prev, email: "" }));
                }}
                error={regErrors.email}
              />

              <Field
                icon="phone"
                placeholder="Telefone / WhatsApp *"
                type="tel"
                autoComplete="tel"
                value={regTel}
                onChange={(value) => {
                  setRegTel(value);
                  setRegErrors((prev) => ({ ...prev, tel: "" }));
                }}
                error={regErrors.tel}
              />

              <select
                className="mp-select"
                aria-label="Cargo"
                value={regCargo}
                onChange={(event) => setRegCargo(event.target.value)}
              >
                <option value="">Selecione seu cargo</option>

                {cargos.map((cargo) => (
                  <option key={cargo} value={cargo}>
                    {cargo}
                  </option>
                ))}
              </select>

              <Field
                icon="lock"
                placeholder="Senha * (mín. 6 caracteres)"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                value={regPw}
                onChange={(value) => {
                  setRegPw(value);
                  setRegErrors((prev) => ({ ...prev, pw: "" }));
                }}
                error={regErrors.pw}
                right={
                  <EyeButton
                    visible={showPw}
                    onClick={() => setShowPw((prev) => !prev)}
                  />
                }
              />

              <Field
                icon="lock"
                placeholder="Confirmar senha *"
                type={showPw2 ? "text" : "password"}
                autoComplete="new-password"
                value={regPw2}
                onChange={(value) => {
                  setRegPw2(value);
                  setRegErrors((prev) => ({ ...prev, pw2: "" }));
                }}
                error={regErrors.pw2}
                right={
                  <EyeButton
                    visible={showPw2}
                    onClick={() => setShowPw2((prev) => !prev)}
                  />
                }
              />

              <button
                type="submit"
                className="mp-submit"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Solicitar acesso"}

                {!loading && <Icon name="arrow" size={20} />}
              </button>

              <p className="mp-terms">
                O cadastro está sujeito às regras de acesso da
                Marmopedras.
              </p>
            </form>
          )}

          {mode === "register" && registered && (
            <div className="mp-success" role="status">
              <div className="mp-success-icon">
                <IconCheck size={29} />
              </div>

              <h2 className="mp-card-title">Conta criada!</h2>

              <p>
                Seu cadastro foi realizado com sucesso.
                <br />
                Redirecionando para o login...
              </p>
            </div>
          )}

          <footer className="mp-card-footer">
            powered by <strong>NEXT</strong>
          </footer>
        </div>
      </section>
    </main>
  );
}
