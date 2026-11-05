const fetchWithAuth = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }

  return response.json();
};

export const getChannels = (token) =>
  fetchWithAuth('/api/v1/channels', token);

export const getMessages = (token) =>
  fetchWithAuth('/api/v1/messages', token);