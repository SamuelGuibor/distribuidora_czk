/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { createProduct } from "../_actions/create-product";
import { deleteProduct } from "../_actions/delete-product";
import { updateProduct } from "../_actions/update-product";
import { getProducts } from "../_actions/get-product";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Prisma } from "@prisma/client";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner"

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: Prisma.Decimal;
  stock: number;
}

interface ModalProps {
  onClose: () => void;
  onCreate: (productData: Omit<Product, "id">) => Promise<void>;
  onEdit: (productData: Omit<Product, "price"> & { price: Prisma.Decimal | number }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const NewProductModal: React.FC<ModalProps> = ({ onClose, onCreate, onEdit, onDelete }) => {
  const [action, setAction] = useState<"create" | "edit" | "delete">("create");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>(products.length > 0 ? products[0].id : "");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<Omit<Product, "id" | "price"> & { price: string }>({
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    stock: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts({});
      setProducts(data);

      // Definir automaticamente um produto válido ao carregar
      if (data.length > 0 && !selectedProductId) {
        setSelectedProductId(data[0].id);
      }
    };
    fetchProducts();
  }, []);


  useEffect(() => {
    if (selectedProductId && action !== "create") {
      const product = products.find((p) => p.id === selectedProductId);
      if (product) {
        setFormData({ ...product, price: product.price.toString() });
      }
    }
  }, [selectedProductId, action, products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};
    const { name, description, imageUrl, price, stock } = formData;
  
    if (action === "edit" && !selectedProductId) newErrors.id = "Selecione um produto para editar.";
    if (action === "delete" && !selectedProductId) newErrors.id = "Selecione um produto para excluir.";
    if (!name) newErrors.name = "Nome é obrigatório";
    if (!description) newErrors.description = "Descrição é obrigatória";
    if (!imageUrl) newErrors.imageUrl = "URL da Imagem é obrigatória";
    if (parseFloat(price) <= 0) newErrors.price = "Preço deve ser maior que zero";
    if (Number(stock) < 0) newErrors.stock = "Estoque não pode ser negativo";
  
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const productData = { ...formData, price: new Prisma.Decimal(price), stock: Number(stock) };
  
        if (action === "delete" && selectedProductId) {
          await onDelete(selectedProductId);
          toast.success("Produto excluído com sucesso!");  // Usando o Toast de sucesso
        } else if (action === "edit" && selectedProductId) {
          await onEdit({ ...productData, id: selectedProductId, price: new Prisma.Decimal(productData.price.toString()) });
          toast.success("Produto editado com sucesso!");  // Usando o Toast de sucesso
        } else {
          await onCreate(productData);
          toast.success("Produto criado com sucesso!");  // Usando o Toast de sucesso
        }
        onClose();
      } catch (error) {
        toast.error(`Erro ao ${action === "delete" ? "excluir" : "salvar"} produto: ${error}`);  // Usando o toast de erro
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-slide" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="relative bg-[#252830] backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-white/20">
        
        {/* Ícone e título */}
        <div className="flex flex-col items-center text-white">
          {action === "create" && <FaPlus className="text-green-400 text-5xl mb-2" />}
          {action === "edit" && <FaEdit className="text-yellow-400 text-5xl mb-2" />}
          {action === "delete" && <FaTrash className="text-red-400 text-5xl mb-2" />}
          <h2 className="text-3xl font-bold">{action === "create" ? "Criar Produto" : action === "edit" ? "Editar Produto" : "Excluir Produto"}</h2>
        </div>
  
        {/* Opções de Ação */}
        <div className="bg-white/20 p-4 rounded-xl mt-4 flex justify-center gap-4">
          <button onClick={() => setAction("create")} className={`px-4 py-2 rounded-lg text-white ${action === "create" ? "bg-green-500" : "bg-gray-600 hover:bg-gray-500"}`}>Criar</button>
          <button onClick={() => setAction("edit")} className={`px-4 py-2 rounded-lg text-white ${action === "edit" ? "bg-yellow-500" : "bg-gray-600 hover:bg-gray-500"}`}>Editar</button>
          <button onClick={() => setAction("delete")} className={`px-4 py-2 rounded-lg text-white ${action === "delete" ? "bg-red-500" : "bg-gray-600 hover:bg-gray-500"}`}>Excluir</button>
        </div>
  
        {/* Seleção de Produto */}
        {(action === "edit" || action === "delete") && products.length > 0 && (
          <div className="mt-4">
            <label className="text-white text-sm">Selecione um produto:</label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger className="w-full mt-2 bg-gray-800 text-white border-gray-600 rounded-lg p-2">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white">
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id} className="hover:bg-gray-700">
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
  
        {/* Formulário */}
        {action !== "delete" && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input name="name" placeholder="Nome" value={formData.name} onChange={handleChange} className="bg-gray-800 text-white border-gray-600 rounded-lg p-2" />
            <Input name="price" type="number" placeholder="Preço" value={formData.price} onChange={handleChange} className="bg-gray-800 text-white border-gray-600 rounded-lg p-2" />
            <Input name="description" placeholder="Descrição" value={formData.description} onChange={handleChange} className="col-span-2 bg-gray-800 text-white border-gray-600 rounded-lg p-2" />
            <Input name="imageUrl" placeholder="URL da imagem" value={formData.imageUrl} onChange={handleChange} className="col-span-2 bg-gray-800 text-white border-gray-600 rounded-lg p-2" />
            <Input name="stock" type="number" placeholder="Estoque" value={formData.stock} onChange={handleChange} className="bg-gray-800 text-white border-gray-600 rounded-lg p-2" />
          </div>
        )}
  
        {/* Botões de Ação */}
        <div className="flex justify-between mt-6">
          <button onClick={onClose} className="bg-gray-700 text-white hover:bg-gray-600 px-5 py-2 rounded-lg">Cancelar</button>
          <button onClick={handleSubmit} className={`px-5 py-2 rounded-lg font-semibold ${action === "delete" ? "bg-red-600 hover:bg-red-500" : "bg-blue-600 hover:bg-blue-500"}`}>
            {action === "delete" ? "Excluir" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
  
  
};

export default NewProductModal;