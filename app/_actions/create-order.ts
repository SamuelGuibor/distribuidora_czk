"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";

interface CreateOrderParams {
  userId: string;
  paymentMethod: string;
  shippingCost: number;
}

export const createOrder = async ({ userId, paymentMethod, shippingCost }: CreateOrderParams) => {
  const user = await getServerSession(authOptions);
  if (!user || user.user.id !== userId) {
    throw new Error("Usuário não autenticado ou não autorizado");
  }

  const pendingOrder = await db.order.findFirst({
    where: { userId, status: "PENDING" },
    include: { orderItems: true },
  });

  if (!pendingOrder || pendingOrder.orderItems.length === 0) {
    throw new Error("Nenhum item no carrinho para finalizar o pedido");
  }

  const totalAmount = pendingOrder.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let orderStatus = "PAID";
  let paymentStatus = "COMPLETED";

  if (paymentMethod === "PIX") {
    orderStatus = "PENDING_PAYMENT";
    paymentStatus = "PENDING";
  } else if (shippingCost > 0) {
    orderStatus = "SHIPPING";
  }

  const updatedOrder = await db.order.update({
    where: { id: pendingOrder.id },
    data: {
      status: orderStatus,
      totalAmount: totalAmount + (shippingCost || 0),
      shippingCost: shippingCost || 0, // Evita valores nulos
      payments: {
        create: {
          amount: totalAmount + (shippingCost || 0),
          paymentMethod,
          status: paymentStatus,
        },
      },
    },
  });
  

  if (paymentMethod !== "PIX") {
    for (const item of pendingOrder.orderItems) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  }

  revalidatePath("/orders");
  return updatedOrder;
};