import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function AddProduct({ user, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    phoneNumber: '', // Added as requested
    image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('quantity', formData.quantity);
    data.append('phoneNumber', formData.phoneNumber);
    data.append('image', formData.image);
    data.append('sellerId', user.id);

    try {
      await axios.post('http://localhost:5000/api/products/add', data);
      toast.success("Product published successfully!");
      onSuccess(); // Goes back to the dashboard view
    } catch (err) {
      toast.error("Error publishing product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
      <h3 className="text-xl font-bold mb-6">List a New Product</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Product Name</span>
              <input type="text" className="w-full mt-1 p-3 border rounded-xl" placeholder="e.g. Cotton T-Shirts Bulk" 
                onChange={e => setFormData({...formData, name: e.target.value})} required />
            </label>
            
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Category</span>
              <select className="w-full mt-1 p-3 border rounded-xl" 
                onChange={e => setFormData({...formData, category: e.target.value})} required>
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Industrial">Industrial</option>
                <option value="Agriculture">Agriculture</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Price (NPR)</span>
                <input type="number" className="w-full mt-1 p-3 border rounded-xl" placeholder="Price per unit"
                  onChange={e => setFormData({...formData, price: e.target.value})} required />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Min. Quantity</span>
                <input type="number" className="w-full mt-1 p-3 border rounded-xl" placeholder="MOQ"
                  onChange={e => setFormData({...formData, quantity: e.target.value})} required />
              </label>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Contact Number (For Inquiries)</span>
              <input type="tel" className="w-full mt-1 p-3 border rounded-xl" placeholder="+977-98XXXXXXXX"
                onChange={e => setFormData({...formData, phoneNumber: e.target.value})} required />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Product Description</span>
              <textarea className="w-full mt-1 p-3 border rounded-xl h-[125px]" placeholder="Details about quality, material, etc."
                onChange={e => setFormData({...formData, description: e.target.value})} required />
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center">
          <input type="file" accept="image/*" className="hidden" id="productImage" 
            onChange={e => setFormData({...formData, image: e.target.files[0]})} required />
          <label htmlFor="productImage" className="cursor-pointer">
            <i className="bi bi-image text-3xl text-teal-600 mb-2 block"></i>
            <span className="text-sm text-gray-500">{formData.image ? formData.image.name : "Click to upload product photo"}</span>
          </label>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="w-full bg-teal-600 text-white font-bold py-4 rounded-2xl hover:bg-teal-700 transition-all disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Publish Product to Marketplace"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;