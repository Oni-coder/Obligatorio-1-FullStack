import axios from "axios";

export const traducirYResumirEjerciciosService = async (ejercicios) => {
  const API_KEY = process.env.GEMINI_25_API_KEY;

  const MODEL = "gemini-2.5-flash";

  const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

  const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": API_KEY,
  };

  const prompt = `
    Traducí estos ejercicios al español.

    IMPORTANTE:
    - Lenguaje claro y natural.
    - Explicaciones cortas.
    - Máximo 30 palabras.
    - Evitá lenguaje técnico innecesario.
    - No uses markdown.
    - No uses \`\`\`.
    - Respondé SOLO JSON válido.

    Formato exacto:

    [
      {
        "nombre": "Curl martillo",
        "descripcion": "Levantá las mancuernas con agarre neutro."
      }
    ]

    Ejercicios:
    ${JSON.stringify(ejercicios)}
    `;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const response = await axios.post(ENDPOINT, body, { headers });

  const texto = response.data.candidates[0].content.parts[0].text;

  return JSON.parse(texto);
};
