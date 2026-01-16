import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import axios from 'axios'; // <--- 1. IMPORTACIÓN NUEVA Y NECESARIA

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el formulario (Crear/Editar)
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // Estado de subida de imagen
  const [uploadingImage, setUploadingImage] = useState(false);

  // Datos del formulario inicial
  const initialFormState = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'HOMBRE', // Default
    size: 'M',
    color: '',
    imageUrl: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  // 1. Cargar productos al inicio
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products?size=100'); 
      setProducts(response.data.content || response.data);
    } catch (error) {
      toast.error("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  // 2. Manejar cambios en los inputs de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. --- FUNCIÓN "BYPASS" PARA SUBIR IMAGEN ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamaño (ej. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        toast.warning("⚠️ La imagen es muy pesada (Máx 5MB)");
        return;
    }

    const data = new FormData();
    data.append("file", file);

    // Obtenemos el token manualmente para esta petición específica
    const token = localStorage.getItem('token');

    try {
        setUploadingImage(true);
        
        // --- AQUÍ ESTÁ EL TRUCO ---
        // Usamos 'axios' directo en lugar de 'api'.
        // Esto evita que api.js intente poner 'application/json' y rompa la imagen.
        const response = await axios.post(
            'https://ecommerce-production-1fe1.up.railway.app/api/media/upload', 
            data,
            {
                headers: {
                    'Authorization': `Bearer ${token}` 
                    // NO ponemos Content-Type. Axios lo generará correctamente con el 'boundary'.
                }
            }
        );

        // Guardamos la URL que nos devolvió el servidor
        setFormData({ ...formData, imageUrl: response.data.url });
        toast.success("📸 Imagen subida correctamente");

    } catch (error) {
        console.error("Error subiendo imagen:", error);
        toast.error("Error al subir la imagen (Revisa consola)");
    } finally {
        setUploadingImage(false);
    }
  };

  // 4. Guardar Producto (Crear o Actualizar)
  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.name || !formData.price || !formData.imageUrl) {
        toast.warn("Por favor completa nombre, precio e imagen.");
        return;
    }

    try {
        if (currentProduct) {
            // Actualizar existente
            await api.put(`/products/${currentProduct.id}`, formData);
            toast.success("Producto actualizado");
        } else {
            // Crear nuevo
            await api.post('/products', formData);
            toast.success("Producto creado exitosamente");
        }
        
        // Resetear y recargar
        setIsEditing(false);
        setCurrentProduct(null);
        setFormData(initialFormState);
        loadProducts();

    } catch (error) {
        toast.error("Error al guardar el producto");
    }
  };

  // 5. Preparar edición
  const startEdit = (product) => {
    setCurrentProduct(product);
    setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        category: product.category,
        size: product.size,
        color: product.color,
        imageUrl: product.imageUrl
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 6. Eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
        try {
            await api.delete(`/products/${id}`);
            toast.info("Producto eliminado");
            loadProducts();
        } catch (error) {
            toast.error("No se pudo eliminar");
        }
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setFormData(initialFormState);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
        {!isEditing && (
            <button 
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
                <Plus size={20}/> Nuevo Producto
            </button>
        )}
      </div>

      {/* --- FORMULARIO DE PRODUCTO --- */}
      {isEditing && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-10 animate-fade-in-down">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-700">
                    {currentProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button onClick={cancelEdit} className="text-gray-400 hover:text-red-500">
                    <X size={24}/>
                </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Columna Izquierda: Datos Texto */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej. Hoodie React" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="HOMBRE">HOMBRE</option>
                                <option value="MUJER">MUJER</option>
                                <option value="ACCESORIOS">ACCESORIOS</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                            <input type="text" name="color" value={formData.color} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej. Negro" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none h-24" placeholder="Detalles del producto..."></textarea>
                    </div>
                </div>

                {/* Columna Derecha: IMAGEN */}
                <div className="flex flex-col gap-4">
                    <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
                    
                    {/* Área de Previsualización */}
                    <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                        {formData.imageUrl ? (
                            <>
                                <img src={formData.imageUrl} alt="Preview" className="w-full h-64 object-contain rounded" />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <p className="text-white font-bold">Cambiar Imagen</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-400">
                                <ImageIcon size={48} className="mx-auto mb-2"/>
                                <p>No hay imagen seleccionada</p>
                            </div>
                        )}
                        
                        {/* INPUT INVISIBLE PERO ACTIVO EN TODA EL ÁREA */}
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={uploadingImage}
                        />
                    </div>

                    {/* Barra de Estado */}
                    {uploadingImage && (
                        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-2 rounded">
                            <Loader2 size={18} className="animate-spin"/> Subiendo imagen...
                        </div>
                    )}
                    
                    {!uploadingImage && formData.imageUrl && (
                        <p className="text-xs text-gray-500 break-all border p-2 rounded bg-gray-50">
                            URL: {formData.imageUrl}
                        </p>
                    )}
                </div>

                {/* Botones de Acción */}
                <div className="md:col-span-2 flex justify-end gap-4 mt-4 pt-4 border-t">
                    <button type="button" onClick={cancelEdit} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                        Cancelar
                    </button>
                    <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition font-bold flex items-center gap-2">
                        <Save size={20}/> {currentProduct ? 'Actualizar Producto' : 'Guardar Producto'}
                    </button>
                </div>

            </form>
        </div>
      )}

      {/* --- TABLA DE PRODUCTOS --- */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                    <th className="p-4">Producto</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden border">
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover"/>
                            </div>
                            <span className="font-medium text-gray-800">{product.name}</span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">{product.category}</td>
                        <td className="p-4 font-bold text-gray-900">${product.price}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {product.stock} unids.
                            </span>
                        </td>
                        <td className="p-4 flex justify-center gap-2">
                            <button onClick={() => startEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition" title="Editar">
                                <Edit size={18}/>
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition" title="Eliminar">
                                <Trash2 size={18}/>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        {products.length === 0 && !loading && (
            <div className="p-10 text-center text-gray-500">
                No hay productos registrados. ¡Crea el primero!
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;