-- CreateTable
CREATE TABLE "PortfolioChunk" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(1536),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE VECTOR INDEX "PortfolioChunk_embedding_idx" ON "PortfolioChunk" ("embedding")
WITH (METRIC = 'cosine', TYPE = 'diskann');
