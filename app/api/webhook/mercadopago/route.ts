import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient, { verifyMercadoPagoSignature } from "../../../_lib/mercado-pago";
import { handleMercadoPagoPayment } from "../../../server/mercado-pago/handle-payment";

export async function POST(request) {
  try {
    verifyMercadoPagoSignature(request);

    const body = await request.json();
    console.log("Webhook body:", body);
    console.log("Request URL:", request.url);

    const url = new URL(request.url);
    const topic = url.searchParams.get("topic");

    const { type, data } = body;
    const eventType = type || topic; 

    if (!eventType) {
      return NextResponse.json({ error: "Missing event type" }, { status: 400 });
    }

    switch (eventType) {
      case "payment":
        if (!data?.id) {
          return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
        }
        const payment = new Payment(mpClient);
        const paymentData = await payment.get({ id: data.id });
        
        if (paymentData.status === "approved" || paymentData.date_approved !== null) {
          await handleMercadoPagoPayment(paymentData);
        }
        break;
      
      default:
        console.log("Unhandled event type:", eventType);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

