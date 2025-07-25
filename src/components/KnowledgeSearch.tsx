import { useState } from 'react';
import { Search, BookOpen, Brain, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ragService } from '@/services/ragService';
import { KNOWLEDGE_CATEGORIES } from '@/data/tradingKnowledgeBase';

interface SearchResult {
  document: any;
  similarity: number;
  relevantExcerpt: string;
}

export const KnowledgeSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const searchResults = await ragService.search(query, 5);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pattern':
        return <TrendingUp className="h-4 w-4" />;
      case 'strategy':
        return <Brain className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pattern':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'strategy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'indicator':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'risk_management':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'psychology':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Trading Knowledge Base</h3>
      </div>
      
      <div className="flex space-x-2">
        <Input
          placeholder="Search trading patterns, strategies, indicators..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button 
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Found {results.length} relevant results
          </p>
          
          {results.map((result, index) => (
            <Card key={index} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(result.document.category)}
                  <h4 className="font-medium text-foreground">
                    {result.document.title}
                  </h4>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(result.document.category)}>
                    {KNOWLEDGE_CATEGORIES[result.document.category as keyof typeof KNOWLEDGE_CATEGORIES]}
                  </Badge>
                  <Badge variant="outline">
                    {(result.similarity * 100).toFixed(0)}% match
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {result.relevantExcerpt}
              </p>
              
              {result.document.tags && (
                <div className="flex flex-wrap gap-1">
                  {result.document.tags.map((tag: string, tagIndex: number) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {result.document.source && (
                <p className="text-xs text-muted-foreground italic">
                  Source: {result.document.source}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
      
      {results.length === 0 && query && !isSearching && (
        <Card className="p-6 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            No results found for "{query}". Try different keywords or browse categories.
          </p>
        </Card>
      )}
    </div>
  );
};