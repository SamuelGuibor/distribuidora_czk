-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cep" TEXT,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "number" TEXT,
ADD COLUMN     "street" TEXT,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
