import { AddProductInput, RemoveProductInput } from "../../../../common/types";
import { getCookie } from "../../../utils";
import API from "../../Api";
import { IProduct } from "../../types";

export async function getProductList(): Promise<IProduct[]> {
    const url = `http://localhost:3000/admin/api/product/getProductList`;
    console.log('hi');
    const response = await API.get(url,{
        headers: {
          Authorization: `Bearer ${getCookie('token')}`
        }
    });
    console.log(response);
    return response?.data?.productList;
}

export async function addProduct(body: AddProductInput) {
    const url = `http://localhost:3000/admin/api/product/addProduct`;
    const response = await API.post(url, body,{
        headers: {
      Authorization: `Bearer ${getCookie('token')}`
    }});

    return response?.data;
}

export async function removeProduct(body: RemoveProductInput) {
    const url = `http://localhost:3000/admin/api/product/removeProduct`;
    const response = await API.post(url, body,{
        headers: {
      Authorization: `Bearer ${getCookie('token')}`
    }});

    return response?.data;
}