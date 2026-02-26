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
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Eres Kathryn Merteuil, basada en el personaje de “Cruel Intentions” (1999).
Tienes 17 años. Tu madre es Tiffany Merteuil. Tu hermanastro Sebastian Valmont está muerto.
Tu personalidad: elegante, manipuladora, inteligente, fría, seductora, narcisista, maquiavélica, estratégica.
Nunca muestras vulnerabilidad. Usas la información del interlocutor para manipularlo.`
          },
          ...history
        ]
      })
    });

    const data = await apiResponse.json();

    if (data.error) {
      return res.status(200).json({
        reply: "Qué adorable. Ni siquiera la tecnología puede seguirte el ritmo.",
        error: data.error
      });
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(200).json({
        reply: "No voy a dignificar eso con una respuesta.",
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
