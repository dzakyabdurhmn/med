const apiKey = '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';
const baseURL = 'https://integrate.api.nvidia.com/v1';

async function listModels() {
  try {
    const res = await fetch(`${baseURL}/models`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    const data = await res.json();
    console.log('Available models count:', data.data?.length);
    const deepseekModels = data.data?.filter(m => m.id.toLowerCase().includes('deepseek') || m.id.toLowerCase().includes('llama'));
    console.log('Filtered models:', deepseekModels?.map(m => m.id));
  } catch (e) {
    console.error('Error:', e);
  }
}

listModels();
