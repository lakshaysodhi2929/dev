import { ChangeOrderStatusInput, OrderListInput } from "../../../../common/types";
import API from "../../Api";
import { IOrder } from "../../types";

export async function getOrderList(params: OrderListInput): Promise<IOrder[]> {
    const url = `http://localhost:3000/admin/api/order/orderList`;
    const response = await API.get(url,{ params });
  
    return response?.data;
}

export async function rejectOrder(body: ChangeOrderStatusInput) {
    const url = `http://localhost:3000/admin/api/order/rejectOrder`;
    const response = await API.put(url, body);

    return response?.data;
}

export async function markOrderComplete(body: ChangeOrderStatusInput) {
    const url = `http://localhost:3000/admin/api/order/markOrderComplete`;
    const response = await API.put(url, body);

    return response?.data;
}