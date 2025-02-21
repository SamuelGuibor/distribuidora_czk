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
      await db.payment.update({
        where: { id: existingPayment.id },
        data: {
          mercadoPagoId: paymentId, // Agora salvamos o ID correto do pagamento!
          status: "COMPLETED",
          updatedAt: new Date(),
        },
      });

      console.log(`✅ Pagamento ${paymentId} atualizado para COMPLETED.`);

      await db.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
        },
      });
    }
    else if (status === "failure" || status === "cancelled") {
      await db.orderItem.deleteMany({ where: { orderId } });
      await db.order.delete({ where: { id: orderId } });

      console.log(`❌ Pedido ${orderId} cancelado devido a falha no pagamento.`);
    }

    console.log(`✅ Pedido ${orderId} atualizado para PAID.`);

  } catch (error) {
    console.error("❌ Erro ao atualizar pagamento no banco:", error);
  }
}
