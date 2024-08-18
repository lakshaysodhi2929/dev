import { useState } from 'react';
import './AddProduct.scss';
import { addProduct } from '../../../services/adminServices/productService';
import { AddProductInput } from '../../../../../common/types';

const AddProduct = () => {
  const [formData, setFormData] = useState<AddProductInput>({} as AddProductInput);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProduct(formData);
    console.log(formData);
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input 
          type="text" 
          id="category" 
          name="category" 
          value={formData.category} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="video">Video URL</label>
        <input 
          type="text" 
          id="video" 
          name="video" 
          value={formData.video} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">Image URL</label>
        <input 
          type="text" 
          id="image" 
          name="image" 
          value={formData.image} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input 
          type="number" 
          id="price" 
          name="price" 
          value={formData.price} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          required 
        />
      </div>

      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;
