import { pipeline } from '@xenova/transformers';
import { TRADING_KNOWLEDGE_BASE, TradingDocument } from '@/data/tradingKnowledgeBase';

interface EmbeddingCache {
  [key: string]: number[];
}

interface SearchResult {
  document: TradingDocument;
  similarity: number;
  relevantExcerpt: string;
}

class RAGService {
  private embedder: any = null;
  private documentEmbeddings: EmbeddingCache = {};
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('Initializing RAG embeddings model...');
      
      this.embedder = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      );

      // Pre-compute embeddings for all documents
      await this.precomputeEmbeddings();
      this.isInitialized = true;
      
      console.log('RAG service initialized successfully');
    } catch (error) {
      console.warn('WebGPU not available for embeddings, falling back to CPU:', error);
      try {
        this.embedder = await pipeline(
          'feature-extraction',
          'Xenova/all-MiniLM-L6-v2'
        );
        await this.precomputeEmbeddings();
        this.isInitialized = true;
      } catch (fallbackError) {
        console.error('Failed to initialize RAG service:', fallbackError);
        throw fallbackError;
      }
    }
  }

  private async precomputeEmbeddings() {
    console.log('Pre-computing document embeddings...');
    
    for (const doc of TRADING_KNOWLEDGE_BASE) {
      try {
        const text = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`;
        const embedding = await this.getEmbedding(text);
        this.documentEmbeddings[doc.id] = embedding;
      } catch (error) {
        console.error(`Failed to compute embedding for document ${doc.id}:`, error);
      }
    }
    
    console.log(`Computed embeddings for ${Object.keys(this.documentEmbeddings).length} documents`);
  }

  private async getEmbedding(text: string): Promise<number[]> {
    if (!this.embedder) {
      throw new Error('RAG service not initialized');
    }

    const output = await this.embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async search(query: string, topK: number = 3, category?: string): Promise<SearchResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Get query embedding
      const queryEmbedding = await this.getEmbedding(query);
      
      // Calculate similarities
      const results: SearchResult[] = [];
      
      for (const doc of TRADING_KNOWLEDGE_BASE) {
        // Filter by category if specified
        if (category && doc.category !== category) continue;
        
        const docEmbedding = this.documentEmbeddings[doc.id];
        if (!docEmbedding) continue;
        
        const similarity = this.cosineSimilarity(queryEmbedding, docEmbedding);
        
        // Extract relevant excerpt (simple approach - use first 200 chars)
        const excerpt = doc.content.length > 200 
          ? doc.content.substring(0, 200) + '...'
          : doc.content;
        
        results.push({
          document: doc,
          similarity,
          relevantExcerpt: excerpt
        });
      }
      
      // Sort by similarity and return top K
      return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
        
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      return [];
    }
  }

  async generateContextualAdvice(
    patterns: any[],
    marketData: any,
    query?: string
  ): Promise<string> {
    try {
      // Build search query from patterns and market data
      const patternNames = patterns.map(p => p.name).join(' ');
      const searchQuery = query || `${patternNames} trading strategy market analysis`;
      
      // Search for relevant documents
      const searchResults = await this.search(searchQuery, 5);
      
      if (searchResults.length === 0) {
        return this.getFallbackAdvice(patterns, marketData);
      }

      // Combine retrieved knowledge with current analysis
      let contextualAdvice = "Based on trading literature and current market analysis:\\n\\n";
      
      // Add pattern-specific knowledge
      const patternAdvice = searchResults
        .filter(r => r.document.category === 'pattern')
        .slice(0, 2);
        
      if (patternAdvice.length > 0) {
        contextualAdvice += "**Pattern Analysis:**\\n";
        patternAdvice.forEach(result => {
          contextualAdvice += `• ${result.document.title}: ${result.relevantExcerpt}\\n\\n`;
        });
      }

      // Add strategy recommendations
      const strategyAdvice = searchResults
        .filter(r => r.document.category === 'strategy')
        .slice(0, 1);
        
      if (strategyAdvice.length > 0) {
        contextualAdvice += "**Strategy Recommendation:**\\n";
        contextualAdvice += `${strategyAdvice[0].relevantExcerpt}\\n\\n`;
      }

      // Add risk management insights
      const riskAdvice = searchResults
        .filter(r => r.document.category === 'risk_management')
        .slice(0, 1);
        
      if (riskAdvice.length > 0) {
        contextualAdvice += "**Risk Management:**\\n";
        contextualAdvice += `${riskAdvice[0].relevantExcerpt}\\n\\n`;
      }

      return contextualAdvice;
      
    } catch (error) {
      console.error('Error generating contextual advice:', error);
      return this.getFallbackAdvice(patterns, marketData);
    }
  }

  private getFallbackAdvice(patterns: any[], marketData: any): string {
    return `Analysis of ${patterns.length} detected patterns suggests a ${
      patterns.some(p => p.type === 'bullish') ? 'potentially bullish' : 
      patterns.some(p => p.type === 'bearish') ? 'potentially bearish' : 'neutral'
    } outlook. Consider current market conditions and risk management before making trading decisions.`;
  }
}

// Singleton instance
export const ragService = new RAGService();

// Initialize on module load
ragService.initialize().catch(console.error);