import { useState, useEffect, useRef } from "react";
import { Bot, RotateCcw } from "lucide-react";
import api from "../../api/axios";

const MUSCULOS = [
  { label: "Bíceps",         value: "biceps" },
  { label: "Tríceps",        value: "triceps" },
  { label: "Cuádriceps",     value: "quadriceps" },
  { label: "Isquiotibiales", value: "hamstrings" },
  { label: "Gemelos",        value: "calves" },
  { label: "Pecho",          value: "chest" },
  { label: "Espalda",        value: "lats" },
  { label: "Hombros",        value: "shoulders" },
  { label: "Abdominales",    value: "abdominals" },
  { label: "Glúteos",        value: "glutes" },
  { label: "Antebrazos",     value: "forearms" },
  { label: "Trapecio",       value: "traps" },
];

const formatResponse = (data) => {
  if (typeof data === "string") return data;
  if (Array.isArray(data)) {
    if (data.length === 0) return "No encontré ejercicios para ese músculo.";
    return data
      .slice(0, 5)
      .map((e) => {
        const nombre = e.nombre || e.name || "Ejercicio";
        const dif = e.difficulty ? ` · ${e.difficulty}` : "";
        const equipo = e.equipment ? ` · ${e.equipment}` : "";
        return `• ${nombre}${dif}${equipo}`;
      })
      .join("\n");
  }
  return "Respuesta recibida.";
};

const useTypewriter = (text, speed = 14) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) { setDisplayed(""); setDone(false); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text]);

  return { displayed, done };
};

const TypingDots = () => (
  <div className="ai-typing">
    <span /><span /><span />
  </div>
);

const AIAgentWidget = () => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rawResponse, setRawResponse] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const { displayed, done } = useTypewriter(rawResponse);

  const handleMusculo = async (musculo) => {
    if (loading) return;
    setSelected(musculo);
    setRawResponse("");
    setError("");
    setLoading(true);
    try {
      const { data } = await api.get(`/rutinas/musculos/${musculo.value}`);
      setRawResponse(formatResponse(data.data));
    } catch {
      setError("No pude obtener ejercicios en este momento. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelected(null);
    setRawResponse("");
    setError("");
    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayed, loading]);

  return (
    <div className="card ai-agent-card">
      <div className="ai-agent-header">
        <div className="ai-avatar">
          <Bot size={15} strokeWidth={1.8} color="#303030" />
        </div>
        <div>
          <h3 className="card-title">Asistente IA</h3>
          <p className="card-subtitle">entrenamiento personalizado</p>
        </div>
        {selected && (
          <button className="ai-reset-btn" onClick={handleReset} title="Preguntar de nuevo">
            <RotateCcw size={13} strokeWidth={2} />
          </button>
        )}
      </div>

      <div className="ai-chat">
        {/* Mensaje inicial del bot */}
        <div className="ai-message ai-message--bot">
          <div className="ai-bubble ai-bubble--bot">
            ¿Qué músculo quieres entrenar hoy?
          </div>
        </div>

        {/* Chips de músculos */}
        {!selected && (
          <div className="ai-muscles">
            {MUSCULOS.map((m) => (
              <button
                key={m.value}
                className="ai-muscle-chip"
                onClick={() => handleMusculo(m)}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}

        {/* Selección del usuario */}
        {selected && (
          <div className="ai-message ai-message--user">
            <div className="ai-bubble ai-bubble--user">
              Dame ejercicios para el {selected.label.toLowerCase()}
            </div>
          </div>
        )}

        {/* Typing / respuesta */}
        {loading && (
          <div className="ai-message ai-message--bot">
            <TypingDots />
          </div>
        )}

        {!loading && (rawResponse || error) && (
          <div className="ai-message ai-message--bot">
            <div className="ai-bubble ai-bubble--bot ai-bubble--response">
              {error || displayed.split("\n").map((line, i) => (
                <span key={i}>{line}{i < displayed.split("\n").length - 1 && <br />}</span>
              ))}
              {!done && !error && <span className="ai-cursor" />}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default AIAgentWidget;
