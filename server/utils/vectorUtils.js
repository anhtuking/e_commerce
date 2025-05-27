/**
 * Tính toán cosine similarity giữa hai vector
 * @param {number[]} vecA - Vector A
 * @param {number[]} vecB - Vector B
 * @returns {number} - Cosine similarity score
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

/**
 * Tìm kiếm các embeddings tương tự nhất
 * @param {number[]} queryEmbedding - Vector embedding của câu query
 * @param {Array} embeddings - Mảng các embeddings cần so sánh
 * @param {number} topK - Số lượng kết quả trả về
 * @returns {Array} - Mảng các kết quả được sắp xếp theo độ tương đồng
 */
function findSimilarEmbeddings(queryEmbedding, embeddings, topK = 5) {
  const similarities = embeddings.map(embedding => ({
    ...embedding,
    similarity: cosineSimilarity(queryEmbedding, embedding.embedding)
  }));

  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

/**
 * Chuẩn hóa vector
 * @param {number[]} vector - Vector cần chuẩn hóa
 * @returns {number[]} - Vector đã được chuẩn hóa
 */
function normalizeVector(vector) {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => val / magnitude);
}

module.exports = {
  cosineSimilarity,
  findSimilarEmbeddings,
  normalizeVector
}; 