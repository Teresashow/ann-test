CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "copyText" TEXT NOT NULL,
    "aiResponse" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
