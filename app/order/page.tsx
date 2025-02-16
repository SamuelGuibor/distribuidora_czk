'use client'
import { useState } from "react";
import { Table } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/header2";

const initialOrders = [
  {
    id: 1,
    item: "Pizza Margherita",
    valor: "R$ 35,00",
    pagamento: "Cartão de Crédito",
    tipo: "Entrega",
    cliente: "João Silva",
    status: "Em andamento",
  },
  {
    id: 2,
    item: "Hambúrguer Artesanal",
    valor: "R$ 25,00",
    pagamento: "Pix",
    tipo: "Retirada",
    cliente: "Maria Oliveira",
    status: "Entregue",
  },
];

export default function OrdersList() {
  const [orders, setOrders] = useState(initialOrders);

  const toggleStatus = (id) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id
          ? { ...order, status: order.status === "Entregue" ? "Em andamento" : "Entregue" }
          : order
      )
    );
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4 pt-40">
        <Card>
          <CardContent>
            <h2 className="text-xl font-bold mb-4 pt-2">Pedidos</h2>
            <Table>
              <thead>
                <tr>
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-left">Valor</th>
                  <th className="p-2 text-left">Pagamento</th>
                  <th className="p-2 text-left">Tipo</th>
                  <th className="p-2 text-left">Cliente</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Ação</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-2">{order.item}</td>
                    <td className="p-2">{order.valor}</td>
                    <td className="p-2">{order.pagamento}</td>
                    <td className="p-2">{order.tipo}</td>
                    <td className="p-2">{order.cliente}</td>
                    <td className="p-2">
                      <Badge
                        className={
                          order.status === "Entregue"
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => toggleStatus(order.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Alterar Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}