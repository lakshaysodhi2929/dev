import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductInfo } from "../../services/productService";
import { IItems, IProduct } from "../../types";
import './Product.scss';
import { updateProductToCart } from "../../services/cartService";
import { getUser } from "../../services/userService";

const Product = () => {
    const { productId } = useParams();
    const [productInfo, setProductInfo] = useState<IProduct>({} as IProduct);
    const [quantity, setQuantity] = useState<number>(0);
    const navigate = useNavigate();

    const getQuantityForProduct = (cart: IItems[]) => {
      let qty = 0;
      cart.forEach((item)=>{
        if(item.product._id === productId) {
          qty = item.quantity;
        }
      })
      return qty;
    }

    useEffect(()=>{
        (async ()=>{
            if(productId) {
                const [productInfo, user] = await Promise.all([getProductInfo(productId), getUser()]);
                setProductInfo(productInfo);
                setQuantity(getQuantityForProduct(user.cart));
            }
        })();
    },[productId]);

    const updateProductInCart = async (qty: number)=>{
      if(productId){
        await updateProductToCart({
          productId,
          quantity: qty
        });
      } else {
        console.log('enter a valid Product Id');
      }
    }

    const OnAddToCartClick = async () => {
      const qty = quantity;
      await updateProductInCart(qty+1);
      setQuantity(qty+1);
    }

    const OnRemoveFromCartClick = async () => {
      const qty = quantity;
      await updateProductInCart(qty-1);
      setQuantity(qty-1);
    }

    const navigateToCart = () => {
      navigate(`/cart`);
    }

    return (
        <div className="Product">
          <h2>{productInfo.name}</h2>
          <p>Category: {productInfo.category}</p>
          <img src={productInfo.image} alt={productInfo.name}/>
          <p className="price">Price: Rs{productInfo.price}</p>
          <p>{productInfo.description}</p>
          {productInfo.video && (
            <div>
              <a href={productInfo.video} target="_blank" rel="noopener noreferrer">
                Watch Video
              </a>
            </div>
          )}
          { quantity===0 && <div onClick={() => OnAddToCartClick()}>Add To Cart</div> }
          { quantity > 0 && <>
            <div className="quantity-controls" onClick={() => OnAddToCartClick()}>+</div>
            <div>{quantity}</div>
            <div className="quantity-controls" onClick={() => OnRemoveFromCartClick()}>-</div>
          </>}
          <div onClick={navigateToCart}>Go To Cart</div>
        </div>
      );
    
}

export default Product;