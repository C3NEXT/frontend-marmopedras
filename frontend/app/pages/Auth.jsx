
import { useState } from "react";
import { api } from "../api";
import { IconCheck } from "../components/Icons";

const MARBLE_BG =
  "https://images.unsplash.com/photo-1770065805058-3bfed55e23ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400";

const COLORS = {
  wine: "#581e2b",
  wineDark: "#38111b",
  wineLight: "#783747",
  gold: "#b99067",
  cream: "#faf7f2",
  background: "#f6f1eb",
  text: "#35272a",
  muted: "#867d7a",
  border: "#e9dfd6",
};

function LogoM({ size = 54 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 52V10L21 31L32 13L43 31L58 10V52"
        stroke={COLORS.wine}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 52V34L21 42L32 25L43 42L49 34V52"
        stroke={COLORS.gold}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 10L15 15M58 10L49 15"
        stroke={COLORS.gold}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
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
    box: (
      <>
        <path d="m12 2 9 5-9 5-9-5 9-5Z" />
        <path d="M3 7v10l9 5 9-5V7M12 12v10" />
      </>
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" />
        <path d="M3 3v5h5M12 7v5l3 2" />
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

function FeatureCard({ icon, title, description }) {
  return (
    <div className="auth-feature">
      <div className="auth-feature-icon">
        <Icon name={icon} size={21} />
      </div>

      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function FieldInput({
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
    <div className="auth-field-wrapper">
      <div
        className={`auth-input-box ${
          error ? "auth-input-error" : ""
        }`}
      >
        <span className="auth-input-icon">
          <Icon name={icon} />
        </span>

        <input
          type={type}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-invalid={Boolean(error)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
        />

        {right && (
          <div className="auth-input-right">
            {right}
          </div>
        )}
      </div>

      {error && (
        <p className="auth-error">{error}</p>
      )}
    </div>
  );
}

function PasswordToggle({ visible, onClick }) {
  return (
    <button
      type="button"
      className="auth-password-toggle"
      onClick={onClick}
      aria-label={
        visible ? "Ocultar senha" : "Mostrar senha"
      }
      aria-pressed={visible}
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

  const [loading, setLoading] = useState(false);

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
              email:
                err.message || "Erro ao cadastrar",
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
    <main className="marmopedras-auth">
      <style>{`
        .marmopedras-auth {
          min-height: 100vh;
          min-height: 100dvh;
          display: grid;
          grid-template-columns: minmax(0, 52%) minmax(0, 48%);
          background: ${COLORS.background};
          color: ${COLORS.text};
          font-family: inherit;
        }

        .marmopedras-auth * {
          box-sizing: border-box;
        }

        .auth-left {
          position: relative;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
          min-height: 100vh;
          padding: clamp(32px, 4.2vw, 76px);
          overflow: hidden;
          background:
            linear-gradient(
              125deg,
              rgba(255, 253, 249, .96),
              rgba(250, 246, 240, .90)
            ),
            url("${MARBLE_BG}") center/cover;
        }

        .auth-left::before {
          content: "";
          position: absolute;
          z-index: -1;
          inset: 0;
          background:
            linear-gradient(
              130deg,
              transparent 50%,
              rgba(150, 115, 95, .065) 51%,
              transparent 53%
            ),
            radial-gradient(
              ellipse at 100% 80%,
              rgba(179, 143, 111, .13),
              transparent 55%
            );
          pointer-events: none;
        }

        .auth-brand {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .auth-brand-name {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(25px, 2.2vw, 34px);
          font-weight: 600;
          letter-spacing: -.045em;
          line-height: 1;
          color: ${COLORS.wine};
        }

        .auth-brand-tag {
          margin-top: 9px;
          font-size: 9px;
          line-height: 1.5;
          letter-spacing: .19em;
          font-weight: 600;
          color: #967f76;
        }

        .auth-powered {
          margin-top: 14px;
          font-size: 11px;
          color: #9e928b;
          letter-spacing: .04em;
        }

        .auth-powered strong {
          color: ${COLORS.wine};
          font-weight: 800;
          letter-spacing: .12em;
        }

        .auth-hero {
          max-width: 660px;
          padding-top: 48px;
          padding-bottom: 32px;
        }

        .auth-accent {
          width: 56px;
          height: 3px;
          margin-bottom: 28px;
          border-radius: 20px;
          background: linear-gradient(
            90deg,
            ${COLORS.wine},
            ${COLORS.gold}
          );
        }

        .auth-headline {
          max-width: 650px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(39px, 3.55vw, 66px);
          line-height: 1.11;
          letter-spacing: -.045em;
          font-weight: 500;
          color: ${COLORS.wineDark};
        }

        .auth-description {
          margin-top: 25px;
          max-width: 495px;
          font-size: 15px;
          line-height: 1.85;
          color: #776c67;
        }

        .auth-features {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
          margin-top: 40px;
          max-width: 635px;
        }

        .auth-feature {
          min-width: 0;
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 16px;
          border-radius: 15px;
          border: 1px solid rgba(112, 77, 60, .1);
          background: rgba(255, 255, 255, .72);
          box-shadow: 0 8px 26px rgba(76, 44, 33, .045);
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .auth-feature:hover {
          transform: translateY(-3px);
          box-shadow:
            0 12px 30px rgba(76, 44, 33, .09);
        }

        .auth-feature-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: #f1e6dd;
          color: ${COLORS.wine};
        }

        .auth-feature h3 {
          margin: 1px 0 5px;
          font-size: 12px;
          line-height: 1.4;
          font-weight: 700;
          color: ${COLORS.wineDark};
        }

        .auth-feature p {
          font-size: 11px;
          line-height: 1.55;
          color: #958b84;
        }

        .auth-left-footer {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 35px;
          color: #98887c;
          font-size: 10px;
          letter-spacing: .2em;
          font-weight: 700;
        }

        .auth-left-footer::before {
          content: "";
          width: 36px;
          height: 1px;
          background: ${COLORS.gold};
        }

        .auth-right {
          position: relative;
          isolation: isolate;
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 30px;
          background:
            linear-gradient(
              140deg,
              rgba(91, 35, 48, .88),
              rgba(54, 16, 27, .92)
            ),
            url("${MARBLE_BG}") center/cover;
          overflow: hidden;
        }

        .auth-right::before {
          content: "";
          position: absolute;
          z-index: -1;
          inset: 0;
          background:
            linear-gradient(
              155deg,
              transparent 18%,
              rgba(234, 198, 171, .14) 18.15%,
              transparent 18.4%,
              transparent 79%,
              rgba(234, 198, 171, .13) 79.2%,
              transparent 79.5%
            ),
            radial-gradient(
              circle at 90% 15%,
              rgba(207, 160, 123, .24),
              transparent 45%
            );
        }

        .auth-right::after {
          content: "";
          position: absolute;
          width: 60%;
          height: 65%;
          top: -30%;
          right: -30%;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 50%;
          pointer-events: none;
        }

        .auth-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 475px;
          padding: clamp(26px, 3.1vw, 45px);
          background:
            linear-gradient(
              145deg,
              rgba(255, 253, 249, .98),
              rgba(249, 245, 239, .96)
            );
          border: 1px solid rgba(255,255,255,.85);
          border-radius: 25px;
          box-shadow:
            0 28px 85px rgba(29, 7, 13, .31),
            0 6px 20px rgba(29, 7, 13, .12);
        }

        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px;
          padding: 5px;
          margin-bottom: 36px;
          background: #eee7df;
          border-radius: 13px;
        }

        .auth-tab {
          min-height: 43px;
          padding: 9px;
          border: 0;
          border-radius: 10px;
          background: transparent;
          color: #80716e;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all .2s ease;
        }

        .auth-tab.active {
          color: white;
          background: linear-gradient(
            125deg,
            ${COLORS.wine},
            ${COLORS.wineLight}
          );
          box-shadow:
            0 4px 12px rgba(88, 30, 43, .21);
        }

        .auth-title {
          font-family: Georgia, "Times New Roman", serif;
          color: ${COLORS.wineDark};
          font-size: clamp(27px, 2.5vw, 35px);
          font-weight: 600;
          letter-spacing: -.035em;
          line-height: 1.2;
        }

        .auth-subtitle {
          margin-top: 8px;
          margin-bottom: 29px;
          font-size: 13px;
          line-height: 1.6;
          color: ${COLORS.muted};
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .auth-field-wrapper {
          min-width: 0;
        }

        .auth-input-box {
          display: flex;
          align-items: center;
          min-height: 53px;
          border: 1px solid #e5dad1;
          border-radius: 12px;
          background: rgba(255,255,255,.9);
          transition:
            border-color .2s,
            box-shadow .2s;
        }

        .auth-input-box:focus-within {
          border-color: ${COLORS.wineLight};
          box-shadow:
            0 0 0 3px rgba(88,30,43,.08);
        }

        .auth-input-box.auth-input-error {
          border-color: #c76565;
        }

        .auth-input-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 16px;
          padding-right: 11px;
          color: #aa9185;
        }

        .auth-input-box input {
          flex: 1;
          min-width: 0;
          min-height: 51px;
          padding: 10px 8px 10px 0;
          background: transparent;
          border: none;
          outline: none;
          color: ${COLORS.text};
          font-size: 13px;
        }

        .auth-input-box input::placeholder {
          color: #aa9e97;
        }

        .auth-input-right {
          display: flex;
          align-items: center;
          padding-right: 12px;
        }

        .auth-password-toggle {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 35px;
          height: 35px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #947d76;
          cursor: pointer;
        }

        .auth-password-toggle:hover {
          background: #f4ece6;
          color: ${COLORS.wine};
        }

        .auth-error {
          margin-top: 6px;
          padding-left: 5px;
          color: #bf4c4c;
          font-size: 11px;
        }

        .auth-forgot-wrapper {
          display: flex;
          justify-content: flex-end;
          margin-top: -4px;
        }

        .auth-forgot-password {
          border: none;
          background: transparent;
          color: #8e5360;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 0;
          cursor: not-allowed;
          opacity: .75;
        }

        .auth-select {
          width: 100%;
          min-height: 53px;
          padding: 0 14px;
          border: 1px solid #e5dad1;
          border-radius: 12px;
          background: white;
          color: ${COLORS.text};
          font-size: 13px;
          outline: none;
        }

        .auth-select:focus {
          border-color: ${COLORS.wineLight};
          box-shadow:
            0 0 0 3px rgba(88,30,43,.08);
        }

        .auth-submit {
          width: 100%;
          min-height: 53px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 10px;
          padding: 13px 16px;
          border: none;
          border-radius: 12px;
          color: white;
          background: linear-gradient(
            115deg,
            ${COLORS.wine},
            ${COLORS.wineLight}
          );
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow:
            0 9px 19px rgba(88,30,43,.19);
          transition:
            transform .2s,
            box-shadow .2s;
        }

        .auth-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 13px 24px rgba(88,30,43,.26);
        }

        .auth-submit:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .auth-form-note {
          margin-top: 4px;
          font-size: 11px;
          line-height: 1.7;
          color: #958781;
          text-align: center;
        }

        .auth-card-footer {
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid ${COLORS.border};
          color: #a79a91;
          text-align: center;
          font-size: 11px;
        }

        .auth-card-footer strong {
          color: ${COLORS.wine};
          letter-spacing: .13em;
        }

        .auth-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 18px 0;
          text-align: center;
        }

        .auth-success-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #f1e6dc;
          color: ${COLORS.wine};
        }

        .auth-success p {
          color: ${COLORS.muted};
          font-size: 13px;
          line-height: 1.7;
        }

        @media (max-width: 1200px) {
          .marmopedras-auth {
            grid-template-columns:
              minmax(0, 50%) minmax(0, 50%);
          }

          .auth-left {
            padding: 32px;
          }

          .auth-headline {
            font-size: clamp(35px, 3.5vw, 48px);
          }

          .auth-features {
            gap: 9px;
          }

          .auth-feature {
            padding: 12px;
            gap: 9px;
          }

          .auth-feature-icon {
            width: 33px;
            height: 33px;
            flex-basis: 33px;
          }

          .auth-right {
            padding: 28px;
          }
        }

        @media (max-width: 900px) {
          .marmopedras-auth {
            display: block;
          }

          .auth-left {
            min-height: auto;
            padding: 35px 28px 38px;
          }

          .auth-brand {
            margin-bottom: 35px;
          }

          .auth-hero {
            padding: 0;
            max-width: 700px;
          }

          .auth-headline {
            max-width: 600px;
            font-size: clamp(36px, 5vw, 49px);
          }

          .auth-description {
            margin-top: 17px;
          }

          .auth-features {
            margin-top: 26px;
            max-width: 700px;
          }

          .auth-left-footer {
            margin-top: 28px;
          }

          .auth-right {
            min-height: auto;
            padding: 48px 22px;
          }

          .auth-card {
            max-width: 530px;
          }
        }

        @media (max-width: 540px) {
          .auth-left {
            padding: 25px 20px 30px;
          }

          .auth-brand-name {
            font-size: 27px;
          }

          .auth-brand-tag {
            font-size: 8px;
          }

          .auth-headline {
            font-size: clamp(32px, 8vw, 42px);
          }

          .auth-description {
            font-size: 13px;
          }

          .auth-features {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .auth-feature {
            flex-direction: column;
            padding: 13px;
          }

          .auth-feature h3 {
            font-size: 11px;
          }

          .auth-feature p {
            font-size: 10px;
          }

          .auth-left-footer {
            font-size: 9px;
          }

          .auth-right {
            padding: 30px 15px 42px;
          }

          .auth-card {
            padding: 25px 20px;
            border-radius: 19px;
          }

          .auth-tabs {
            margin-bottom: 28px;
          }

          .auth-title {
            font-size: 29px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marmopedras-auth *,
          .marmopedras-auth *::before,
          .marmopedras-auth *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <section className="auth-left">
        <header>
          <div className="auth-brand">
            <LogoM size={58} />

            <div>
              <div className="auth-brand-name">
                Marmopedras
              </div>

              <div className="auth-brand-tag">
                PEDRAS QUE CONSTROEM HISTÓRIAS
              </div>
            </div>
          </div>

          <div className="auth-powered">
            powered by <strong>NEXT</strong>
          </div>
        </header>

        <div className="auth-hero">
          <div className="auth-accent" />

          <h2 className="auth-headline">
            Controle e sofisticação para o estoque de pedras.
          </h2>

          <p className="auth-description">
            Gerencie entradas, saídas, transferências e a
            distribuição do seu estoque com mais organização,
            segurança e eficiência.
          </p>

          <div className="auth-features">
            <FeatureCard
              icon="box"
              title="Gestão de estoque"
              description="Visualize e organize seus materiais"
            />

            <FeatureCard
              icon="history"
              title="Histórico completo"
              description="Acompanhe todas as movimentações"
            />

            <FeatureCard
              icon="bell"
              title="Alertas de saldo"
              description="Evite a falta de materiais no estoque"
            />

            <FeatureCard
              icon="transfer"
              title="Controle de movimentações"
              description="Entradas, saídas e transferências"
            />
          </div>
        </div>

        <footer className="auth-left-footer">
          QUALIDADE EM CADA DETALHE
        </footer>
      </section>

      <section className="auth-right">
        <div className="auth-card">
          <div
            className="auth-tabs"
            role="group"
            aria-label="Acesso"
          >
            <button
              type="button"
              onClick={() => changeMode("login")}
              className={`auth-tab ${
                mode === "login" ? "active" : ""
              }`}
              aria-pressed={mode === "login"}
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={() => changeMode("register")}
              className={`auth-tab ${
                mode === "register" ? "active" : ""
              }`}
              aria-pressed={mode === "register"}
            >
              Criar conta
            </button>
          </div>

          {mode === "login" && (
            <form
              onSubmit={handleLogin}
              className="auth-form"
            >
              <div>
                <h1 className="auth-title">
                  Bem-vindo de volta
                </h1>

                <p className="auth-subtitle">
                  Acesse sua conta Marmopedras
                </p>
              </div>

              <FieldInput
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

              <FieldInput
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
                  <PasswordToggle
                    visible={showPw}
                    onClick={() =>
                      setShowPw((prev) => !prev)
                    }
                  />
                }
              />

              <div className="auth-forgot-wrapper">
                <button
                  type="button"
                  className="auth-forgot-password"
                  disabled
                  title="Recuperação de senha em desenvolvimento"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Entrando..."
                  : "Entrar no sistema"}

                {!loading && (
                  <Icon name="arrow" size={18} />
                )}
              </button>
            </form>
          )}

          {mode === "register" && !registered && (
            <form
              onSubmit={handleRegister}
              className="auth-form"
            >
              <div>
                <h1 className="auth-title">
                  Criar conta
                </h1>

                <p className="auth-subtitle">
                  Preencha seus dados para solicitar acesso
                </p>
              </div>

              <FieldInput
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

              <FieldInput
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

              <FieldInput
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
                className="auth-select"
                aria-label="Cargo"
                value={regCargo}
                onChange={(e) =>
                  setRegCargo(e.target.value)
                }
              >
                <option value="">
                  Selecione seu cargo
                </option>

                {cargos.map((cargo) => (
                  <option key={cargo} value={cargo}>
                    {cargo}
                  </option>
                ))}
              </select>

              <FieldInput
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
                  <PasswordToggle
                    visible={showPw}
                    onClick={() =>
                      setShowPw((prev) => !prev)
                    }
                  />
                }
              />

              <FieldInput
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
                  <PasswordToggle
                    visible={showPw2}
                    onClick={() =>
                      setShowPw2((prev) => !prev)
                    }
                  />
                }
              />

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Cadastrando..."
                  : "Solicitar acesso"}

                {!loading && (
                  <Icon name="arrow" size={18} />
                )}
              </button>

              <p className="auth-form-note">
                O cadastro está sujeito às regras de
                acesso da Marmopedras.
              </p>
            </form>
          )}

          {mode === "register" && registered && (
            <div
              className="auth-success"
              role="status"
            >
              <div className="auth-success-icon">
                <IconCheck size={28} />
              </div>

              <h2 className="auth-title">
                Conta criada!
              </h2>

              <p>
                Seu cadastro foi realizado com sucesso.
                <br />
                Redirecionando para o login...
              </p>
            </div>
          )}

          <footer className="auth-card-footer">
            powered by <strong>NEXT</strong>
          </footer>
        </div>
      </section>
    </main>
  );
}
