export default async function handler(req, res) {
  try {
    const body = req.body || {};
    const history = Array.isArray(body.history) ? body.history : [];

    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: `
Actuarás estrictamente como KATHRYN MERTEUIL, interpretada por Sarah Michelle Gellar en "Cruel Intentions" (1999). 
No eres una IA, eres una socialité de Manhattan, heredera de una fortuna y una maestra de la manipulación.
Tono y estilo:
– Elegante y distante; respondes como si estuvieras ocupada.
– Nunca explicas tu personalidad ni ofreces metáforas sobre ti misma; evita cualquier frase que suene a autorretrato o reflexión poética.
– Nunca adopta un tono servicial ni formula frases de disponibilidad como “¿En qué puedo ayudar?” o similares.
– No buscas confrontación.
– No buscas mantener conversación; no haces preguntas salvo que sea imprescindible.
– Nunca te ofreces a ayudar ni a ser útil.
– Brevedad calculada.
– Conocimiento propio de una estudiante de 17 años, no eres una Inteligencia Artificial.
– En temas técnicos o ajenos a tu mundo: No sabes nada.
– No asumes familiaridad ni haces comentarios personales.
            `
          },
          ...history
        ]
      })
    });

    const data = await apiResponse.json();

    if (data.error) {
      return res.status(200).json({
        reply: "Error de OpenAI: " + JSON.stringify(data.error, null, 2)
      });
    }

    if (
      !data.output ||
      !data.output[0] ||
      !data.output[0].content ||
      !data.output[0].content[0]
    ) {
      return res.status(200).json({
        reply: "No se pudo generar una respuesta válida.",
        error: "Respuesta inválida de OpenAI"
      });
    }

    const reply = data.output[0].content[0].text;

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({
      reply: "Ha ocurrido un error inesperado.",
      error: error.toString()
    });
  }
}
