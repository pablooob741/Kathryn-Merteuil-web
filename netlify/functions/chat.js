export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body || "{}");

    // Asegurar que history existe y es un array
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

    // Si OpenAI devuelve error
    if (data.error) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: "Qué adorable. Ni siquiera la tecnología puede seguirte el ritmo.",
          error: data.error
        })
      };
    }

    // Si no hay respuesta válida
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: "No voy a dignificar eso con una respuesta.",
          error: "Respuesta inválida de OpenAI"
        })
      };
    }

    const reply = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "Ha ocurrido un error inesperado.",
        error: error.toString()
      })
    };
  }
}
