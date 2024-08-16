import { getCookie } from "../../utils";
import API from "../Api";
import { IUser } from "../types";

export async function getUser(): Promise<IUser>{
    const url = `http://localhost:3000/user/api/user`;
    const response = await API.get(url,{
        headers: {
      Authorization: `Bearer ${getCookie('token')}`
    }
    });
  
    return response?.data;
}