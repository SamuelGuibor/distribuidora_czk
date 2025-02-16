import { Product } from "@prisma/client";
import Image from "next/image";
import { useCart } from "../context/CartContext";

interface ModalProps {
  product: Product;
  onClose: () => void;
}

export default function Modal({ product, onClose }: ModalProps) {
  const { addToCart, openCart } = useCart(); // Obter a função de adicionar ao carrinho

  if (!product) return null;

  return (
    <div className="modelsWindowArea flex fixed inset-0">
      <div className="modelsWindowBody relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="modelsBig">
          <Image
            src={product.imageUrl || '/path/to/default-image.jpg'}
            alt={product.name}
            width={300}
            height={300}
            className="modelsBig-img"
          />
        </div>
        <div className="modelsInfo">
          <h1 className="text-lg font-bold mb-2">{product.name}</h1>
          <p className="modelsInfo-desc mb-4">{product.description}</p>
          <div className="modelsInfo-pricearea">
            <div className="modelsInfo-price">
              <div className="modelsInfo-actualPrice">
                <span>
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(product.price))}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <button
            className="modelsInfo-addButton mb-2"
            onClick={() => {
              addToCart(product); // Adiciona o produto ao carrinho
              onClose(); // Fecha o modal após adicionar
              openCart();
            }}
          >
            Adicionar ao Carrinho
          </button>
          <button className="modelsInfo-cancelButton" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
