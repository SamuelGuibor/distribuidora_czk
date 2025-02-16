"use server";

import { db } from "../_lib/prisma";
import { Prisma } from "@prisma/client";

interface GetProductsProps {
  name?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  stock?: number;
}

export const getProducts = async ({ name, description, imageUrl, price, stock }: GetProductsProps) => {
  const products = await db.product.findMany({
    where: {
      name: name ? { contains: name, mode: "insensitive" } : undefined,
      description: description ? { contains: description, mode: "insensitive" } : undefined,
      imageUrl: imageUrl ? { contains: imageUrl, mode: "insensitive" } : undefined,
      price: price ? price : undefined,
      stock: stock ? stock : undefined,
    },
  });

  return products.map(product => ({
    ...product,
    price: new Prisma.Decimal(product.price.toString()), // ✅ Converte corretamente para evitar erro de tipo
  }));
};
