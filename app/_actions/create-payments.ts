"use server";

import { Decimal } from "@prisma/client/runtime/library";
import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";

interface CreatePayableParams {
    id: string;
    fornecedor: string;
    valor: number;
    validade: Date;
    pago: boolean;
}

export const createPayment = async (params: CreatePayableParams) => {
    await db.accountPayable.create({
        data: {
            id: params.id,
            fornecedor: params.fornecedor,
            valor: new Decimal(params.valor),
            validade: params.validade,
            pago: params.pago,
        },
    });
      revalidatePath("/dashboard")
};
