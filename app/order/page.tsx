"use client";

import { useEffect, useState } from "react";
import { Table } from "../components/ui/table";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/header2";
import { getOrders } from "../_actions/get-order";
import { getSession } from "next-auth/react";

interface Order {
  id: string;
  total: number;
  isDelivery: boolean;
  address?: {
    street: string;
    neighborhood: string;
    number: string;
    complement?: string;
    cep: string;
  };
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
  user: {
    name: string;
  };
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const session = await getSession();
        const data = await getOrders({ userId: session?.user.id });
        setOrders(data);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4 pt-40">
        <Card>
          <CardContent>
            <h2 className="text-xl font-bold mb-4 pt-2">Pedidos</h2>
            <Table>
              <thead>
                <tr className="text-white">
                  <th className="p-2 text-left">Cliente</th>
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-left">Valor</th>
                  <th className="p-2 text-left">Tipo</th>
                  <th className="p-2 text-left">Endereço</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-700">
                    {/* CLIENTE EM AZUL */}
                    <td className="p-2 font-bold text-blue-400">{order.user.name}</td>

                    <td className="p-2">
                      {order.items.map((item) => (
                        <div key={item.name}>
                          {item.name} (x{item.quantity})
                        </div>
                      ))}
                    </td>

                    {/* VALOR EM NEGRITO E VERDE */}
                    <td className="p-2 font-bold text-green-400">
                      R$ {order.total.toFixed(2)}
                    </td>

                    {/* ENTREGA OU RETIRADA */}
                    <td className="p-2 font-bold text-gray-300">
                      {order.isDelivery ? "Entrega" : "Retirada"}
                    </td>

                    {/* ENDEREÇO EM VERDE SE FOR ENTREGA */}
                    <td className="p-2">
                      {order.isDelivery && order.address ? (
                        <div className="text-green-400 font-semibold">
                          {order.address.street}, {order.address.number}
                          <br />
                          {order.address.neighborhood}
                          <br />
                          {order.address.cep}
                          {order.address.complement && (
                            <div>Complemento: {order.address.complement}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
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
