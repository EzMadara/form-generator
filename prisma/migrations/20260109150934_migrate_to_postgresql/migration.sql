-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "addressProject" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "totalAmount" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "projectConsultant" TEXT NOT NULL,
    "purchasingOfficer" TEXT NOT NULL,
    "recipientCompany" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Invoice_requestNumber_idx" ON "Invoice"("requestNumber");

-- CreateIndex
CREATE INDEX "Invoice_createdAt_idx" ON "Invoice"("createdAt");

