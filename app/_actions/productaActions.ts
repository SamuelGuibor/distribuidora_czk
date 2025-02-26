"use server";

import { db } from "../_lib/prisma"; // Importa corretamente a instância do Prisma
import { Prisma } from "@prisma/client"; // Importa os tipos do Prisma

export async function getCategories() {
  const categories = await db.product.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
  });

  return categories
    .map((c) => c.category) // Extrai apenas os nomes das categorias
    .filter((c): c is string => Boolean(c)) // Remove valores nulos/undefined
    .sort(); // Ordena alfabeticamente
}

export async function getFilteredProducts(category?: string, minPrice?: number, maxPrice?: number) {
  const where: Prisma.ProductWhereInput = {}; // Corrigindo o tipo do objeto where

  if (category) {
    where.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      where.price.gte = minPrice; // Define o mínimo
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice; // Define o máximo
    }
  }

  const products = await db.product.findMany({ where });

  return products;
}
