import { SignInParams } from "../../../../common/types";
import API from "../../Api";

export async function adminLogin(requestBody: SignInParams) {
    const url = `http://localhost:3000/admin/login`;
    const response = await API.post(url, requestBody);
  
    return response?.data;
  }