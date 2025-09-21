import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from "../../../config";

export default function ViewProduct() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('mobile');

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  const fetchProducts = async (category) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));

      const response = await axios.get(`${BASE_URL}/api/products/${category}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <div className="mb-4">
        <label className="font-semibold mr-2">Select Category:</label>
        <select value={selectedCategory} onChange={handleCategoryChange} className="border rounded p-2">
          <option value="computers">Computers</option>
          <option value="mobile">Mobile</option>
          <option value="watch">Watch</option>
          <option value="tv">TV</option>
          <option value="fridge">Fridge</option>
          <option value="speaker">Speaker</option>
          <option value="menwear">Men Wear</option>
          <option value="womanwear">Woman Wear</option>
          <option value="furniture">Furniture</option>
          <option value="kitchen">Kitchen</option>
          <option value="ac">AC</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded p-4 shadow flex flex-col items-center">
            <img 
              src={`${BASE_URL}/images/${product.profileImage}`} 
              alt={product.name} 
              className="h-40 object-contain mb-4"
            />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>Price: ₹{product.price}</p>
            <p>Stock: {product.stock}</p>
            <p className="text-gray-600 mt-2">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
