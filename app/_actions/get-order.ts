"use server";

import { db } from "../_lib/prisma";

interface GetOrdersProps {
  userId: string;
}

export const getOrders = async ({ userId }: GetOrdersProps) => {
  const orders = await db.order.findMany({
    where: {
      userId,
      status: {
        notIn: ["PENDING", "PENDING_PAYMENT"], // Excluir pedidos que ainda não foram confirmados
      },
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map(order => ({
    id: order.id,
    date: order.createdAt.toISOString().split('T')[0],
    status: order.status,
    total: order.totalAmount,
    items: order.orderItems.map(item => ({
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      image: item.product.imageUrl,
    })),
  }));
};