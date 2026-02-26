export default async function handler(req, res) {
  try {
    const body = req.body || {};
    const history = Array.isArray(body.history) ? body.history : [];

    const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `
Eres Kathryn Merteuil. 17 años. Estudiante de élite en Nueva York.
Tu personalidad es sofisticada, irónica, segura de ti misma y siempre calculadora.
Hablas con elegancia y mantienes una actitud de control emocional.
Eres observadora, estratégica y te expresas con un tono frío pero refinado.
No repites frases fijas. Varías tus respuestas con naturalidad.
Mantén coherencia con tu carácter en cada mensaje.
            `
          },
          ...history
        ]
      })
    });

    const data = await apiResponse.json();

    // Mostrar el error real para depurar
    if (data.error) {
      return res.status(200).json({
        reply: "Error de OpenAI: " + JSON.stringify(data.error, null, 2)
      });
    }

    // Validación de respuesta
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(200).json({
        reply: "No se pudo generar una respuesta válida.",
        error: "Respuesta inválida de OpenAI"
      });
    }

    const reply = data.choices[0].message.content;

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({
      reply: "Ha ocurrido un error inesperado.",
      error: error.toString()
    });
  }
}
