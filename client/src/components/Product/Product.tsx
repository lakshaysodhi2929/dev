import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductInfo } from "../../services/productService";
import { IProduct } from "../../types";
import './Product.scss';

const Product = () => {
    const { productId } = useParams();
    const [productInfo, setProductInfo] = useState<IProduct>({} as IProduct);

    useEffect(()=>{
        (async ()=>{
            if(productId) {
                const productInfo = await getProductInfo(productId);
                setProductInfo(productInfo);
            }
        })();
    },[productId]);

    return (
        <div className="container">
          <h2 className="title">{productInfo.name}</h2>
          <p className="category">Category: {productInfo.category}</p>
          <img src={productInfo.image} alt={productInfo.name} className="image" />
          <p className="price">Price: Rs{productInfo.price.toFixed(2)}</p>
          <p className="description">{productInfo.description}</p>
          {productInfo.video && (
            <div className="video">
              <a href={productInfo.video} target="_blank" rel="noopener noreferrer">
                Watch Video
              </a>
            </div>
          )}
        </div>
      );
    
}

export default Product;