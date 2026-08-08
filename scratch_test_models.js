const apiKey = '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';
const baseURL = 'https://integrate.api.nvidia.com/v1';

async function testDeepSeek() {
  const models = [
    'deepseek-ai/deepseek-r1',
    'deepseek-ai/deepseek-v3',
    'meta/llama-3.3-70b-instruct'
  ];

  for (const model of models) {
    const t0 = Date.now();
    try {
      const res = await fetch(`${baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'Generate JSON: {"pathology": "smoker lungs"}' }],
          max_tokens: 60,
        }),
      });
      console.log(`Model ${model}: Status ${res.status} in ${Date.now() - t0}ms`);
      if (res.ok) {
        const data = await res.json();
        console.log('Output:', data.choices?.[0]?.message?.content?.slice(0, 100));
        break; // found working model
      }
    } catch (e) {
      console.error(`Model ${model} error:`, e.message);
    }
  }
}

testDeepSeek();
