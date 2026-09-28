export async function sendRagQuery({ question, history = [], topK = 4, model }) {
  const response = await fetch('/api/rag/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      question,
      history,
      topK,
      ...(model ? { model } : {})
    })
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to send query to RAG server');
  }

  return data;
}

export async function checkServerHealth() {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch {
    return { status: 'offline' };
  }
}
