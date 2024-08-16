import { UpdateCartInput } from "../../../common/types";
import { getCookie } from "../../utils";
import API from "../Api";

export async function updateProductToCart(body: UpdateCartInput) {
    const url = `http://localhost:3000/user/api/cart/update`;
    const response = await API.put(url, body,{
        headers: {
      Authorization: `Bearer ${getCookie('token')}`
    }
    });
  
    return response?.data;
}