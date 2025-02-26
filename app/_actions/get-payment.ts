"use server";

import { db } from "../_lib/prisma";

export const getPayments = async () => {
    return await db.accountPayable.findMany();
};
