import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, deleteProduct } from '../store/slices/productSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Trash2 } from 'lucide-react';

export function AdminDashboard() {
  const products = useSelector(state => state.products.items);
  const dispatch = useDispatch();

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    tag: '',
    imageUrl: '',
    description: ''
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const product = {
      ...newProduct,
      id: Date.now(),
      price: parseInt(newProduct.price) || 0
    };
    dispatch(addProduct(product));
    setNewProduct({ name: '', category: '', price: '', tag: '', imageUrl: '', description: '' });
  };

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tight italic mb-8">Admin Control Panel</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Add Product Form */}
        <div className="lg:col-span-1 border-2 border-black p-6 bg-gray-50 h-fit">
          <h2 className="text-2xl font-black uppercase mb-6">Add New Product</h2>
          <form className="space-y-4" onSubmit={handleAdd}>
            <Input placeholder="Product Name *" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            <Input placeholder="Category (e.g. Football) *" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
            <Input placeholder="Price (₹) *" type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
            <Input placeholder="Tag (e.g. NEW, SALE)" value={newProduct.tag} onChange={e => setNewProduct({...newProduct, tag: e.target.value})} />
            <Input placeholder="Image URL *" required value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} />
            <textarea 
              className="w-full border-b-2 border-black p-2 bg-transparent focus:outline-none min-h-[100px] resize-y" 
              placeholder="Description *"
              required
              value={newProduct.description}
              onChange={e => setNewProduct({...newProduct, description: e.target.value})}
            ></textarea>
            <Button type="submit" className="w-full justify-center">Add Product</Button>
          </form>
        </div>

        {/* Product List */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-4">
            <h2 className="text-2xl font-black uppercase">Product Database</h2>
            <span className="font-bold text-sm">{products.length} Items</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-3 font-bold uppercase text-xs">Image</th>
                  <th className="p-3 font-bold uppercase text-xs">Name</th>
                  <th className="p-3 font-bold uppercase text-xs">Category</th>
                  <th className="p-3 font-bold uppercase text-xs">Price</th>
                  <th className="p-3 font-bold uppercase text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <div className="w-12 h-12 bg-gray-200">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                    </td>
                    <td className="p-3 font-bold text-sm">{p.name}</td>
                    <td className="p-3 text-sm">{p.category}</td>
                    <td className="p-3 text-sm">₹{p.price.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
