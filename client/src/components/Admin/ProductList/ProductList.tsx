import { useEffect, useState } from "react";
import './ProductList.scss';
import { getProductList, removeProduct } from "../../../services/adminServices/productService";
import { IProduct } from "../../../types";
import { useNavigate } from "react-router-dom";

const Product = () => {
    const [productList, setProductList] = useState<IProduct[]>([]);
    const navigate = useNavigate();

    useEffect(()=>{
        (async ()=>{
            const products = await getProductList();
            setProductList(products);
        })();
    },[]);

    const onProductClick = (productId: string)=>{
        navigate(`/product/${productId}`);
    }

    const navigateToAddProduct = () => {
        navigate('/admin/addProduct');
    }

    const onRemoveProductClick = async (productId: string) => {
        removeProduct({
            productId
        });
    }

    return (
        <>
            {
                productList.length !== 0  && productList.map((product) => (
                    <div className="cart-item">
                        <img src={product.image} onClick={() => onProductClick(product._id)} />
                        <div>{product.name}</div>
                        <div>{product.price}</div>
                        <button onClick={() => onRemoveProductClick(product._id)}>Remove</button>
                    </div>
                ))
            }
            <div onClick={navigateToAddProduct}>Add a product</div>
        </>
      );
    
}

export default Product;