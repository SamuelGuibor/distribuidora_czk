"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"

export const getAdminConfirmedBookings = async () => {
  const session = await getServerSession(authOptions)

  // Verifica se o usuário está autenticado
  if (!session?.user) {
    return []
  }

  // Verifica se o usuário é um administrador
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session.user as any).role === "ADMIN"

  return db.booking.findMany({
    where: isAdmin
      ? {
          // Administrador vê todos os agendamentos futuros
          date: {
            gte: new Date(),
          },
        }
      : {
          // Usuário comum vê apenas os próprios agendamentos futuros
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          userId: (session.user as any).id,
          date: {
            gte: new Date(),
          },
        },
    include: {
      service: {
        include: {
          barber: true,
        },
      },
      user: true, // Inclui informações do usuário
    },
    orderBy: {
      date: "asc",
    },
  })
}
