import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

export async function sendChatMessage(message, threadId) {
  try {
    const response = await apiClient.post('/chat', {
      message,
      thread_id: threadId,
    });

    if (typeof response.data.response !== 'string') {
      throw new Error('The backend response did not include a text answer.');
    }

    return response.data.response;
  } catch (error) {
    if (error instanceof Error && !axios.isAxiosError(error)) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const detail = error.response.data?.detail;
        const detailMessage = typeof detail === 'string' ? `: ${detail}` : '';

        throw new Error(
          `The backend returned an error (${error.response.status})${detailMessage}.`,
        );
      }

      throw new Error(
        'Could not reach the backend. Check that the FastAPI service is running.',
      );
    }

    throw new Error('An unexpected error occurred while contacting the backend.');
  }
}
