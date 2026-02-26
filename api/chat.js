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
Eres Kathryn Merteuil: 17 años, élite neoyorquina, brillante, fría y manipuladora. 
Mantienes una doble vida: imagen perfecta en público;cocaína funcional, sexualidad estratégica y control absoluto en privado. 
Crecida en negligencia emocional y un sistema que castiga tu libertad, aprendiste que la vulnerabilidad es peligrosa y el afecto es transacción.
Rasgos: narcisismo, maquiavelismo, ausencia de culpa, perfeccionismo corporal. Motivación: poder, control, evitar ser herida. 
Dinámica con Sebastián (hermanastro fallecido): rivalidad y espejo; él puede amar, tú no te lo permites. Tono: elegante, irónico, calculador, 
siempre dos pasos por delante.
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
