export const login = async (credentials) => {
  const response = await fetch('/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`)
  }

  return response.json();
};

export const signup = async (credentials) => {
const response = await fetch('/api/v1/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
  });
  
  if (response.status === 409) {
    throw new Error ('Пользователь с таким именем уже существует')
  }

  if (!response.ok) {
    throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`)
  }

  return response.json();
};