"use server";

import { Decimal } from "@prisma/client/runtime/library";
import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateSaleParams {
    id: string
    product: string;
    value: number;
    payment: string;
}

export const createSale = async (params: CreateSaleParams) => {
    await db.sale.create({
        data: {
            id: params.id,
            product: params.product,
            value: new Decimal(params.value),
            payment: params.payment,
        },
    });
    revalidatePath("/sell")
};

