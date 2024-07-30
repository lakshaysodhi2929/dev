import API from '../Api';

export async function getCategoryDict() {
  const url = `/user/signup`;
  const response = await API.post(url);

  return response?.data.result;
}

export async function getProductsForCategory(requestBody) {
  const url = `/user/login`;
  const response = await API.post(url, requestBody);

  return response?.data.result;
}


