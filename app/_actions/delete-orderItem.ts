"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";

interface RemoveOrderItemParams {
  userId: string;
  itemId: string;
}

export const removeOrderItem = async ({ userId, itemId }: RemoveOrderItemParams) => {
  const user = await getServerSession(authOptions);
  if (!user || user.user.id !== userId) {
    throw new Error("Usuário não autenticado ou não autorizado");
  }

  // Busca o item a ser removido
  const orderItem = await db.orderItem.findUnique({
    where: { id: itemId },
    include: { order: true },
  });

  if (!orderItem) {
    throw new Error("Item não encontrado.");
  }

  const orderId = orderItem.order.id;

  // Remove o item do pedido
  await db.orderItem.delete({ where: { id: itemId } });

  // Recalcula o total do pedido
  const totalAmount = await db.orderItem.aggregate({
    where: { orderId },
    _sum: { price: true },
  });

  // Se não houver mais itens, cancela o pedido
  if (!totalAmount._sum.price) {
    await db.order.update({
      where: { id: orderId },
      data: { status: "CANCELED", totalAmount: 0 },
    });
  } else {
    await db.order.update({
      where: { id: orderId },
      data: { totalAmount: totalAmount._sum.price ?? 0 },
    });
  }

  revalidatePath("/cart");
};
