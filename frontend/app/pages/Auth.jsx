
import { useState } from "react";
import { api } from "../api";
import { IconCheck } from "../components/Icons";

const LOGIN_BG = "/marmopedras-fundo-login.jpg";

function LogoM() {
  return (
    <div className="auth-logo-box">
      <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
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
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
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
    <div className="auth-field-group">
      <div className={`auth-field ${error ? "auth-field-error" : ""}`}>
        <span className="auth-field-icon">
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

        {right && <div className="auth-field-right">{right}</div>}
      </div>

      {error && <p className="auth-error">{error}</p>}
    </div>
  );
}

function EyeButton({ visible, onClick }) {
  return (
    <button
      type="button"
      className="auth-eye-button"
      onClick={onClick}
      aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
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
    <main
      className="marmopedras-login"
      style={{ "--login-bg": `url("${LOGIN_BG}")` }}
    >
      <style>{`
        .marmopedras-login {
          min-height: 100vh;
          min-height: 100dvh;
          display: grid;
          grid-template-columns: 49% 51%;
          background-image: var(--login-bg);
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          color: #2d1a1d;
          font-family: Arial, Helvetica, sans-serif;
        }

        .marmopedras-login,
        .marmopedras-login * {
          box-sizing: border-box;
        }

        .auth-left {
          min-width: 0;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(36px, 4vw, 64px);
          color: #fff9f3;
        }

        .auth-brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .auth-logo-box {
          width: 57px;
          height: 57px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: rgba(255, 255, 255, .09);
          border: 1px solid rgba(255, 255, 255, .08);
          margin-bottom: 8px;
        }

        .auth-brand-name {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(28px, 2.7vw, 37px);
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -.025em;
        }

        .auth-brand-tag {
          margin-top: 10px;
          font-size: 10px;
          letter-spacing: .2em;
          line-height: 1.6;
          color: rgba(255, 246, 240, .8);
        }

        .auth-powered {
          margin-top: 20px;
          font-size: 13px;
          color: rgba(255,255,255,.57);
        }

        .auth-powered strong {
          color: #f3e9df;
          letter-spacing: .07em;
          font-weight: 800;
        }

        .auth-hero {
          max-width: 585px;
          padding-top: 30px;
          padding-bottom: 30px;
        }

        .auth-accent-line {
          display: block;
          width: 45px;
          height: 2px;
          background: #d7b087;
          margin-bottom: 32px;
        }

        .auth-headline {
          margin: 0;
          max-width: 550px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(40px, 3.7vw, 61px);
          font-weight: 400;
          line-height: 1.06;
          letter-spacing: -.04em;
          color: #fff9f3;
        }

        .auth-description {
          margin-top: 25px;
          max-width: 475px;
          font-size: 16px;
          line-height: 1.75;
          color: rgba(255,249,245,.76);
        }

        .auth-features {
          display: grid;
          grid-template-columns: repeat(2, max-content);
          gap: 11px 12px;
          margin-top: 43px;
        }

        .auth-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 40px;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.2);
          background: rgba(255,255,255,.075);
          backdrop-filter: blur(7px);
          color: rgba(255,248,241,.9);
          font-size: 13px;
          white-space: nowrap;
        }

        .auth-feature-dot {
          width: 8px;
          height: 8px;
          flex: 0 0 8px;
          background: #e3c094;
          border-radius: 50%;
        }

        .auth-left-footer {
          font-size: 11px;
          color: rgba(255,255,255,.56);
        }

        .auth-right {
          min-width: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 42px;
        }

        .auth-card {
          width: 100%;
          max-width: 590px;
          padding: clamp(32px, 3.6vw, 56px);
          border-radius: 25px;
          border: 1px solid rgba(255,255,255,.92);
          background: rgba(255, 252, 247, .84);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 25px 70px rgba(61, 36, 28, .16);
        }

        .auth-tabs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 4px;
          padding: 4px;
          margin-bottom: 47px;
          background: rgba(226, 217, 209, .58);
          border-radius: 13px;
        }

        .auth-tab {
          min-height: 50px;
          border: none;
          border-radius: 10px;
          background: transparent;
          color: #7b6b68;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .auth-tab.active {
          background: linear-gradient(115deg, #681c26, #52131e);
          color: white;
          box-shadow: 0 5px 13px rgba(83, 22, 30, .2);
        }

        .auth-title {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(31px, 3vw, 42px);
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: -.04em;
          color: #2f171c;
        }

        .auth-subtitle {
          font-size: 15px;
          line-height: 1.6;
          color: #7c716d;
          margin-top: 9px;
          margin-bottom: 30px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .auth-field {
          width: 100%;
          min-height: 58px;
          display: flex;
          align-items: center;
          overflow: hidden;
          border-radius: 13px;
          border: 1px solid #e4dcd5;
          background: rgba(255,255,255,.88);
          box-shadow: 0 8px 18px rgba(51,35,29,.06);
          transition: border-color .2s, box-shadow .2s;
        }

        .auth-field:focus-within {
          border-color: #b48a83;
          box-shadow:
            0 0 0 3px rgba(90,30,42,.08),
            0 8px 18px rgba(51,35,29,.04);
        }

        .auth-field-error {
          border-color: #c65b65;
        }

        .auth-field-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          color: #9c8983;
          flex-shrink: 0;
        }

        .auth-field input {
          flex: 1;
          width: 100%;
          min-width: 0;
          min-height: 56px;
          padding: 12px 8px 12px 0;
          outline: none;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 14px;
          color: #302428;
        }

        .auth-field input::placeholder {
          color: #a49a94;
        }

        .auth-field input:-webkit-autofill,
        .auth-field input:-webkit-autofill:hover,
        .auth-field input:-webkit-autofill:focus {
          -webkit-box-shadow:
            0 0 0 1000px #fffdfa inset !important;
          -webkit-text-fill-color: #302428 !important;
          caret-color: #302428;
        }

        .auth-field-right {
          display: flex;
          align-items: center;
          padding-right: 12px;
        }

        .auth-eye-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 0;
          background: transparent;
          color: #9c8983;
          cursor: pointer;
        }

        .auth-eye-button:hover {
          color: #5a1d29;
        }

        .auth-error {
          color: #b84857;
          font-size: 12px;
          margin: 6px 0 0 5px;
        }

        .auth-submit {
          width: 100%;
          min-height: 58px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 13px;
          background: linear-gradient(110deg, #d1a67c, #b98b60);
          color: #fff;
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 17px rgba(125,81,50,.13);
          transition: transform .2s, box-shadow .2s;
        }

        .auth-submit svg {
          position: absolute;
          right: 22px;
        }

        .auth-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 22px rgba(125,81,50,.2);
        }

        .auth-submit:disabled {
          cursor: wait;
          opacity: .65;
        }

        .auth-select {
          width: 100%;
          min-height: 56px;
          padding: 0 15px;
          border: 1px solid #e4dcd5;
          border-radius: 13px;
          outline: none;
          background: rgba(255,255,255,.9);
          color: #302428;
          font-size: 14px;
        }

        .auth-select:focus {
          border-color: #b48a83;
        }

        .auth-note {
          font-size: 11px;
          line-height: 1.7;
          text-align: center;
          color: #958782;
        }

        .auth-card-footer {
          margin-top: 36px;
          padding-top: 22px;
          border-top: 1px solid rgba(194,181,173,.4);
          text-align: center;
          color: #968b86;
          font-size: 12px;
        }

        .auth-card-footer strong {
          font-weight: 800;
          letter-spacing: .07em;
          color: #37292b;
        }

        .auth-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 17px;
          padding: 24px 0;
          text-align: center;
        }

        .auth-success-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background: #f0e1d4;
          color: #7c4e48;
        }

        .auth-success p {
          font-size: 14px;
          line-height: 1.7;
          color: #817672;
        }

        @media (max-width: 1200px) {
          .marmopedras-login {
            grid-template-columns: 48% 52%;
          }

          .auth-left {
            padding: 35px;
          }

          .auth-headline {
            font-size: clamp(37px, 4vw, 50px);
          }

          .auth-features {
            gap: 9px;
          }

          .auth-feature {
            font-size: 11px;
            padding: 9px 11px;
          }

          .auth-right {
            padding: 30px;
          }

          .auth-card {
            padding: 35px;
          }
        }

        @media (max-width: 900px) {
          .marmopedras-login {
            display: flex;
            flex-direction: column;
            background-size: cover;
            background-position: center;
          }

          .auth-left {
            min-height: auto;
            padding: 35px 28px 45px;
            background: rgba(48,11,19,.5);
          }

          .auth-hero {
            padding: 60px 0 25px;
          }

          .auth-right {
            min-height: auto;
            padding: 50px 20px;
            background: rgba(245,238,228,.22);
          }

          .auth-card {
            max-width: 600px;
          }
        }

        @media (max-width: 540px) {
          .auth-left {
            padding: 28px 20px 35px;
          }

          .auth-brand-name {
            font-size: 29px;
          }

          .auth-brand-tag {
            font-size: 8px;
          }

          .auth-hero {
            padding-top: 45px;
          }

          .auth-headline {
            font-size: 36px;
          }

          .auth-description {
            font-size: 14px;
          }

          .auth-features {
            grid-template-columns: 1fr 1fr;
          }

          .auth-feature {
            white-space: normal;
            font-size: 11px;
          }

          .auth-right {
            padding: 35px 13px 50px;
          }

          .auth-card {
            padding: 28px 21px;
            border-radius: 20px;
          }

          .auth-tabs {
            margin-bottom: 32px;
          }

          .auth-tab {
            min-height: 45px;
            font-size: 13px;
          }

          .auth-title {
            font-size: 30px;
          }

          .auth-subtitle {
            font-size: 13px;
          }

          .auth-field,
          .auth-field input {
            min-height: 53px;
          }

          .auth-submit {
            min-height: 54px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marmopedras-login *,
          .marmopedras-login *::before,
          .marmopedras-login *::after {
            transition: none !important;
          }
        }
      `}</style>

      <section className="auth-left">
        <header className="auth-brand">
          <LogoM />

          <div className="auth-brand-name">
            Marmopedras
          </div>

          <div className="auth-brand-tag">
            PEDRAS QUE CONSTROEM HISTÓRIAS
          </div>

          <div className="auth-powered">
            powered by <strong>NEXT</strong>
          </div>
        </header>

        <div className="auth-hero">
          <span className="auth-accent-line" />

          <h2 className="auth-headline">
            Gestão completa
            <br />
            do estoque de
            <br />
            pedras naturais.
          </h2>

          <p className="auth-description">
            Gerencie entradas, saídas, transferências
            e distribuição de materiais com elegância
            e precisão.
          </p>

          <div className="auth-features">
            {[
              "Gestão de estoque",
              "Histórico completo",
              "Alertas de saldo",
              "Controle de movimentações",
            ].map((feature) => (
              <div key={feature} className="auth-feature">
                <span className="auth-feature-dot" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <footer className="auth-left-footer">
          © {new Date().getFullYear()} Marmopedras · NEXT
        </footer>
      </section>

      <section className="auth-right">
        <div className="auth-card">
          <div className="auth-tabs" role="group" aria-label="Acesso">
            <button
              type="button"
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              aria-pressed={mode === "login"}
              onClick={() => changeMode("login")}
            >
              Entrar
            </button>

            <button
              type="button"
              className={`auth-tab ${mode === "register" ? "active" : ""}`}
              aria-pressed={mode === "register"}
              onClick={() => changeMode("register")}
            >
              Criar conta
            </button>
          </div>

          {mode === "login" && (
            <form className="auth-form" onSubmit={handleLogin}>
              <div>
                <h1 className="auth-title">
                  Bem-vindo de volta
                </h1>

                <p className="auth-subtitle">
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
                    onClick={() => setShowPw((prev) => !prev)}
                  />
                }
              />

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar no sistema"}
                {!loading && <Icon name="arrow" size={20} />}
              </button>
            </form>
          )}

          {mode === "register" && !registered && (
            <form className="auth-form" onSubmit={handleRegister}>
              <div>
                <h1 className="auth-title">
                  Criar conta
                </h1>

                <p className="auth-subtitle">
                  Preencha seus dados para solicitar acesso
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
                className="auth-select"
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
                  setRegErrors((prev) => ({
                    ...prev,
                    pw2: "",
                  }));
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
                className="auth-submit"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Solicitar acesso"}
                {!loading && <Icon name="arrow" size={20} />}
              </button>

              <p className="auth-note">
                O cadastro está sujeito às regras de acesso da Marmopedras.
              </p>
            </form>
          )}

          {mode === "register" && registered && (
            <div className="auth-success" role="status">
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
