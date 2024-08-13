import { UpdateCartInput } from "../../../common/types";
import API from "../Api";

export async function updateProductToCart(body: UpdateCartInput) {
    const url = `http://localhost:3000/user/api/cart/update`;
    const response = await API.put(url, body);
  
    return response?.data;
}