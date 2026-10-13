
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
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 53V10L23 31L32 16L41 31L56 10V53"
        stroke="#753543"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 53V36L23 43L32 29L41 43L47 36V53"
        stroke="#b78d69"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
        <Icon name={icon} size={25} />
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
          <Icon name={icon} size={20} />
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
  return (
    <button
      type="button"
      className="mp-eye"
      onClick={onClick}
      aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
      aria-pressed={visible}
    >
      <Icon name={visible ? "eye" : "eyeOff"} size={20} />
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
          grid-template-columns: 54% 46%;
          min-height: 100vh;
          min-height: 100dvh;
          overflow: hidden;
          background: #eee7df;
          color: #281b1d;
          font-family: Arial, Helvetica, sans-serif;
        }

        .mp-auth,
        .mp-auth * {
          box-sizing: border-box;
        }

        .mp-left {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
          min-height: 100vh;
          padding: clamp(38px, 4.4vw, 74px)
                   clamp(40px, 6.5vw, 112px)
                   48px;
          background-color: #f1e9df;
          background-image:
            linear-gradient(
              105deg,
              rgba(255, 252, 247, .76),
              rgba(250, 245, 237, .58)
            ),
            url("${MARBLE}");
          background-position: center;
          background-size: cover;
        }

        .mp-left::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            radial-gradient(
              ellipse at 8% 45%,
              rgba(255,255,255,.66),
              transparent 57%
            );
          pointer-events: none;
        }

        .mp-brand {
          width: fit-content;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-left: clamp(50px, 8vw, 158px);
        }

        .mp-brand-name {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(28px, 2.3vw, 39px);
          line-height: 1.05;
          letter-spacing: -.04em;
          color: var(--mp-wine-dark);
          font-weight: 400;
          margin-top: -1px;
        }

        .mp-brand-tag {
          margin-top: 10px;
          color: #675254;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: .2em;
          white-space: nowrap;
        }

        .mp-brand-powered {
          margin-top: 15px;
          font-size: 12px;
          color: #968887;
        }

        .mp-brand-powered strong {
          color: #37282a;
          font-weight: 800;
          letter-spacing: .08em;
        }

        .mp-intro {
          max-width: 675px;
          margin-top: 30px;
          margin-bottom: 34px;
        }

        .mp-short-line {
          display: block;
          width: 62px;
          height: 2px;
          background: linear-gradient(
            to right,
            #823b47,
            #d4b28d
          );
          margin-bottom: 31px;
        }

        .mp-heading {
          max-width: 680px;
          color: #2c1319;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          font-size: clamp(38px, 3.05vw, 53px);
          letter-spacing: -.038em;
          line-height: 1.12;
        }

        .mp-description {
          max-width: 490px;
          margin-top: 23px;
          font-size: clamp(14px, 1.15vw, 17px);
          color: #685f5b;
          line-height: 1.75;
        }

        .mp-features {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 28px;
          max-width: 640px;
        }

        .mp-feature {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
          min-height: 99px;
          padding: 16px;
          border-radius: 13px;
          border: 1px solid rgba(255,255,255,.78);
          background: rgba(255,255,255,.63);
          box-shadow: 0 7px 28px rgba(74,53,42,.045);
          backdrop-filter: blur(5px);
        }

        .mp-feature-icon {
          flex: 0 0 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: #e9ddd3;
          color: #6a2833;
        }

        .mp-feature-text {
          min-width: 0;
        }

        .mp-feature h3 {
          font-size: 13px;
          color: #242023;
          font-weight: 700;
          line-height: 1.4;
          margin: 0 0 4px;
        }

        .mp-feature p {
          font-size: 12px;
          line-height: 1.45;
          color: #756b67;
          margin: 0;
        }

        .mp-left-footer {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .2em;
          color: #756a66;
        }

        .mp-left-footer::before {
          content: "";
          width: 51px;
          height: 2px;
          background: #8b4a50;
        }

        .mp-right {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: 0;
          min-height: 100vh;
          padding: 48px 28px;
          background:
            linear-gradient(
              145deg,
              rgba(63,15,26,.90),
              rgba(46,10,19,.91)
            ),
            url("${MARBLE}") center / cover;
        }

        .mp-right::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              110deg,
              rgba(103,38,49,.12),
              transparent 50%
            ),
            radial-gradient(
              ellipse at 75% 42%,
              rgba(0,0,0,.13),
              transparent 60%
            );
          pointer-events: none;
        }

        .mp-stone-one {
          position: absolute;
          z-index: 1;
          left: -13%;
          top: 3%;
          width: 55%;
          height: 68%;
          transform: skewY(-12deg);
          background:
            linear-gradient(
              130deg,
              rgba(83,64,55,.3),
              rgba(239,226,207,.16)
            ),
            url("${MARBLE}") 64% center / cover;
          box-shadow:
            15px 20px 25px rgba(22,8,10,.2),
            inset -5px 0 0 rgba(245,235,220,.72);
          filter: sepia(.55) saturate(.55) brightness(.81);
        }

        .mp-stone-two {
          position: absolute;
          z-index: 1;
          left: -34%;
          bottom: -25%;
          width: 115%;
          height: 43%;
          transform: rotate(-23deg);
          background:
            linear-gradient(
              rgba(255,251,244,.12),
              rgba(220,202,184,.19)
            ),
            url("${MARBLE}") center / cover;
          border-top: 7px solid rgba(255,250,239,.78);
          box-shadow: 0 -15px 35px rgba(31,12,14,.27);
          filter: sepia(.35) saturate(.58) brightness(1.03);
        }

        .mp-stone-three {
          position: absolute;
          z-index: 1;
          right: -27%;
          bottom: -21%;
          width: 75%;
          height: 36%;
          transform: rotate(25deg);
          background:
            linear-gradient(
              rgba(255,249,239,.12),
              rgba(206,181,165,.15)
            ),
            url("${MARBLE}") center / cover;
          border-top: 7px solid rgba(255,246,230,.8);
          box-shadow: 0 -12px 30px rgba(27,11,14,.3);
          filter: sepia(.43) saturate(.5) brightness(1.1);
        }

        .mp-wine-line {
          position: absolute;
          z-index: 1;
          right: 20%;
          top: 0;
          height: 33%;
          width: 2px;
          background: linear-gradient(
            transparent,
            rgba(211,162,121,.72),
            transparent
          );
          box-shadow: 0 0 15px rgba(220,172,126,.4);
        }

        .mp-card {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 530px;
          padding: clamp(30px, 3vw, 43px);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,.9);
          background:
            linear-gradient(
              125deg,
              rgba(255,253,250,.97),
              rgba(249,244,238,.96)
            );
          box-shadow:
            0 30px 75px rgba(25,5,10,.32),
            0 6px 20px rgba(25,5,10,.09);
        }

        .mp-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 4px;
          gap: 0;
          background: #eee8e2;
          border-radius: 12px;
          margin-bottom: 40px;
          overflow: hidden;
        }

        .mp-tab {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 51px;
          background: transparent;
          border: 0;
          border-radius: 9px;
          color: #796b69;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all .2s ease;
        }

        .mp-tab.active {
          background: linear-gradient(
            115deg,
            #6b1825,
            #4f111c
          );
          color: #fff;
          box-shadow: 0 7px 15px rgba(83,19,30,.22);
        }

        .mp-card-title {
          font-family: Georgia, "Times New Roman", serif;
          color: #30171b;
          font-size: clamp(30px, 2.7vw, 40px);
          letter-spacing: -.04em;
          font-weight: 400;
          line-height: 1.15;
          margin: 0;
        }

        .mp-card-subtitle {
          margin: 10px 0 29px;
          font-size: 15px;
          line-height: 1.5;
          color: #746d6b;
        }

        .mp-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .mp-field {
          display: flex;
          align-items: center;
          min-height: 57px;
          width: 100%;
          border-radius: 13px;
          border: 1px solid rgba(219,211,205,.86);
          background: rgba(255,255,255,.83);
          box-shadow: 0 9px 18px rgba(36,25,21,.055);
          overflow: hidden;
          transition: border-color .2s, box-shadow .2s;
        }

        .mp-field:focus-within {
          border-color: #aa7b77;
          box-shadow:
            0 0 0 3px rgba(106,33,46,.085),
            0 9px 18px rgba(36,25,21,.045);
        }

        .mp-field-error {
          border-color: #c35f68;
        }

        .mp-field-icon {
          color: #694049;
          padding: 0 16px 0 20px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .mp-field input {
          flex: 1;
          width: 100%;
          min-width: 0;
          min-height: 55px;
          padding: 12px 8px 12px 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #302226;
          font-size: 14px;
          font-family: inherit;
          box-shadow: none;
        }

        .mp-field input::placeholder {
          color: #a49a95;
        }

        .mp-field input:-webkit-autofill,
        .mp-field input:-webkit-autofill:hover,
        .mp-field input:-webkit-autofill:focus,
        .mp-field input:-webkit-autofill:active {
          -webkit-box-shadow:
            0 0 0 1000px #fffefa inset !important;
          -webkit-text-fill-color:
            #302226 !important;
          caret-color: #302226;
          transition:
            background-color 9999s ease-out;
          border-radius: 0;
        }

        .mp-field-right {
          display: flex;
          padding-right: 11px;
          align-items: center;
          flex-shrink: 0;
        }

        .mp-eye {
          width: 36px;
          height: 36px;
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
          background: #f3ebe5;
        }

        .mp-error {
          padding: 6px 4px 0;
          color: #ba4455;
          font-size: 12px;
          margin: 0;
        }

        .mp-forgot {
          display: flex;
          justify-content: flex-end;
          margin-top: 0;
          margin-bottom: 4px;
        }

        .mp-forgot button {
          padding: 2px;
          border: 0;
          background: transparent;
          color: #71303e;
          font-size: 13px;
          font-weight: 500;
          cursor: not-allowed;
          opacity: .76;
        }

        .mp-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          position: relative;
          width: 100%;
          min-height: 57px;
          margin-top: 4px;
          padding: 14px 48px 14px 18px;
          border: 0;
          border-radius: 12px;
          background: linear-gradient(
            115deg,
            #701723,
            #490b15
          );
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 10px 23px rgba(81,18,28,.18);
          transition: transform .2s, box-shadow .2s;
        }

        .mp-submit svg {
          position: absolute;
          right: 24px;
        }

        .mp-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(81,18,28,.25);
        }

        .mp-submit:disabled {
          cursor: wait;
          opacity: .7;
        }

        .mp-select {
          width: 100%;
          min-height: 55px;
          padding: 0 15px;
          border: 1px solid #ddd3cc;
          border-radius: 12px;
          background: rgba(255,255,255,.9);
          color: #35262b;
          font-size: 14px;
          outline: 0;
        }

        .mp-select:focus {
          border-color: #98606c;
        }

        .mp-terms {
          text-align: center;
          font-size: 11px;
          color: #928781;
          line-height: 1.6;
          margin-top: 2px;
        }

        .mp-card-footer {
          margin-top: 32px;
          padding-top: 21px;
          text-align: center;
          border-top: 1px solid #e9e0d9;
          font-size: 12px;
          color: #978a85;
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
          background: #e8d9cd;
          color: #5b2430;
        }

        .mp-success p {
          color: #827774;
          line-height: 1.65;
          font-size: 14px;
        }

        @media (max-width: 1300px) {
          .mp-left {
            padding-left: 48px;
            padding-right: 48px;
          }

          .mp-brand {
            margin-left: 65px;
          }

          .mp-heading {
            font-size: clamp(37px, 3.25vw, 47px);
          }

          .mp-feature {
            padding: 12px;
            gap: 10px;
          }

          .mp-feature-icon {
            width: 45px;
            height: 45px;
            flex-basis: 45px;
          }

          .mp-right {
            padding: 35px 20px;
          }

          .mp-card {
            padding: 30px;
          }
        }

        @media (max-width: 1050px) {
          .mp-auth {
            grid-template-columns: 50% 50%;
          }

          .mp-left {
            padding: 35px 28px;
          }

          .mp-brand {
            margin-left: 30px;
          }

          .mp-heading {
            font-size: 37px;
          }

          .mp-features {
            gap: 9px;
          }

          .mp-feature {
            flex-direction: column;
            align-items: flex-start;
            min-height: 115px;
          }

          .mp-card {
            padding: 27px;
          }

          .mp-card-title {
            font-size: 31px;
          }
        }

        @media (max-width: 800px) {
          .mp-auth {
            display: flex;
            flex-direction: column;
            overflow: visible;
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
            margin: 42px auto 0;
            width: 100%;
            max-width: 620px;
          }

          .mp-heading {
            font-size: clamp(35px, 5.3vw, 44px);
          }

          .mp-description {
            max-width: 550px;
          }

          .mp-feature {
            flex-direction: row;
            align-items: center;
            min-height: 88px;
          }

          .mp-left-footer {
            margin-top: 35px;
          }

          .mp-right {
            min-height: auto;
            padding: 55px 25px;
          }

          .mp-card {
            max-width: 530px;
          }

          .mp-stone-one {
            left: -4%;
            width: 60%;
          }
        }

        @media (max-width: 540px) {
          .mp-left {
            padding: 28px 19px 31px;
          }

          .mp-brand-name {
            font-size: 30px;
          }

          .mp-brand-tag {
            font-size: 8px;
          }

          .mp-intro {
            margin-top: 37px;
          }

          .mp-heading {
            font-size: 34px;
          }

          .mp-description {
            font-size: 13px;
            margin-top: 18px;
          }

          .mp-features {
            grid-template-columns: repeat(2, minmax(0,1fr));
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
          }

          .mp-left-footer {
            font-size: 9px;
          }

          .mp-right {
            padding: 32px 13px 45px;
          }

          .mp-card {
            padding: 27px 20px;
            border-radius: 20px;
          }

          .mp-tabs {
            margin-bottom: 31px;
          }

          .mp-tab {
            min-height: 45px;
            font-size: 13px;
          }

          .mp-card-title {
            font-size: 30px;
          }

          .mp-card-subtitle {
            font-size: 13px;
          }

          .mp-field {
            min-height: 52px;
          }

          .mp-field input {
            min-height: 50px;
          }

          .mp-submit {
            min-height: 53px;
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
        <header className="mp-brand">
          <LogoM size={65} />

          <div className="mp-brand-name">
            Marmopedras
          </div>

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
            <br className="hidden xl:block" />
            {" "}e a distribuição do seu estoque com mais
            <br className="hidden xl:block" />
            {" "}organização, segurança e eficiência.
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
        <div className="mp-stone-one" aria-hidden="true" />
        <div className="mp-stone-two" aria-hidden="true" />
        <div className="mp-stone-three" aria-hidden="true" />
        <div className="mp-wine-line" aria-hidden="true" />

        <div className="mp-card">
          <div className="mp-tabs" role="group" aria-label="Acesso">
            <button
              type="button"
              className={`mp-tab ${
                mode === "login" ? "active" : ""
              }`}
              aria-pressed={mode === "login"}
              onClick={() => changeMode("login")}
            >
              Entrar
            </button>

            <button
              type="button"
              className={`mp-tab ${
                mode === "register" ? "active" : ""
              }`}
              aria-pressed={mode === "register"}
              onClick={() => changeMode("register")}
            >
              Criar conta
            </button>
          </div>

          {mode === "login" && (
            <form onSubmit={handleLogin} className="mp-form">
              <div>
                <h1 className="mp-card-title">
                  Bem-vindo de volta
                </h1>

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
                  setLoginErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
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
                  setLoginErrors((prev) => ({
                    ...prev,
                    pw: "",
                  }));
                }}
                error={loginErrors.pw}
                right={
                  <EyeButton
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
                {loading
                  ? "Entrando..."
                  : "Entrar no sistema"}

                {!loading && (
                  <Icon name="arrow" size={20} />
                )}
              </button>
            </form>
          )}

          {mode === "register" && !registered && (
            <form
              onSubmit={handleRegister}
              className="mp-form"
            >
              <div>
                <h1 className="mp-card-title">
                  Criar conta
                </h1>

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
                  setRegErrors((prev) => ({
                    ...prev,
                    nome: "",
                  }));
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
                  setRegErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
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
                onChange={(event) =>
                  setRegCargo(event.target.value)
                }
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
                  setRegErrors((prev) => ({
                    ...prev,
                    pw: "",
                  }));
                }}
                error={regErrors.pw}
                right={
                  <EyeButton
                    visible={showPw}
                    onClick={() =>
                      setShowPw((prev) => !prev)
                    }
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
                  setRegErrors((prev) => ({
                    ...prev,
                    pw2: "",
                  }));
                }}
                error={regErrors.pw2}
                right={
                  <EyeButton
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
                {loading
                  ? "Cadastrando..."
                  : "Solicitar acesso"}

                {!loading && (
                  <Icon name="arrow" size={20} />
                )}
              </button>

              <p className="mp-terms">
                O cadastro está sujeito às regras de
                acesso da Marmopedras.
              </p>
            </form>
          )}

          {mode === "register" && registered && (
            <div className="mp-success" role="status">
              <div className="mp-success-icon">
                <IconCheck size={29} />
              </div>

              <h2 className="mp-card-title">
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
