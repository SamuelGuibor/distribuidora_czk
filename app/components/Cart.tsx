  'use client'

  import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
  import { useCart } from "../context/CartContext";
  import { useRouter } from "next/navigation"; // Importação correta
  import { addOrderItem } from "../_actions/create-orderItem"; // Importe a função corretamente
  import { useSession } from "next-auth/react"; // Importação da sessão

  export default function ShoppingCart() {
    const { cartItems, removeFromCart, updateQuantity, getTotal } = useCart();
    const router = useRouter();

    // Obtendo a sessão do NextAuth
    const { data: session } = useSession();
    const userId = session?.user?.id; // Pega o id do usuário da sessão

  const handleRemove = async (productId: string) => {
    try {
      removeFromCart(productId);
    } catch (error) {
      console.error("Erro ao remover item:", error);
      alert("Erro ao remover o item do pedido. Tente novamente.");
    }
  };

    const handleFinalizeCart = async () => {
      if (!userId) {
        alert("Usuário não autenticado.");
        return;
      }

      try {
        // Loop para adicionar os itens do carrinho
        for (const item of cartItems) {
          const priceFormatted = Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(item.product.price));

          // Passa o preço formatado corretamente para a função addOrderItem
          await addOrderItem({
            userId,
            productId: item.product?.id || "", // Garante um valor válido
            quantity: item.quantity,
            price: parseFloat(priceFormatted.replace("R$", "").replace(",", ".")),
          });
        }
       

        // Após adicionar os itens ao carrinho, redireciona para o pagamento
        router.push("/payment"); // Certifique-se que a rota "/payment" existe
      } catch (error) {
        console.error("Erro ao finalizar o carrinho:", error);
        alert("Houve um erro ao processar seu pedido. Tente novamente.");
      }
    };
    

    const handleQuantityChange = (productId: string, quantity: number) => {
      updateQuantity(productId, quantity);
    };

    return (
      <div className="flex flex-col p-6 rounded-lg bg-gray-50 w-full h-full">
        <div className="flex-grow overflow-y-auto space-y-5">
          {cartItems.map(({ product, quantity }) => (
            <div key={product.id} className="flex flex-col p-4 bg-white rounded-lg shadow-sm">
              <div>
                <span className="text-lg font-bold text-green-600">
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(product.price))}
                </span>
                <p className="text-sm font-medium text-gray-700">{product.name}</p>
                <p className="text-xs text-gray-500">{product.description}</p>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <button
                  className="w-8 h-8 text-black bg-gray-200 text-lg font-bold rounded-full flex justify-center items-center hover:bg-gray-300"
                  onClick={() => handleQuantityChange(product.id, Math.max(1, quantity - 1))}
                >
                  <FaMinus size={10} />
                </button>
                <span className="text-lg font-medium text-gray-800">{quantity}</span>
                <button
                  className="w-8 h-8 text-black bg-gray-200 text-lg font-bold rounded-full flex justify-center items-center hover:bg-gray-300"
                  onClick={() => handleQuantityChange(product.id, quantity + 1)}
                >
                  <FaPlus size={10} />
                </button>
                <button
                  className="ml-auto text-red-500 hover:text-red-600 text-xl"
                  onClick={() => handleRemove(product.id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center py-4 px-6 rounded-lg shadow-md bg-white">
            <span className="text-lg font-bold text-gray-800">
              Total: R$ {getTotal().toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleFinalizeCart}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            Finalizar Compras
          </button>
        </div>
      </div>
    );
  }
