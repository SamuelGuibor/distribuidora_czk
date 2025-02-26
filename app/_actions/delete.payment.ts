"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"

export const deletePayment = async (id: string) => {
  try {
    const payment = await db.accountPayable.findUnique({
      where: { id },
    });

    if (payment) {
      await db.accountPayable.delete({
        where: { id },
      });
    }

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
  }
};
