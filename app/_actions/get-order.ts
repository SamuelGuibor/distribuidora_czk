"use server";

import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";

interface GetOrdersProps {
  userId: string;
}

export const getOrders = async ({ userId }: GetOrdersProps) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Usuário não autenticado");
  }

  const isAdmin = session.user.role === "ADMIN"; // Verifica se o usuário é admin

  const orders = await db.order.findMany({
    where: isAdmin
      ? { status: { notIn: ["PENDING", "CANCELED"] } } // Admin vê tudo
      : { userId, status: { notIn: ["PENDING", "CANCELED"] } }, // Usuário vê apenas os próprios pedidos
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      payments: true, // Adicionamos os pagamentos
      user: true, // Incluímos o usuário para pegar o nome
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map(order => ({
    id: order.id,
    date: order.createdAt.toISOString().split("T")[0],
    status: order.status,
    total: order.totalAmount,
    isDelivery: !!order.street, // Se street não for null, é uma entrega
    address: order.street
      ? {
          street: order.street,
          neighborhood: order.neighborhood,
          number: order.number,
          complement: order.complement || "", // Caso seja opcional
          cep: order.cep,
        }
      : null, // Se não for entrega, não retorna o endereço
    items: order.orderItems.map(item => ({
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      image: item.product.imageUrl,
    })),
    payments: order.payments.map(payment => ({
      method: payment.paymentMethod,
    })),
    user: {
      name: order.user.name,
    },
  }));
};
