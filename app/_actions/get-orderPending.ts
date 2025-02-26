"use server";

import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";

interface GetPendingOrdersProps {
  userId: string;
}

export const getPendingOrders = async ({ userId }: GetPendingOrdersProps) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Usuário não autenticado");
  }

  const orders = await db.order.findMany({
    where: {
      userId,
      status: "PENDING",
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
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
    items: order.orderItems.map(item => ({
      id: item.id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      image: item.product.imageUrl,
    })),
  }));
};
