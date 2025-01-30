fetch("https://api.aimlapi.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer a2c83da4370b406895f2a5813568ba83",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: "What kind of model are you?",
        },
      ],
      max_tokens: 512,
      stream: false,
    }),
  })
    .then((res) => res.json())
    .then(console.log);