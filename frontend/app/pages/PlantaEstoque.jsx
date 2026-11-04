import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import "./PlantaEstoque.css";

const TAMANHO_MIN = { largura: 650, altura: 490 };

function criarCavalete(id) {
  return {
    id,
    nomeCustomizado: "",
    x: 40 + ((id - 1) % 4) * 130,
    y: 50 + Math.floor((id - 1) / 4) * 110,
    orientacao: "horizontal",
    anotacoes: "",
  };
}

export default function PlantaEstoque() {
  const [depositos, setDepositos] = useState(["A", "B", "C"]);
  const [deposito, setDeposito] = useState("A");
  const [plantas, setPlantas] = useState({ A: [], B: [], C: [] });
  const [tamanhos, setTamanhos] = useState({
    A: TAMANHO_MIN,
    B: TAMANHO_MIN,
    C: TAMANHO_MIN,
  });
  const [modalNovoDeposito, setModalNovoDeposito] = useState(false);
  const [nomeNovoDeposito, setNomeNovoDeposito] = useState("");
  const [selecionado, setSelecionado] = useState(null);
  const [carregado, setCarregado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);

  const [cavaleteTemporario, setCavaleteTemporario] = useState(null);

  const redimensionandoRef = useRef(false);

  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === "Escape") {
        setMenuAberto(false);
        setModalNovoDeposito(false);
      }
    };

    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, []);

  useEffect(() => {
    try {
      const dados = localStorage.getItem("marmopedras-planta");

      if (dados) {
        const salvos = JSON.parse(dados);
        const p = salvos.plantas || salvos;
        const t = salvos.tamanhos || {};

        setDepositos(
          Array.isArray(salvos.depositos) && salvos.depositos.length > 0
            ? salvos.depositos
            : ["A", "B", "C"]
        );

        setPlantas({
          A: p.A || [],
          B: p.B || [],
          C: p.C || [],
          ...p,
        });

        setTamanhos({
          A: t.A || TAMANHO_MIN,
          B: t.B || TAMANHO_MIN,
          C: t.C || TAMANHO_MIN,
          ...t,
        });
      }
    } catch {
      setMensagem("Não foi possível carregar a organização salva.");
    }

    setCarregado(true);
  }, []);

  const cavaletes = plantas[deposito] || [];
  const tamanho = tamanhos[deposito] || TAMANHO_MIN;
  const cavaleteSelecionado = cavaletes.find((c) => c.id === selecionado);

  useEffect(() => {
    if (cavaleteSelecionado && menuAberto) {
      setCavaleteTemporario({ ...cavaleteSelecionado });
    }
  }, [selecionado, menuAberto]);

  function adicionarDeposito() {
    let nome = nomeNovoDeposito.trim();

    if (!nome) {
      setMensagem("Digite um nome para o depósito.");
      return;
    }

    const existe = depositos.some(
      (d) => d.toLowerCase() === nome.toLowerCase()
    );

    if (existe) {
      setMensagem("Já existe um depósito com esse nome.");
      return;
    }

    setDepositos((anteriores) => [...anteriores, nome]);

    setPlantas((anteriores) => ({
      ...anteriores,
      [nome]: [],
    }));

    setTamanhos((anteriores) => ({
      ...anteriores,
      [nome]: { ...TAMANHO_MIN },
    }));

    setDeposito(nome);
    setSelecionado(null);
    setMenuAberto(false);
    setNomeNovoDeposito("");
    setModalNovoDeposito(false);
    setMensagem(`Depósito "${nome}" criado com sucesso!`);
  }

  function atualizarCavaletes(novos) {
    setPlantas((anterior) => ({
      ...anterior,
      [deposito]: novos,
    }));

    setMensagem("");
  }

  function adicionar() {
    const proximoId = Math.max(0, ...cavaletes.map((c) => c.id)) + 1;
    const novoCavalete = criarCavalete(proximoId);

    atualizarCavaletes([...cavaletes, novoCavalete]);

    const quantidadeLinhas = Math.ceil(proximoId / 4);

    const alturaNecessaria = Math.max(
      TAMANHO_MIN.altura,
      50 + quantidadeLinhas * 110
    );

    setTamanhos((anterior) => ({
      ...anterior,
      [deposito]: {
        ...anterior[deposito],
        altura: Math.max(
          anterior[deposito]?.altura || TAMANHO_MIN.altura,
          alturaNecessaria
        ),
      },
    }));

    setSelecionado(proximoId);
    setCavaleteTemporario(novoCavalete);
    setMenuAberto(true);
  }

  function girar() {
    if (selecionado === null) return;

    atualizarCavaletes(
      cavaletes.map((c) =>
        c.id === selecionado
          ? {
              ...c,
              orientacao:
                c.orientacao === "horizontal" ? "vertical" : "horizontal",
            }
          : c
      )
    );
  }

  function excluir() {
    if (selecionado === null) return;

    atualizarCavaletes(cavaletes.filter((c) => c.id !== selecionado));
    setSelecionado(null);
    setMenuAberto(false);
  }

  function mover(id, x, y) {
    atualizarCavaletes(
      cavaletes.map((c) => (c.id === id ? { ...c, x, y } : c))
    );
  }

  function salvarEdicaoCavalete() {
    if (!cavaleteTemporario) return;

    atualizarCavaletes(
      cavaletes.map((c) =>
        c.id === cavaleteTemporario.id ? cavaleteTemporario : c
      )
    );

    setMenuAberto(false);
    setMensagem("Alterações do cavalete aplicadas!");
  }

  function salvar() {
    localStorage.setItem(
      "marmopedras-planta",
      JSON.stringify({
        depositos,
        plantas,
        tamanhos,
      })
    );

    setMensagem("Organização salva neste navegador!");
  }

  function calcularAlturaMinima() {
    const maiorPosicao = cavaletes.reduce((maior, c) => {
      const altura = c.orientacao === "vertical" ? 100 : 36;
      return Math.max(maior, c.y + altura);
    }, 0);

    return Math.max(TAMANHO_MIN.altura, maiorPosicao + 20);
  }

  if (!carregado) return <main>Carregando planta...</main>;

  const nomeExibicaoDeposito = deposito.toLowerCase().startsWith("depósito")
    ? deposito
    : `Depósito ${deposito}`;

  return (
    <main className="pagina">
      <section className="painel">
        <div className="barra">
          <div className="depositos">
            {depositos.map((nome) => {
              const textoBotao = nome.toLowerCase().startsWith("depósito")
                ? nome
                : `Depósito ${nome}`;

              return (
                <button
                  key={nome}
                  className={deposito === nome ? "ativo" : ""}
                  onClick={() => {
                    setDeposito(nome);
                    setSelecionado(null);
                    setMenuAberto(false);
                    setMensagem("");
                  }}
                >
                  {textoBotao}
                </button>
              );
            })}

            <button
              className="adicionar-deposito"
              onClick={() => {
                setNomeNovoDeposito("");
                setModalNovoDeposito(true);
                setMensagem("");
              }}
            >
              + Gerenciar / Adicionar depósito
            </button>
          </div>

          <div className="acoes">
            <button onClick={adicionar}>+ Adicionar cavalete</button>

            <button onClick={girar} disabled={selecionado === null}>
              Girar 90°
            </button>

            <button
              onClick={excluir}
              disabled={selecionado === null}
              className="excluir"
            >
              Excluir
            </button>

            <button onClick={salvar} className="salvar">
              Salvar organização
            </button>
          </div>
        </div>

        {modalNovoDeposito &&
          createPortal(
            <div
              className="menu-fundo"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setModalNovoDeposito(false)}
            >
              <div
                className="menu-cavalete"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="menu-cavalete-topo">
                  <div>
                    <span className="menu-etiqueta">GERENCIAR ESPAÇO</span>
                    <h2>
                      Depósitos
                      <small> · Adicionar ou Remover</small>
                    </h2>
                  </div>

                  <button
                    className="menu-fechar"
                    onClick={() => setModalNovoDeposito(false)}
                    aria-label="Fechar"
                  >
                    ✕
                  </button>
                </div>

                <div className="menu-corpo">
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#665",
                      fontWeight: "bold",
                    }}
                  >
                    Criar novo depósito:
                  </p>

                  <input
                    autoFocus
                    type="text"
                    value={nomeNovoDeposito}
                    onChange={(e) => setNomeNovoDeposito(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") adicionarDeposito();
                      if (e.key === "Escape") setModalNovoDeposito(false);
                    }}
                    placeholder="Ex.: A, B ou Depósito de Granitos"
                    maxLength={40}
                    style={{
                      width: "100%",
                      border: "1px solid #ddd4d5",
                      borderRadius: "10px",
                      padding: "12px",
                      fontFamily: "inherit",
                      fontSize: "14px",
                      color: "#33262b",
                      background: "#fbf9f7",
                      outline: "none",
                    }}
                  />

                  {depositos.length > 0 && (
                    <div
                      style={{
                        marginTop: "15px",
                        borderTop: "1px solid #eee",
                        paddingTop: "15px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "13px",
                          color: "#a33e4b",
                          fontWeight: "bold",
                        }}
                      >
                        Gerenciar ou excluir depósitos existentes:
                      </p>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                          maxHeight: "150px",
                          overflowY: "auto",
                        }}
                      >
                        {depositos.map((d) => {
                          const nomeFormatado = d
                            .toLowerCase()
                            .startsWith("depósito")
                            ? d
                            : `Depósito ${d}`;

                          return (
                            <div
                              key={d}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: "#f7f4f0",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                border: "1px solid #eae2df",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  color: "#33262b",
                                }}
                              >
                                {nomeFormatado}
                              </span>

                              <button
                                className="excluir"
                                disabled={depositos.length <= 1}
                                title={
                                  depositos.length <= 1
                                    ? "Você precisa manter pelo menos um depósito"
                                    : "Excluir depósito"
                                }
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "11px",
                                }}
                                onClick={() => {
                                  if (depositos.length <= 1) {
                                    setMensagem(
                                      "Você precisa ter pelo menos um depósito."
                                    );
                                    return;
                                  }

                                  if (
                                    confirm(
                                      `Deseja realmente excluir o "${nomeFormatado}" e todos os seus cavaletes?`
                                    )
                                  ) {
                                    const novosDepositos = depositos.filter(
                                      (dep) => dep !== d
                                    );

                                    const proximoDeposito = novosDepositos[0];

                                    const novasPlantas = { ...plantas };
                                    delete novasPlantas[d];

                                    const novosTamanhos = { ...tamanhos };
                                    delete novosTamanhos[d];

                                    setDepositos(novosDepositos);
                                    setPlantas(novasPlantas);
                                    setTamanhos(novosTamanhos);
                                    setDeposito(proximoDeposito);
                                    setSelecionado(null);
                                    setModalNovoDeposito(false);
                                    setMensagem(
                                      "Depósito excluído com sucesso."
                                    );
                                  }
                                }}
                              >
                                Excluir
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div
                    className="menu-cavalete-acoes"
                    style={{ marginTop: "10px" }}
                  >
                    <button onClick={() => setModalNovoDeposito(false)}>
                      Cancelar
                    </button>

                    <button
                      className="salvar"
                      onClick={adicionarDeposito}
                    >
                      Criar depósito
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}

        <div className="planta-wrapper">
          <div
            className="planta"
            style={{
              width: tamanho.largura,
              height: tamanho.altura,
              position: "relative",
            }}
          >
            <span className="nome-deposito">
              {nomeExibicaoDeposito.toUpperCase()}
            </span>

            {cavaletes.map((c) => {
              const nomeExibicaoCavalete = c.nomeCustomizado
                ? c.nomeCustomizado
                : `CV-${String(c.id).padStart(2, "0")}`;

              return (
                <div
                  key={c.id}
                  className={`cavalete ${
                    selecionado === c.id ? "selecionado" : ""
                  } ${c.orientacao} ${c.anotacoes ? "com-nota" : ""}`}
                  style={{ left: c.x, top: c.y }}
                  onPointerDown={(e) => {
                    if (redimensionandoRef.current) return;

                    e.preventDefault();
                    setSelecionado(c.id);

                    const elemento = e.currentTarget;
                    const area = elemento.parentElement;
                    const areaRect = area.getBoundingClientRect();
                    const itemRect = elemento.getBoundingClientRect();

                    const offsetX = e.clientX - itemRect.left;
                    const offsetY = e.clientY - itemRect.top;

                    elemento.setPointerCapture(e.pointerId);

                    const inicioX = e.clientX;
                    const inicioY = e.clientY;
                    let moveu = false;

                    const moverPonteiro = (evento) => {
                      if (
                        Math.abs(evento.clientX - inicioX) > 4 ||
                        Math.abs(evento.clientY - inicioY) > 4
                      ) {
                        moveu = true;
                      }

                      const largura = elemento.offsetWidth;
                      const altura = elemento.offsetHeight;

                      const x = Math.max(
                        0,
                        Math.min(
                          evento.clientX - areaRect.left - offsetX,
                          area.clientWidth - largura
                        )
                      );

                      const y = Math.max(
                        0,
                        Math.min(
                          evento.clientY - areaRect.top - offsetY,
                          area.clientHeight - altura
                        )
                      );

                      elemento.style.left = `${x}px`;
                      elemento.style.top = `${y}px`;
                    };

                    const finalizar = () => {
                      if (moveu) {
                        mover(
                          c.id,
                          parseFloat(elemento.style.left),
                          parseFloat(elemento.style.top)
                        );
                      } else {
                        setMenuAberto(true);
                      }

                      elemento.removeEventListener(
                        "pointermove",
                        moverPonteiro
                      );
                      elemento.removeEventListener("pointerup", finalizar);
                      elemento.removeEventListener(
                        "pointercancel",
                        finalizar
                      );
                    };

                    elemento.addEventListener("pointermove", moverPonteiro);
                    elemento.addEventListener("pointerup", finalizar);
                    elemento.addEventListener(
                      "pointercancel",
                      finalizar
                    );
                  }}
                >
                  {nomeExibicaoCavalete}
                </div>
              );
            })}

            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: "28px",
                height: "28px",
                cursor: "nwse-resize",
                zIndex: 10,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                padding: "4px",
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                redimensionandoRef.current = true;

                const inicioX = e.clientX;
                const inicioY = e.clientY;
                const larguraInicial = tamanho.largura;
                const alturaInicial = tamanho.altura;

                const redimensionarPonteiro = (evento) => {
                  const deltaX = evento.clientX - inicioX;
                  const deltaY = evento.clientY - inicioY;

                  const novaLargura = Math.max(
                    650,
                    Math.min(4000, larguraInicial + deltaX * 1.8)
                  );

                  const alturaMinima = calcularAlturaMinima();

                  const novaAltura = Math.max(
                    alturaMinima,
                    Math.min(1800, alturaInicial + deltaY * 0.7)
                  );

                  setTamanhos((anterior) => ({
                    ...anterior,
                    [deposito]: {
                      largura: Math.round(novaLargura),
                      altura: Math.round(novaAltura),
                    },
                  }));
                };

                const pararRedimensionamento = () => {
                  redimensionandoRef.current = false;

                  window.removeEventListener(
                    "pointermove",
                    redimensionarPonteiro
                  );
                  window.removeEventListener(
                    "pointerup",
                    pararRedimensionamento
                  );
                };

                window.addEventListener("pointermove", redimensionarPonteiro);
                window.addEventListener("pointerup", pararRedimensionamento);
              }}
              title="Arraste para expandir (mais para o lado e pouco para baixo)"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="#a48b79"
              >
                <path d="M14 14H4L14 4V14Z" opacity="0.8" />
                <path d="M12 8L14 10L12 12V8Z" />
                <path d="M8 12L10 14L12 12H8Z" />
              </svg>
            </div>
          </div>
        </div>

        {cavaleteTemporario &&
          menuAberto &&
          createPortal(
            <div
              className="menu-fundo"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setMenuAberto(false)}
            >
              <div
                className="menu-cavalete"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="menu-cavalete-topo">
                  <div>
                    <span className="menu-etiqueta">EDITAR CAVALETE</span>
                    <h2>
                      {cavaleteTemporario.nomeCustomizado ||
                        `CV-${String(cavaleteTemporario.id).padStart(2, "0")}`}
                      <small> · {nomeExibicaoDeposito}</small>
                    </h2>
                  </div>

                  <button
                    className="menu-fechar"
                    onClick={() => setMenuAberto(false)}
                    aria-label="Fechar"
                  >
                    ✕
                  </button>
                </div>

                <div className="menu-corpo">
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#665",
                        marginBottom: "6px",
                      }}
                    >
                      Nome / Identificação do Cavalete:
                    </label>

                    <input
                      type="text"
                      value={cavaleteTemporario.nomeCustomizado || ""}
                      onChange={(e) =>
                        setCavaleteTemporario({
                          ...cavaleteTemporario,
                          nomeCustomizado: e.target.value,
                        })
                      }
                      placeholder={`Ex.: CV-${String(
                        cavaleteTemporario.id
                      ).padStart(2, "0")} ou Bloco 01`}
                      maxLength={20}
                      style={{
                        width: "100%",
                        border: "1px solid #ddd4d5",
                        borderRadius: "10px",
                        padding: "10px 12px",
                        fontFamily: "inherit",
                        fontSize: "14px",
                        color: "#33262b",
                        background: "#fbf9f7",
                        outline: "none",
                        marginBottom: "12px",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#665",
                        marginBottom: "6px",
                      }}
                    >
                      Anotações:
                    </label>

                    <textarea
                      value={cavaleteTemporario.anotacoes || ""}
                      onChange={(e) =>
                        setCavaleteTemporario({
                          ...cavaleteTemporario,
                          anotacoes: e.target.value,
                        })
                      }
                      placeholder="Digite aqui as anotações deste cavalete (ex.: tipo de pedra, lote, quantidade de chapas...)"
                      rows={5}
                    />
                  </div>

                  <div className="menu-cavalete-acoes">
                    <button onClick={() => setMenuAberto(false)}>
                      Fechar
                    </button>

                    <button
                      className="salvar"
                      onClick={salvarEdicaoCavalete}
                    >
                      Salvar e fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}

        <footer className="rodape">
          <span>
            {cavaletes.length} cavalete(s) em {nomeExibicaoDeposito} (
            {tamanho.largura} × {tamanho.altura}px)
          </span>

          <span>
            Arraste o canto inferior direito para expandir (mais para os lados).
          </span>
        </footer>

        {mensagem && <p className="mensagem">{mensagem}</p>}
      </section>
    </main>
  );
}
