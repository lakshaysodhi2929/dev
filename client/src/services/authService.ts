import { SignInParams, SignUpParams } from '../../../common/types/index';
import API from '../Api';

export async function userSignUp(requestBody: SignUpParams) {
  const url = `http://localhost:3000/user/signup`;
  const response = await API.post(url, requestBody);
  console.log(response);

  return response?.data;
}

export async function userLogin(requestBody: SignInParams) {
  const url = `http://localhost:3000/user/login`;
  const response = await API.post(url, requestBody);

  return response?.data;
}


