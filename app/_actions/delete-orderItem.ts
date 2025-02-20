"use server";

import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";

export const getOrderItemByProduct = async (productId: string) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Usuário não autenticado");
  }

  const orderItem = await db.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId: session.user.id, // Filtra pelo usuário logado
        status: "PENDING", // Garante que está dentro de um pedido pendente
      },
    },
    select: { id: true },
  });

  return orderItem;
};
