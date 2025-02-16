"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"

export const deleteProduct = async (id: string) => {
  await db.product.delete({
    where: {
      id
    },
  })
  revalidatePath("/products")
}
