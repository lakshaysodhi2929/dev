import { TrendingProductsParams } from '../../../common/types';
import { getCookie } from '../../utils';
import API from '../Api';

export async function getTrendingProducts(params: TrendingProductsParams) {
  const url = `http://localhost:3000/user/api/product/trendingProducts`;
  const response = await API.get(url, { 
    params,
    headers: {
      Authorization: `Bearer ${getCookie('token')}`
    }
   });
  console.log('trending response',response);
  return response?.data;
}

export async function getCategoryDict() {
  const url = `http://localhost:3000/user/api/product/categoryDict`;
  const response = await API.get(url,{
    headers: {
      Authorization: `Bearer ${getCookie('token')}`
    }
  });
  console.log('dict response',response);
  return response?.data;
}

export async function getProductsForCategory(categoryName: string) {
  const url = `http://localhost:3000/user/api/product/category/${categoryName}`;
  const response = await API.get(url,{
    headers: {
      Authorization: `Bearer ${getCookie('token')}`
    }
  });

  return response?.data;
}

export async function getProductInfo(productId: string) {
  const url = `http://localhost:3000/user/api/product/productInfo/${productId}`;
  const response = await API.get(url,{
    headers: {
      Authorization: `Bearer ${getCookie('token')}`
    }
  });

  return response?.data;
}

