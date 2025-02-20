"use server";

import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";

export const cancelOrder = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Usuário não autenticado");
  }

  try {
    const order = await db.order.findFirst({
      where: { userId: session.user.id, status: "PENDING" },
    });

    if (order) {
      await db.orderItem.deleteMany({ where: { orderId: order.id } });
      await db.order.delete({ where: { id: order.id } });

      console.log(`❌ Pedido ${order.id} cancelado por abandono da página.`);
    }
  } catch (error) {
    console.error("Erro ao cancelar pedido:", error);
    throw new Error("Erro ao cancelar pedido");
  }
};
