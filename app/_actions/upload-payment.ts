"use server";

import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";

export const updatePaymentStatus = async (id: string, pago: boolean) => {
    try {
        await db.accountPayable.update({
            where: { id },
            data: { pago },
        });
        revalidatePath("/dashboard");
    } catch (error) {
        console.error("Erro ao atualizar status de pagamento:", error);
        throw new Error("Falha ao atualizar o pagamento.");
    }
};
