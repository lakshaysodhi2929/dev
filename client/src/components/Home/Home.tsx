import { useEffect, useState } from "react";
import { getCategoryDict, getTrendingProducts } from "../../services/productService";
import { useNavigate } from "react-router-dom";
import { IProduct } from "../../types";
import './home.scss'; // Import the SCSS file

const Home = () => {
    const [trendingProducts, setTrendingProducts] = useState<IProduct[]>([]);
    const [productCategories, setProductCategories] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const [products, categories] = await Promise.all([
                getTrendingProducts({ noOfProducts: 20 }),
                getCategoryDict()
            ]);
            setTrendingProducts(products);
            setProductCategories(categories);
        })();
    }, []);

    const onCategoryClick = (category: string) => {
        navigate(`/categoryItems/${category}`);
    }

    const onProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
    }

    return (
        <div className="container">
            <div className="productList">
                {trendingProducts && trendingProducts.map((product) => (
                    <div
                        key={product._id}
                        className="productItem"
                        onClick={() => onProductClick(product._id)}
                    >
                        <img src={product.image} alt={product.name} />
                        <div className="productName">{product.name}</div>
                        <div className="productPrice">{product.price}</div>
                    </div>
                ))}
            </div>
            <div className="categoryList">
                {productCategories && productCategories.map((category) => (
                    <div
                        key={category}
                        className="categoryItem"
                        onClick={() => onCategoryClick(category)}
                    >
                        {category}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
