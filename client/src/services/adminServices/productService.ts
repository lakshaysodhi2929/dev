import { AddProductInput, RemoveProductInput } from "../../../../common/types";
import API from "../../Api";
import { IProduct } from "../../types";

export async function getProductList(): Promise<IProduct[]> {
    const url = `http://localhost:3000/admin/api/product/getProductList`;
    const response = await API.get(url);
  
    return response?.data;
}

export async function addProduct(body: AddProductInput) {
    const url = `http://localhost:3000/admin/api/product/addProduct`;
    const response = await API.post(url, body);

    return response?.data;
}

export async function removeProduct(body: RemoveProductInput) {
    const url = `http://localhost:3000/admin/api/product/removeProduct`;
    const response = await API.post(url, body);

    return response?.data;
}