"use server";

import { db } from "../_lib/prisma";

export const getSale = async () => {
    return await db.sale.findMany()
};
