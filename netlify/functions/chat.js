export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body || "{}");
    const history = body.history || [];

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
            content: "Eres Kathryn Merteuil. Responde siempre como ella: elegante, manipuladora, inteligente, fría, seductora y psicológicamente estratégica."
          },
          ...history
        ]
      })
    });

    const data = await apiResponse.json();

    if (!data.choices || !data.choices[0]) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          reply: "Kathryn no puede responder ahora mismo.",
          error: data
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content })
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
