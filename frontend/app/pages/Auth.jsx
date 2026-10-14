
import { useState } from "react";
import { api } from "../api";
import { IconCheck } from "../components/Icons";

const MARBLE =
  "https://images.unsplash.com/photo-1770065805058-3bfed55e23ee?auto=format&fit=crop&w=1800&q=90";

function LogoM({ size = 38 }) {
  return (
    <div className="mp-logo-box">
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <path
          d="M4 30V8l10 14L24 8v22"
          stroke="#c9976e"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 8l8 4v18"
          stroke="#c9976e"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Icon({ name, size = 19 }) {
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
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function InputField({
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
    <div className="mp-input-group">
      <div className={`mp-input ${error ? "mp-input-error" : ""}`}>
        <span className="mp-input-icon">
          <Icon name={icon} />
        </span>

        <input
          type={type}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {right && <div className="mp-input-right">{right}</div>}
      </div>

      {error && <p className="mp-error">{error}</p>}
    </div>
  );
}

function ShowPassword({ visible, onClick }) {
  return (
    <button
      type="button"
      className="mp-eye"
      onClick={onClick}
      aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
    >
      <Icon name={visible ? "eye" : "eyeOff"} />
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    const errors = validateLogin();

    if (Object.keys(errors).length) {
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
    } catch (err) {
      setLoginErrors({
        pw: err.message || "Falha ao entrar",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    const errors = validateRegister();

    if (Object.keys(errors).length) {
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
    } catch (err) {
      const campos = err.campos || {};

      setRegErrors(
        err.campos
          ? {
              nome: campos.nome,
              email: campos.email,
              pw: campos.senha,
            }
          : {
              email: err.message || "Erro ao cadastrar",
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
          --wine: #4b111b;
          --wine-dark: #2c0b12;
          --gold: #c49a72;
          --cream: #f7f2ed;

          display: grid;
          grid-template-columns: 48% 52%;
          min-height: 100vh;
          min-height: 100dvh;
          overflow: hidden;
          font-family: Arial, Helvetica, sans-serif;
        }

        .mp-auth,
        .mp-auth * {
          box-sizing: border-box;
        }

        .mp-left {
          position: relative;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100vh;
          padding: 55px clamp(38px, 4.2vw, 75px) 60px;
          background-color: #3b1218;
          background-image:
            linear-gradient(
              125deg,
              rgba(36, 7, 12, .82),
              rgba(67, 13, 21, .75)
            ),
            url("${MARBLE}");
          background-size: cover;
          background-position: center;
          isolation: isolate;
        }

        .mp-left::before {
          content: "";
          position: absolute;
          z-index: -1;
          inset: 0;
          background:
            radial-gradient(
              ellipse at 70% 40%,
              rgba(139, 60, 64, .14),
              transparent 60%
            ),
            linear-gradient(
              115deg,
              transparent 66%,
              rgba(214, 163, 126, .10) 67%,
              transparent 68%
            );
        }

        .mp-left-decoration {
          position: absolute;
          z-index: 0;
          right: -2px;
          top: -12%;
          width: 21%;
          height: 127%;
          transform: rotate(-13deg);
          transform-origin: top center;
          background:
            linear-gradient(
              90deg,
              rgba(230, 213, 199, .17),
              rgba(243, 226, 205, .09)
            ),
            url("${MARBLE}") center / cover;
          border-left: 2px solid rgba(236, 204, 172, .52);
          border-right: 4px solid rgba(255, 239, 213, .72);
          box-shadow: -12px 3px 25px rgba(25, 7, 10, .15);
          filter: sepia(.4) saturate(.65);
          pointer-events: none;
        }

        .mp-brand,
        .mp-hero,
        .mp-left-footer {
          position: relative;
          z-index: 1;
        }

        .mp-brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .mp-logo-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 67px;
          height: 67px;
          margin-bottom: 7px;
          border-radius: 13px;
          background: rgba(255,255,255,.075);
          border: 1px solid rgba(255,255,255,.055);
        }

        .mp-brand-name {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 35px;
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -.025em;
          color: #fff5ed;
        }

        .mp-brand-tag {
          margin-top: 9px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .19em;
          line-height: 1.5;
          color: rgba(255, 242, 233, .82);
        }

        .mp-powered {
          margin-top: 25px;
          color: rgba(255,255,255,.48);
          font-size: 13px;
        }

        .mp-powered strong {
          color: #f4e5d7;
          font-weight: 800;
          letter-spacing: .07em;
        }

        .mp-hero {
          width: 100%;
          max-width: 630px;
          margin-top: 55px;
          margin-bottom: 30px;
        }

        .mp-line {
          display: block;
          width: 42px;
          height: 2px;
          margin-bottom: 30px;
          background: #d4b08b;
        }

        .mp-heading {
          max-width: 580px;
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          font-size: clamp(40px, 3.65vw, 65px);
          line-height: 1.05;
          letter-spacing: -.043em;
          color: #fff8f3;
        }

        .mp-description {
          max-width: 490px;
          margin-top: 25px;
          font-size: 16px;
          line-height: 1.7;
          color: rgba(255,247,240,.76);
        }

        .mp-features {
          display: grid;
          grid-template-columns: repeat(2, max-content);
          gap: 11px 12px;
          margin-top: 44px;
        }

        .mp-feature {
          display: flex;
          align-items: center;
          min-height: 38px;
          gap: 12px;
          padding: 9px 17px;
          border: 1px solid rgba(255,255,255,.17);
          border-radius: 999px;
          color: rgba(255,248,241,.88);
          background: rgba(255,255,255,.085);
          box-shadow: 0 5px 16px rgba(0,0,0,.06);
          font-size: 13px;
          white-space: nowrap;
          backdrop-filter: blur(8px);
        }

        .mp-feature-dot {
          flex: 0 0 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e8c397;
        }

        .mp-left-footer {
          color: rgba(255,255,255,.55);
          font-size: 11px;
          letter-spacing: .06em;
        }

        .mp-right {
          position: relative;
          isolation: isolate;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          min-height: 100vh;
          padding: 50px 45px;
          background:
            linear-gradient(
              rgba(250,245,238,.52),
              rgba(246,238,228,.57)
            ),
            url("${MARBLE}") center / cover;
        }

        .mp-right::before {
          content: "";
          position: absolute;
          z-index: -1;
          inset: 0;
          background:
            radial-gradient(
              circle at 50% 36%,
              rgba(255,255,255,.45),
              transparent 65%
            );
        }

        .mp-stone-one {
          position: absolute;
          z-index: 0;
          right: -17%;
          bottom: -25%;
          width: 74%;
          height: 49%;
          transform: rotate(-24deg);
          background:
            linear-gradient(
              rgba(255,255,255,.1),
              rgba(174,156,143,.13)
            ),
            url("${MARBLE}") 70% center / cover;
          border-top: 6px solid rgba(255,255,255,.94);
          box-shadow: 0 -15px 30px rgba(79,52,42,.13);
          filter: sepia(.2) saturate(.6);
          pointer-events: none;
        }

        .mp-stone-two {
          position: absolute;
          z-index: 0;
          right: -26%;
          bottom: -20%;
          width: 37%;
          height: 51%;
          transform: rotate(26deg);
          background:
            linear-gradient(
              rgba(79,68,65,.38),
              rgba(120,103,96,.25)
            ),
            url("${MARBLE}") center / cover;
          border-left: 5px solid rgba(255,255,255,.8);
          box-shadow: -12px -6px 30px rgba(54,38,34,.17);
          filter: grayscale(.56);
          pointer-events: none;
        }

        .mp-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 630px;
          padding: clamp(35px, 4vw, 65px);
          border-radius: 22px;
          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.86),
              rgba(250,246,241,.88)
            );
          border: 1px solid rgba(255,255,255,.96);
          box-shadow:
            0 25px 65px rgba(75,52,40,.13),
            0 6px 25px rgba(75,52,40,.045);
          backdrop-filter: blur(12px);
        }

        .mp-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          margin-bottom: 54px;
          padding: 4px;
          background: rgba(225,217,209,.53);
          border-radius: 13px;
        }

        .mp-tab {
          min-height: 51px;
          border: 0;
          border-radius: 10px;
          color: #756663;
          background: transparent;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: .2s ease;
        }

        .mp-tab.active {
          background: linear-gradient(
            110deg,
            #681821,
            #59141d
          );
          color: #fff;
          box-shadow: 0 7px 15px rgba(87,27,32,.17);
        }

        .mp-title {
          margin: 0;
          color: #271517;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 600;
          font-size: clamp(34px, 3vw, 43px);
          letter-spacing: -.045em;
          line-height: 1.14;
        }

        .mp-subtitle {
          margin: 10px 0 35px;
          color: #786f6c;
          font-size: 16px;
          line-height: 1.5;
        }

        .mp-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .mp-input-group {
          min-width: 0;
        }

        .mp-input {
          display: flex;
          align-items: center;
          min-height: 60px;
          border: 1px solid rgba(222,214,207,.82);
          border-radius: 14px;
          background: rgba(255,255,255,.85);
          box-shadow: 0 10px 18px rgba(63,49,39,.06);
          overflow: hidden;
          transition: border-color .2s, box-shadow .2s;
        }

        .mp-input:focus-within {
          border-color: #b38b86;
          box-shadow:
            0 0 0 3px rgba(107,34,47,.09),
            0 10px 18px rgba(63,49,39,.04);
        }

        .mp-input-error {
          border-color: #c56b70;
        }

        .mp-input-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 19px;
          color: #a38d84;
          flex-shrink: 0;
        }

        .mp-input input {
          flex: 1;
          width: 100%;
          min-width: 0;
          min-height: 58px;
          padding: 12px 8px 12px 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #322527;
          font-family: inherit;
          font-size: 14px;
        }

        .mp-input input::placeholder {
          color: #a29a96;
        }

        .mp-input input:-webkit-autofill,
        .mp-input input:-webkit-autofill:hover,
        .mp-input input:-webkit-autofill:focus {
          -webkit-box-shadow:
            0 0 0 1000px #fffdfb inset !important;
          -webkit-text-fill-color: #322527 !important;
          caret-color: #322527;
          transition: background-color 9999s ease-out;
        }

        .mp-input-right {
          display: flex;
          padding-right: 13px;
          align-items: center;
          flex-shrink: 0;
        }

        .mp-eye {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 7px;
          background: transparent;
          color: #ab9c96;
          cursor: pointer;
        }

        .mp-eye:hover {
          color: #65313b;
        }

        .mp-error {
          margin: 6px 0 0 5px;
          color: #b94751;
          font-size: 12px;
        }

        .mp-forgot {
          display: flex;
          justify-content: flex-end;
          margin-top: -3px;
          margin-bottom: 5px;
        }

        .mp-forgot button {
          padding: 3px 0;
          border: none;
          background: transparent;
          color: #71303b;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-size: 13px;
          cursor: not-allowed;
        }

        .mp-submit {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 60px;
          margin-top: 4px;
          padding: 15px 50px;
          border: 0;
          border-radius: 13px;
          background: linear-gradient(
            110deg,
            #d5ae84,
            #b98c60
          );
          color: white;
          font-size: 15px;
          font-weight: 700;
          box-shadow: 0 9px 17px rgba(139,96,63,.11);
          cursor: pointer;
          transition: transform .2s, box-shadow .2s;
        }

        .mp-submit svg {
          position: absolute;
          right: 25px;
        }

        .mp-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(139,96,63,.2);
        }

        .mp-submit:disabled {
          opacity: .65;
          cursor: wait;
        }

        .mp-select {
          width: 100%;
          min-height: 58px;
          padding: 0 16px;
          background: rgba(255,255,255,.91);
          border: 1px solid #ded6cf;
          border-radius: 13px;
          font-size: 14px;
          color: #3a292c;
          outline: none;
        }

        .mp-select:focus {
          border-color: #a9847d;
        }

        .mp-card-footer {
          margin-top: 39px;
          padding-top: 22px;
          border-top: 1px solid rgba(199,187,178,.35);
          text-align: center;
          font-size: 12px;
          color: #998e88;
        }

        .mp-card-footer strong {
          color: #322729;
          letter-spacing: .06em;
          font-weight: 800;
        }

        .mp-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          padding: 20px 0;
          text-align: center;
        }

        .mp-success-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background: #f1e3d7;
          color: #8b5947;
        }

        .mp-success p,
        .mp-note {
          color: #8a7c75;
          font-size: 12px;
          line-height: 1.6;
          text-align: center;
        }

        @media (max-width: 1250px) {
          .mp-auth {
            grid-template-columns: 48% 52%;
          }

          .mp-left {
            padding-left: 35px;
            padding-right: 35px;
          }

          .mp-heading {
            font-size: clamp(37px, 3.8vw, 49px);
          }

          .mp-features {
            grid-template-columns: repeat(2, minmax(0, max-content));
            gap: 9px;
          }

          .mp-feature {
            font-size: 11px;
            padding: 8px 11px;
          }

          .mp-right {
            padding: 32px;
          }

          .mp-card {
            padding: 35px;
          }
        }

        @media (max-width: 900px) {
          .mp-auth {
            display: flex;
            flex-direction: column;
            overflow: visible;
          }

          .mp-left {
            min-height: auto;
            padding: 36px 26px 45px;
          }

          .mp-hero {
            margin-top: 55px;
          }

          .mp-heading {
            font-size: clamp(37px, 5vw, 48px);
          }

          .mp-left-footer {
            margin-top: 45px;
          }

          .mp-right {
            min-height: 600px;
            padding: 48px 22px;
          }

          .mp-card {
            max-width: 620px;
          }
        }

        @media (max-width: 540px) {
          .mp-left {
            padding: 28px 20px 35px;
          }

          .mp-logo-box {
            width: 52px;
            height: 52px;
          }

          .mp-brand-name {
            font-size: 30px;
          }

          .mp-brand-tag {
            font-size: 8px;
          }

          .mp-hero {
            margin-top: 43px;
          }

          .mp-heading {
            font-size: clamp(34px, 9vw, 43px);
          }

          .mp-description {
            font-size: 14px;
          }

          .mp-features {
            grid-template-columns: 1fr 1fr;
            gap: 9px;
            margin-top: 30px;
          }

          .mp-feature {
            white-space: normal;
            font-size: 11px;
            padding: 9px;
          }

          .mp-left-footer {
            font-size: 9px;
          }

          .mp-right {
            min-height: auto;
            padding: 37px 13px 48px;
          }

          .mp-card {
            padding: 28px 21px;
            border-radius: 19px;
          }

          .mp-tabs {
            margin-bottom: 32px;
          }

          .mp-tab {
            min-height: 45px;
            font-size: 13px;
          }

          .mp-title {
            font-size: 30px;
          }

          .mp-subtitle {
            font-size: 13px;
          }

          .mp-input {
            min-height: 53px;
          }

          .mp-input input {
            min-height: 51px;
          }

          .mp-submit {
            min-height: 55px;
            font-size: 13px;
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

      <section className="mp-left">
        <div className="mp-left-decoration" aria-hidden="true" />

        <header className="mp-brand">
          <LogoM size={36} />

          <div className="mp-brand-name">
            Marmopedras
          </div>

          <div className="mp-brand-tag">
            PEDRAS QUE CONSTROEM HISTÓRIAS
          </div>

          <div className="mp-powered">
            powered by <strong>NEXT</strong>
          </div>
        </header>

        <div className="mp-hero">
          <span className="mp-line" />

          <h2 className="mp-heading">
            Gestão completa
            <br />
            do estoque de
            <br />
            pedras naturais.
          </h2>

          <p className="mp-description">
            Gerencie entradas, saídas, transferências
            e distribuição de materiais com elegância
            e precisão.
          </p>

          <div className="mp-features">
            {[
              "Gestão de estoque",
              "Histórico completo",
              "Alertas de saldo",
              "Controle de movimentações",
            ].map((feature) => (
              <div key={feature} className="mp-feature">
                <span className="mp-feature-dot" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <footer className="mp-left-footer">
          © {new Date().getFullYear()} Marmopedras · NEXT
        </footer>
      </section>

      <section className="mp-right">
        <div className="mp-stone-one" aria-hidden="true" />
        <div className="mp-stone-two" aria-hidden="true" />

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
            <form className="mp-form" onSubmit={handleLogin}>
              <div>
                <h1 className="mp-title">
                  Bem-vindo de volta
                </h1>

                <p className="mp-subtitle">
                  Acesse sua conta Marmopedras
                </p>
              </div>

              <InputField
                icon="mail"
                placeholder="E-mail"
                type="email"
                autoComplete="username"
                value={loginEmail}
                onChange={(value) => {
                  setLoginEmail(value);
                  setLoginErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
                }}
                error={loginErrors.email}
              />

              <InputField
                icon="lock"
                placeholder="Senha"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                value={loginPw}
                onChange={(value) => {
                  setLoginPw(value);
                  setLoginErrors((prev) => ({
                    ...prev,
                    pw: "",
                  }));
                }}
                error={loginErrors.pw}
                right={
                  <ShowPassword
                    visible={showPw}
                    onClick={() =>
                      setShowPw((prev) => !prev)
                    }
                  />
                }
              />

              <div className="mp-forgot">
                <button
                  type="button"
                  disabled
                  title="Recuperação de senha ainda não configurada"
                >
                  Esqueceu a senha?
                </button>
              </div>

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
            <form className="mp-form" onSubmit={handleRegister}>
              <div>
                <h1 className="mp-title">Criar conta</h1>

                <p className="mp-subtitle">
                  Preencha seus dados para solicitar acesso
                </p>
              </div>

              <InputField
                icon="user"
                placeholder="Nome completo *"
                autoComplete="name"
                value={regNome}
                onChange={(value) => {
                  setRegNome(value);
                  setRegErrors((prev) => ({
                    ...prev,
                    nome: "",
                  }));
                }}
                error={regErrors.nome}
              />

              <InputField
                icon="mail"
                placeholder="E-mail *"
                type="email"
                autoComplete="email"
                value={regEmail}
                onChange={(value) => {
                  setRegEmail(value);
                  setRegErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
                }}
                error={regErrors.email}
              />

              <InputField
                icon="phone"
                placeholder="Telefone / WhatsApp *"
                type="tel"
                autoComplete="tel"
                value={regTel}
                onChange={(value) => {
                  setRegTel(value);
                  setRegErrors((prev) => ({
                    ...prev,
                    tel: "",
                  }));
                }}
                error={regErrors.tel}
              />

              <select
                className="mp-select"
                aria-label="Cargo"
                value={regCargo}
                onChange={(e) => setRegCargo(e.target.value)}
              >
                <option value="">Selecione seu cargo</option>

                {cargos.map((cargo) => (
                  <option key={cargo} value={cargo}>
                    {cargo}
                  </option>
                ))}
              </select>

              <InputField
                icon="lock"
                placeholder="Senha * (mín. 6 caracteres)"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                value={regPw}
                onChange={(value) => {
                  setRegPw(value);
                  setRegErrors((prev) => ({
                    ...prev,
                    pw: "",
                  }));
                }}
                error={regErrors.pw}
                right={
                  <ShowPassword
                    visible={showPw}
                    onClick={() =>
                      setShowPw((prev) => !prev)
                    }
                  />
                }
              />

              <InputField
                icon="lock"
                placeholder="Confirmar senha *"
                type={showPw2 ? "text" : "password"}
                autoComplete="new-password"
                value={regPw2}
                onChange={(value) => {
                  setRegPw2(value);
                  setRegErrors((prev) => ({
                    ...prev,
                    pw2: "",
                  }));
                }}
                error={regErrors.pw2}
                right={
                  <ShowPassword
                    visible={showPw2}
                    onClick={() =>
                      setShowPw2((prev) => !prev)
                    }
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

              <p className="mp-note">
                O cadastro está sujeito às regras de acesso da Marmopedras.
              </p>
            </form>
          )}

          {mode === "register" && registered && (
            <div className="mp-success" role="status">
              <div className="mp-success-icon">
                <IconCheck size={28} />
              </div>

              <h2 className="mp-title">
                Conta criada!
              </h2>

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
