'use client'

import { useEffect, useState } from "react";
import Header from "../components/header2";
import Sidebar from "../components/Sidebar";
import ProductList from "../components/ProductList";
import Modal from "../components/Modal";
import NewProductModal from "../components/NewProductModal"; // Importando o modal de criação de produto
import { Product } from "@prisma/client";
import { useSession } from "next-auth/react";
import { createProduct } from "../_actions/create-product";
import { deleteProduct } from '../_actions/delete-product';
import { updateProduct } from "../_actions/update-product";
import { CiCircleMore } from "react-icons/ci";
import { getFilteredProducts } from "../_actions/productaActions";

export default function Produtos() {
  const { data: session } = useSession();
  const [isProductModalOpen, setProductModalOpen] = useState(false);  // Controle para o modal de visualização de produto
  const [isCreateProductModalOpen, setCreateProductModalOpen] = useState(false);  // Controle para o modal de criação de produto
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getFilteredProducts().then(setProducts);
  }, []);

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setProductModalOpen(true); // Abre o modal para ver o produto
  };

  const handleCloseProductModal = () => {
    setProductModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseCreateProductModal = () => {
    setCreateProductModalOpen(false);
  };

  const handleCreateProduct = async (productData: Omit<Product, "id">) => {
    try {
      await createProduct({
        ...productData,
        price: Number(productData.price),
      });
    } catch (error) {
      alert("Erro ao criar produto: " + error);
    }
  };
  

  const handleEditProduct = async (productData: { id: string; name: string; description: string; imageUrl: string; price: number; stock: number }) => {
    try {
      await updateProduct(productData);  // Atualiza o produto
    } catch (error) {
      alert("Erro ao editar produto!" + error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);  // Deleta o produto
    } catch (error) {
      alert("Erro ao excluir produto!" + error);
    }
  };
  const [products, setProducts] = useState([]);

  const handleFilter = (filteredProducts: Product[]) => {
    setProducts(filteredProducts);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <Header />

      <div className="bg-gray-100 pt-40">
        <div className="relative flex justify-center w-full">
          <input
            type="text"
            placeholder="Busque produtos..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-1/2 p-2 border border-gray-300 text-black rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {session?.user?.role === 'ADMIN' && (
            <button
              onClick={() => setCreateProductModalOpen(true)}
              className="absolute right-20 p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              <span className="text-xl"><CiCircleMore size={27} /></span>
            </button>
          )}
        </div>

      </div>

      <div className="flex pt-8 bg-gray-100 px-10 rounded-sm">
        <Sidebar onFilter={handleFilter}/>
        <div className="flex-1">
          <ProductList onAddToCart={handleAddToCart} searchQuery={searchQuery} products={products}/>
        </div>
      </div>

      {/* Modal de visualização do produto */}
      {isProductModalOpen && selectedProduct && (
        <Modal product={selectedProduct} onClose={handleCloseProductModal} />
      )}

      {/* Modal de criação de produto */}
      {isCreateProductModalOpen && (
        <NewProductModal onClose={handleCloseCreateProductModal}
          onCreate={handleCreateProduct}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct} />
      )}
    </div>
  );
}
