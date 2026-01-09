-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Invoice_requestNumber_idx" ON "Invoice"("requestNumber");

-- CreateIndex
CREATE INDEX "Invoice_createdAt_idx" ON "Invoice"("createdAt");
