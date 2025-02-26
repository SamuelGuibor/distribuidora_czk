"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"

export const deleteSale = async (id: string) => {
  await db.sale.delete({
    where: {
      id
    },
  })
  revalidatePath("/sale")
}
