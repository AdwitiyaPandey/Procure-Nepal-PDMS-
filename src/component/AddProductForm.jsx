import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function AddProductForm({ onBack }) {
    const [formData, setFormData] = useState({
        name: '', description: '', category: '', price: '', quantity: '', phoneNumber: ''
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('image', image);
        data.append('sellerId', 1); 

        try {
            await axios.post('http://localhost:5000/api/products/add', data);
            toast.success("Product added successfully!");
            onBack(); 
        } catch (err) {
            toast.error("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10">
            <button onClick={onBack} className="text-teal-600 mb-4 font-bold">← Back to Dashboard</button>
            <h2 className="text-2xl font-bold mb-6">List New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Product Name" required className="w-full p-3 border rounded-lg" 
                    onChange={e => setFormData({...formData, name: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Price (NPR)" required className="p-3 border rounded-lg"
                        onChange={e => setFormData({...formData, price: e.target.value})} />
                    <input type="number" placeholder="Quantity" required className="p-3 border rounded-lg"
                        onChange={e => setFormData({...formData, quantity: e.target.value})} />
                </div>

                <select className="w-full p-3 border rounded-lg" onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                </select>

                <input type="file" accept="image/*" required className="w-full p-3 border rounded-lg"
                    onChange={e => setImage(e.target.files[0])} />

                <button disabled={loading} className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold">
                    {loading ? "Uploading to Cloudinary..." : "Post Product"}
                </button>
            </form>
        </div>
    );
}

export default AddProductForm;