import axios from "axios";

export const traducirYResumirEjerciciosService = async (ejercicios) => {

    const API_KEY = process.env.GEMINI_25_API_KEY;

    const MODEL = "gemini-2.5-flash";

    const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

    const headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY
    };

    const prompt = `
    Traducí al español y resumí cada ejercicio en máximo 50 palabras.

    Devolver formateado en parrafos.

    Ejemplo:
    [
      {
        "nombre": "Press banca",
        "descripcion": "Empujar barra acostado para trabajar pecho"
      }
    ]

    Ejercicios:
    ${JSON.stringify(ejercicios)}
    `;

    const body = {
        contents: [
            {
                parts: [{ text: prompt }]
            }
        ]
    };

    const response = await axios.post(ENDPOINT, body, { headers });

    const texto = response.data.candidates[0].content.parts[0].text;

    return texto;
};