// app/lib/embeddingConfig.ts
// Shared between scripts/ingest-data.ts (embeds stored chunks) and
// app/api/chat/route.ts (embeds incoming questions). Both sides must use
// the same model and dimension, or similarity search compares vectors
// from different spaces.
export const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_DIMENSIONS = 1536;
