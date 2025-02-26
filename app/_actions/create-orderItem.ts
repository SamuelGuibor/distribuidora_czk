"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";

interface AddOrderItemParams {
  userId: string;
  productId: string;
  quantity: number;
  price: number;
}

export const addOrderItem = async ({
  userId,
  productId,
  quantity,
  price,
}: AddOrderItemParams) => {
  const user = await getServerSession(authOptions);
  if (!user || user.user.id !== userId) {
    throw new Error("Usuário não autenticado ou não autorizado");
  }

  // Verifica se já existe um pedido pendente
  let order = await db.order.findFirst({
    where: { userId, status: "PENDING" },
  });

  // Se não existir um pedido pendente, cria um novo
  if (!order) {
    order = await db.order.create({
      data: {
        userId,
        status: "PENDING",
        totalAmount: 0, // Inicialmente 0, será atualizado depois
      },
    });
  }

  // Adiciona o item ao pedido existente
  await db.orderItem.create({
    data: {
      orderId: order.id,
      productId,
      quantity,
      price,
    },
  });

  // Atualiza o total do pedido
  const totalAmount = await db.orderItem.aggregate({
    where: { orderId: order.id },
    _sum: { price: true },
  });

  await db.order.update({
    where: { id: order.id },
    data: {
      totalAmount: totalAmount._sum.price ?? 0,
    },
  });

  revalidatePath("/cart");
  return order;
};
