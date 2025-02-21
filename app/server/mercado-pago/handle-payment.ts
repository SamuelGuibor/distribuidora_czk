import "server-only";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { db } from "../../_lib/prisma"; // Prisma Client

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  try {
    const paymentId = paymentData.id.toString(); // ID do Mercado Pago
    const metadata = paymentData.metadata;
    const orderId = paymentData.external_reference || metadata?.external_reference;
    const status = paymentData.status; // Captura o status do pagamento

    if (!orderId) {
      console.error("❌ Erro: `orderId` não encontrado no webhook.");
      return;
    }

    console.log(`🔹 Atualizando pagamento no banco - MercadoPago ID: ${paymentId}, Pedido ID: ${orderId}`);

    const existingPayment = await db.payment.findFirst({
      where: { orderId: orderId },
    });

    if (!existingPayment) {
      console.warn(`⚠️ Pedido ${orderId} não encontrado no banco.`);
      return;
    }

    if (status === "approved") {
      // Inicia uma transação para garantir a consistência
      await db.$transaction(async (prisma) => {
        // Atualiza o pagamento
        await prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            mercadoPagoId: paymentId, // Agora salvamos o ID correto do pagamento!
            status: "COMPLETED",
            updatedAt: new Date(),
          },
        });

        console.log(`✅ Pagamento ${paymentId} atualizado para COMPLETED.`);

        // Atualiza o status do pedido para "PAID"
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
        });

        // 🔹 Busca os itens do pedido
        const orderItems = await prisma.orderItem.findMany({
          where: { orderId },
          include: { product: true },
        });

        if (orderItems.length === 0) {
          console.warn(`⚠️ Nenhum item encontrado para o pedido ${orderId}`);
          return;
        }

        console.log(`📦 Atualizando estoque para ${orderItems.length} produtos...`);

        // 🔹 Atualiza o estoque de cada produto
        for (const item of orderItems) {
          const newStock = item.product.stock - item.quantity;

          if (newStock < 0) {
            throw new Error(`Estoque insuficiente para o produto ${item.product.name}`);
          }

          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: newStock },
          });

          console.log(`✅ Estoque atualizado para ${item.product.name}: ${newStock} unidades restantes.`);
        }
      });

      console.log(`🎉 Pedido ${orderId} finalizado com sucesso!`);
    } 
    else if (status === "failure" || status === "cancelled") {
      await db.orderItem.deleteMany({ where: { orderId } });
      await db.order.delete({ where: { id: orderId } });

      console.log(`❌ Pedido ${orderId} cancelado devido a falha no pagamento.`);
    }
  } catch (error) {
    console.error("❌ Erro ao atualizar pagamento no banco:", error);
  }
}
