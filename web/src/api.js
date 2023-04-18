export const apiBaseUrl = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';
export const apiConversionUrl = `${apiBaseUrl}/conversion`

export async function fetchJobStatus(jobId) {
  const response = await fetch(`${apiBaseUrl}/job/${jobId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch job status');
  }
  return await response.json();
}

export async function query(query) {
  const response = await fetch(`${apiBaseUrl}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: query }),
  });
  if (!response.ok) {
    throw new Error('Failed to search domains');
  }
  return await response.json();
}