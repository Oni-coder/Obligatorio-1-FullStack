import axios from "axios";

export const traducirYResumirEjerciciosService = async (ejercicios) => {

    const API_KEY = process.env.GEMINI_25_API_KEY;

    const MODEL = "gemini-2.5-flash";

    const ENDPOINT =
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

    const headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY
    };

    const prompt = `
    Traducí estos ejercicios al español neutro.

    IMPORTANTE:
    - Son ejercicios de gimnasio.
    - Usá lenguaje criollo del rio de la plata y simple.
    - Evitá expresiones demasiado técnicas o regionales.
    - Que suene claro y moderno.
    - La descripción debe ser corta.
    - Máximo 50 palabras por ejercicio.
    - Explicá cómo se hace el ejercicio de forma resumida.

    Formato de respuesta:

    Nombre del ejercicio

    Descripción corta del ejercicio.

    Separá cada ejercicio con una línea vacía.

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

    const response = await axios.post(
        ENDPOINT,
        body,
        { headers }
    );

    return response.data.candidates[0].content.parts[0].text;
};