"use server";

import { db } from "../_lib/prisma";
import { Decimal } from "@prisma/client/runtime/library"; // Importação necessária

interface UpdateProductProps {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  stock?: number;
}

export const updateProduct = async ({ id, name, description, imageUrl, price, stock }: UpdateProductProps) => {
  return db.product.update({
    where: { id },
    data: {
      name,
      description,
      imageUrl,
      price: price !== undefined ? new Decimal(price) : undefined, // Converte number para Decimal
      stock,
    },
  });
};
