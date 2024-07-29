import API from '../Api';

export async function signUp() {
  const url = `/user/signup`;
  const response = await API.post(url);

  return response?.data.result;
}
