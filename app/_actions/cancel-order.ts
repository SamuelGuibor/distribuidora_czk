"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";

export const cancelOrder = async (userId: string) => {
  if (!userId) return;

  try {
    const pendingOrders = await db.order.findMany({
      where: { userId, status: "PENDING" },
      select: { id: true },
    });

    if (pendingOrders.length === 0) return;

    const orderIds = pendingOrders.map(order => order.id);

    // Remover os itens do pedido antes de deletá-lo
    await db.orderItem.deleteMany({
      where: { orderId: { in: orderIds } },
    });

    // Deletar os pedidos
    await db.order.deleteMany({
      where: { id: { in: orderIds } },
    });

    revalidatePath("/orders");
  } catch (error) {
    console.error("Erro ao cancelar pedido:", error);
  }
};
