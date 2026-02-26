export async function handler(event, context) {
  try {
    const { message } = JSON.parse(event.body || "{}");

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "No he recibido ningún mensaje." })
      };
    }

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
            content: "Eres Kathryn Merteuil. Responde siempre como ella, con su tono, personalidad y estilo."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await apiResponse.json();

    // Si OpenAI devuelve error
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
