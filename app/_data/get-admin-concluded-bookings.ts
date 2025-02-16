"use server"

import { getServerSession } from "next-auth"
import { db } from "../_lib/prisma"
import { authOptions } from "../_lib/auth"

export const getAdminConcludedBookings = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) return []

  // Verifica se o usuário é um administrador
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session.user as any).role === "ADMIN"

  return db.booking.findMany({
    where: isAdmin
      ? {
          // Administrador vê todos os agendamentos finalizados
          date: {
            lt: new Date(),
          },
        }
      : {
          // Usuário comum vê apenas seus próprios agendamentos finalizados
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          userId: (session.user as any).id,
          date: {
            lt: new Date(),
          },
        },
    include: {
      service: {
        include: {
          barber: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  })
}
