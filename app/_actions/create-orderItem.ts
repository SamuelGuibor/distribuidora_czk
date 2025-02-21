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

  // 🛑 Verifica se há um pedido "PENDING" e cancela antes de criar um novo
  const existingOrder = await db.order.findFirst({
    where: { userId, status: "PENDING" },
    include: { orderItems: true },
  });

  if (existingOrder) {
    console.log(`🗑️ Cancelando pedido pendente: ${existingOrder.id}`);

    await db.orderItem.deleteMany({ where: { orderId: existingOrder.id } });
    await db.order.delete({ where: { id: existingOrder.id } });

    console.log(`❌ Pedido ${existingOrder.id} cancelado antes de criar um novo.`);
  }

  // ✅ Cria um novo pedido "PENDING"
  const newOrder = await db.order.create({
    data: {
      userId,
      status: "PENDING",
      totalAmount: 0, // Atualizado depois
    },
  });

  console.log(`🆕 Novo pedido criado: ${newOrder.id}`);

  // ✅ Cria o item dentro do novo pedido
  const orderItem = await db.orderItem.create({
    data: {
      orderId: newOrder.id,
      productId,
      quantity,
      price,
    },
  });

  // 🔢 Atualiza o total do pedido
  const totalAmount = await db.orderItem.aggregate({
    where: { orderId: newOrder.id },
    _sum: { price: true },
  });

  await db.order.update({
    where: { id: newOrder.id },
    data: {
      totalAmount: totalAmount._sum.price ?? 0,
    },
  });

  revalidatePath("/cart");
  return orderItem;
};
