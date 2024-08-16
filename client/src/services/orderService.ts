import { RemoveOrderInput } from "../../../common/types";
import { getCookie } from "../../utils";
import API from "../Api";

export async function addOrder() {
    const url = `http://localhost:3000/user/api/order/add`;
    const response = await API.post(url,{},{
        headers: {
      Authorization: `Bearer ${getCookie('token')}`
    }
    });
  
    return response?.data;
}

export async function cancleOrder(body: RemoveOrderInput) {
    const url = `http://localhost:3000/user/api/order/remove`;
    const response = await API.post(url, body,{
        headers: {
      Authorization: `Bearer ${getCookie('token')}`
    }
    });
  
    return response?.data;
}