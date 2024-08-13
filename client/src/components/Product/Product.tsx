import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductInfo } from "../../services/productService";
import { IProduct } from "../../types";
import './Product.scss';
import { updateProductToCart } from "../../services/cartService";

const Product = () => {
    const { productId } = useParams();
    const [productInfo, setProductInfo] = useState<IProduct>({} as IProduct);
    const [quantity, setQuantity] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(()=>{
        (async ()=>{
            if(productId) {
                const productInfo = await getProductInfo(productId);
                setProductInfo(productInfo);
            }
        })();
    },[productId]);

    const updateProductInCart = (qty: number)=>{
      if(productId){
        updateProductToCart({
          productId,
          quantity: qty
        });
      } else {
        console.log('enter a valid Product Id');
      }
    }

    const OnAddToCartClick = () => {
      const qty = quantity;
      setQuantity(qty+1);
      updateProductInCart(qty+1);
    }

    const OnRemoveFromCartClick = () => {
      const qty = quantity;
      setQuantity(qty-1);
      updateProductInCart(qty-1);
    }

    const navigateToCart = () => {
      navigate(`/cart`);
    }

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
          { quantity===0 && <div onClick={() => OnAddToCartClick()}>Add To Cart</div> }
          { quantity>0 && <>
            <div onClick={() => OnAddToCartClick()}>+</div>
            <div>{quantity}</div>
            <div onClick={() => OnRemoveFromCartClick()}>-</div>
          </>}
          <div onClick={navigateToCart}>Go To Cart</div>
        </div>
      );
    
}

export default Product;