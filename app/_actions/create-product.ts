"use server";

import { db } from "../_lib/prisma";
import { Decimal } from "@prisma/client/runtime/library"; // Importação do Decimal

interface CreateProductParams {
  name: string;
  description?: string;
  imageUrl: string;
  price: number;
  stock: number;
  category: string;
}

export const createProduct = async (params: CreateProductParams) => {
  await db.product.create({
    data: {
      ...params,
      price: new Decimal(params.price), // Converte number para Decimal
    },
  });
};
