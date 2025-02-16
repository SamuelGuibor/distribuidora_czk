  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Header from "../components/header2";
import { getOrders } from "../_actions/get-order";

export default function OrdersPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      getOrders({ userId }).then((data) => {
        setOrders(data);
        setLoading(false);
      });
    }
  }, [userId]);

  if (loading) {
    return <p className="text-center text-lg">Carregando pedidos...</p>;
  }

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto p-6 pt-20">
        <h1 className="text-2xl font-bold mb-6">Meus Pedidos</h1>
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <Card key={order.id} className="p-4 border border-gray-300 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold">Pedido #{order.id}</h2>
                <p className="text-sm text-gray-600">Data: {order.date}</p>
                <p className="text-sm text-gray-600">Status: <span className="font-medium text-blue-600">{order.status}</span></p>
                <p className="text-sm text-gray-600">Total: <span className="font-medium">R$ {order.total.toFixed(2)}</span></p>
                <div className="mt-4 space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-2 border rounded-md">
                      <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-md" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Subtotal: R$ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-700 font-semibold mt-2">Valor Total: R$ {(order.total).toFixed(2)}</p>
                <Button className="mt-4">Ver Detalhes</Button>
              </Card>
            ))
          ) : (
            <p className="text-center text-lg">Nenhum pedido encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
