-- AlterTable
ALTER TABLE "attendee" ADD COLUMN     "qrCode" TEXT,
ADD COLUMN     "qrCodeScanned" TIMESTAMPTZ(3);
