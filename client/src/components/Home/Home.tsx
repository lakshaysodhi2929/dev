import { useEffect, useState } from "react";
import { getCategoryDict, getTrendingProducts } from "../../services/productService";
import { useNavigate } from "react-router-dom";
import { IProduct } from "../../types";


const Home = ()=>{
    const [trendingProducts, setTrendingProducts] = useState<IProduct[]>([]);
    const [productCategories, setProductCategories] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(()=>{
        (async () =>{
            const [products, categories] = await Promise.all([
                getTrendingProducts({noOfProducts: 20}),
                getCategoryDict()
            ]);
            setTrendingProducts(products);
            setProductCategories(categories);
        })();
    },[]);

    const onCategoryClick = (category: string) => {
        navigate(`/categoryItems/${category}`);
    }

    const onProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
    }

    return (
        <>
            {trendingProducts.forEach((product)=>{
                <div onClick={() => onProductClick(product._id)}>
                    <div>{product.image}</div>
                    <div>{product.name}</div>
                    <div>{product.price}</div>
                </div>
            })}
            {productCategories.forEach((category)=>{
                <div onClick={() => onCategoryClick(category)}>{category}</div>
            })}
        </>
    );
}

export default Home;