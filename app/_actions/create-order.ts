/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const mercadoPago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

interface CreateOrderParams {
  userId: string;
  paymentMethod: string;
  shippingCost: number;
  deliveryMethod: string; 
  street?: string;
  neighborhood?: string;
  number?: string;
  complement?: string;
  cep?: string;
}

export const createOrder = async ({
  userId,
  paymentMethod,
  shippingCost,
  deliveryMethod,
  street,
  neighborhood,
  number,
  complement,
  cep,
}: CreateOrderParams) => {
  console.log("✅ Criando pedido para usuário:", userId);

  const user = await getServerSession(authOptions);
  if (!user || user.user.id !== userId) {
    throw new Error("Usuário não autenticado ou não autorizado");
  }


  const order = await db.order.findFirst({
    where: { userId, status: "PENDING" },
    include: { orderItems: { include: { product: true } } },
  });

  if (!order || order.orderItems.length === 0) {
    throw new Error("Nenhum item no carrinho para finalizar o pedido");
  }

  const totalAmount = order.orderItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // Definição do endereço SOMENTE se for "entrega"
  const addressData =
    deliveryMethod === "entrega"
      ? { street, neighborhood, number, complement, cep }
      : {
          street: null,
          neighborhood: null,
          number: null,
          complement: null,
          cep: null,
        };

  // Atualiza o pedido com os novos dados
  await db.order.update({
    where: { id: order.id },
    data: {
      shippingCost,
      totalAmount: totalAmount + shippingCost,
      ...addressData, // Só adiciona se for entrega
    },
  });

  let mercadoPagoId = null;
  let paymentUrl = null;

  if (paymentMethod === "MERCADO_PAGO") {
    const preferenceData = {
      items: [
        ...order.orderItems.map((item) => ({
          id: item.productId,
          title: item.product.name,
          unit_price: item.price,
          quantity: item.quantity,
          currency_id: "BRL",
        })),
        ...(shippingCost > 0
          ? [
              {
                id: "shipping",
                title: "Frete",
                unit_price: shippingCost,
                quantity: 1,
                currency_id: "BRL",
              },
            ]
          : []),
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}/payment-success`,
        failure: `${process.env.NEXT_PUBLIC_URL}/payment-failure`,
        pending: `${process.env.NEXT_PUBLIC_URL}/payment-pending`,
      },
      notification_url:
        "https://distribuidora-czk.vercel.app/api/webhook/mercadopago",
      auto_return: "approved",
      external_reference: order.id,
      payer: { email: user.user.email },
    };
    

    console.log("✅ Criando pagamento no Mercado Pago:", preferenceData);
    const response = await new Preference(mercadoPago).create({ body: preferenceData });
    mercadoPagoId = response.id;
    paymentUrl = response.init_point;

    await db.payment.create({
      data: {
        orderId: order.id,
        mercadoPagoId: response.id,
        amount: totalAmount + shippingCost,
        paymentMethod,
        status: "PENDING",
      },
    });

  }

  revalidatePath("/orders");
  return { order, paymentUrl };
};
