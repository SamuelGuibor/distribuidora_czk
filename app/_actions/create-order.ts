"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { MercadoPagoConfig, Preference } from "mercadopago";

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
  console.log(`✅ Criando pedido para usuário: ${userId}`);

  const user = await getServerSession(authOptions);
  if (!user || user.user.id !== userId) {
    throw new Error("Usuário não autenticado ou não autorizado");
  }

  // 🛑 REMOVE qualquer pedido "PENDING" anterior
  const existingOrder = await db.order.findFirst({
    where: { userId, status: "PENDING" },
    include: { orderItems: true },
  });

  if (existingOrder) {
    console.log(`🗑️ Pedido pendente encontrado: ${existingOrder.id}. Excluindo...`);

    await db.orderItem.deleteMany({ where: { orderId: existingOrder.id } });
    await db.order.delete({ where: { id: existingOrder.id } });

    // Verificação após exclusão
    const checkOrder = await db.order.findFirst({
      where: { id: existingOrder.id },
    });

    if (!checkOrder) {
      console.log(`✅ Pedido ${existingOrder.id} removido com sucesso.`);
    } else {
      console.error(`❌ ERRO: Pedido ${existingOrder.id} NÃO foi removido.`);
      throw new Error("Erro ao remover pedido antigo.");
    }
  } else {
    console.log("⚠️ Nenhum pedido 'PENDING' encontrado para este usuário.");
  }

  // ✅ CRIA UM NOVO PEDIDO DO ZERO
  const newOrder = await db.order.create({
    data: {
      userId,
      status: "PENDING",
      shippingCost,
      totalAmount: 0, // Atualizado após calcular o total
      street: deliveryMethod === "entrega" ? street : null,
      neighborhood: deliveryMethod === "entrega" ? neighborhood : null,
      number: deliveryMethod === "entrega" ? number : null,
      complement: deliveryMethod === "entrega" ? complement : null,
      cep: deliveryMethod === "entrega" ? cep : null,
    },
  });

  console.log(`🆕 Novo pedido criado: ${newOrder.id}`);

  // Busca o pedido atualizado com os itens do usuário
  const order = await db.order.findFirst({
    where: { userId, id: newOrder.id },
    include: { orderItems: { include: { product: true } } },
  });

  if (!order) {
    throw new Error("Erro ao buscar o pedido recém-criado.");
  }

  // 🔢 CALCULA O TOTAL DO PEDIDO
  const totalAmount = order.orderItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // Atualiza o pedido com o valor total
  await db.order.update({
    where: { id: order.id },
    data: {
      totalAmount: totalAmount + shippingCost,
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
      notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook/mercadopago`,
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

    console.log(`💳 Pagamento criado no Mercado Pago - ID: ${mercadoPagoId}`);
  }

  revalidatePath("/orders");
  return { order, paymentUrl };
};
