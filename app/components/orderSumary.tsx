"use client";

import { useEffect, useState } from "react";
import { getPendingOrders } from "../_actions/get-orderPending";
import { removeOrderItem } from "../_actions/delete-orderItem";
import { useSession } from "next-auth/react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Trash } from "lucide-react";

export function OrderSummary() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchOrder();
    }
  }, [userId]);

  const fetchOrder = async () => {
    setLoading(true);
    console.log("Buscando pedidos para o usuário:", userId);
  
    const orders = await getPendingOrders({ userId });
    console.log("Pedidos encontrados:", orders);
  
    const pendingOrder = orders.find(order => order.status === "PENDING");
    console.log("Pedido pendente encontrado:", pendingOrder);
  
    setOrder(pendingOrder || null);
    setLoading(false);
  };
  

  const handleRemoveItem = async (itemId: string) => {
    setLoading(true);
    await removeOrderItem({ userId, itemId });
    fetchOrder(); // Atualiza os dados após a remoção
  };

  if (!order || loading) {
    return <p className="text-white">Carregando pedido...</p>;
  }

  return (
    <div className="bg-[#1e1e2e] p-6 rounded-lg shadow-lg mt-8">
      <h2 className="text-xl font-semibold mb-4 text-white">Resumo do Pedido</h2>
      <Table className="bg-[#2a2a3a] text-white">
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Qtd</TableHead>
            <TableHead>Preço</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.items.map(item => (
            <TableRow key={item.id}>
              <TableCell className="flex items-center gap-2">
                {item.name}
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>R$ {item.price.toFixed(2)}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleRemoveItem(item.id)}>
                  <Trash size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-4 text-white text-lg font-semibold">
        Total: <span className="text-green-400">R$ {order.total.toFixed(2)}</span>
      </p>
    </div>
  );
}
