import './categoryItems.scss';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductsForCategory } from "../../services/productService";
import { IProduct } from "../../types";

const CategoryItems = () => {
    const { category } = useParams();
    const [categoryProducts, setCategoryProducts] = useState<IProduct[]>([]);
    const navigate = useNavigate();

    useEffect(()=>{
        (async ()=>{
            if(category){
                const productsForCategory = await getProductsForCategory(category);
                setCategoryProducts(productsForCategory);
            }
        })();
    },[category]);

    const onProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
    }

    return (
        <>
            {
                categoryProducts && categoryProducts.map((product)=>(
                    <div className="category-item" onClick={() => onProductClick(product._id)}>
                        <div>{product.image}</div>
                        <div>{product.name}</div>
                        <div>{product.price}</div>
                        <div>{product.description}</div>
                    </div>
                ))
            }
        </>
    )
}

export default CategoryItems;
