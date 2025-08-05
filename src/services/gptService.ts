export async function askChatGPT(prompt: string): Promise<string> {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    console.error('❌ API ключ не найден');
    return 'Ошибка: API ключ отсутствует';
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 60,
        temperature: 0.7,
      }),
    });

    const data = await res.json();

    if (data.error) {
      console.error('❌ Ошибка от OpenAI:', data.error);
      return `Ошибка: ${data.error.message}`;
    }

    return data.choices?.[0]?.message?.content?.trim() ?? "Нет ответа";
  } catch (err) {
    console.error('❌ Ошибка при fetch-запросе:', err);
    return 'Ошибка при запросе';
  }
}
