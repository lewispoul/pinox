/**
 * M9.6 Performance Optimization - Bundle Analysis Component
 * 
 * Advanced bundle analysis and optimization tools for NOX Documentation v8.0.0
 * Provides real-time bundle size monitoring, chunk analysis, and performance insights.
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    AlertTriangle,
    BarChart3,
    CheckCircle,
    Download,
    FileText,
    Package,
    TrendingUp,
    Zap
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface BundleChunk {
  id: string;
  name: string;
  size: number;
  gzipSize: number;
  modules: number;
  assets: string[];
  isInitial: boolean;
  isAsync: boolean;
}

interface BundleAnalysis {
  totalSize: number;
  totalGzipSize: number;
  chunks: BundleChunk[];
  dependencies: {
    name: string;
    size: number;
    version: string;
    treeshakable: boolean;
  }[];
  recommendations: {
    type: 'warning' | 'error' | 'info';
    message: string;
    impact: 'high' | 'medium' | 'low';
    solution: string;
  }[];
  performance: {
    loadTime: number;
    parseTime: number;
    firstPaint: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
  };
}

export default function BundleAnalyzer() {
  const [analysis, setAnalysis] = useState<BundleAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedChunk, setSelectedChunk] = useState<BundleChunk | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(true);

  const analyzeBundles = useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate bundle analysis (in real app, would call webpack-bundle-analyzer API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis: BundleAnalysis = {
        totalSize: 1024 * 512, // 512KB
        totalGzipSize: 1024 * 128, // 128KB gzipped
        chunks: [
          {
            id: '1',
            name: 'main',
            size: 1024 * 256,
            gzipSize: 1024 * 64,
            modules: 45,
            assets: ['main.js', 'main.css'],
            isInitial: true,
            isAsync: false,
          },
          {
            id: '2',
            name: 'vendor',
            size: 1024 * 180,
            gzipSize: 1024 * 45,
            modules: 23,
            assets: ['vendor.js'],
            isInitial: true,
            isAsync: false,
          },
          {
            id: '3',
            name: 'components',
            size: 1024 * 76,
            gzipSize: 1024 * 19,
            modules: 12,
            assets: ['components.js'],
            isInitial: false,
            isAsync: true,
          },
        ],
        dependencies: [
          { name: 'react', size: 1024 * 42, version: '18.2.0', treeshakable: false },
          { name: 'react-dom', size: 1024 * 38, version: '18.2.0', treeshakable: false },
          { name: 'next', size: 1024 * 67, version: '15.4.6', treeshakable: true },
          { name: 'lucide-react', size: 1024 * 28, version: '0.263.1', treeshakable: true },
        ],
        recommendations: [
          {
            type: 'warning',
            message: 'Large vendor chunk detected',
            impact: 'medium',
            solution: 'Consider splitting vendor dependencies into smaller chunks'
          },
          {
            type: 'info',
            message: 'Good gzip compression ratio',
            impact: 'low',
            solution: 'Current gzip compression is optimal (75% reduction)'
          },
          {
            type: 'warning',
            message: 'Unused exports detected',
            impact: 'medium',
            solution: 'Enable tree shaking for lucide-react imports'
          },
        ],
        performance: {
          loadTime: 1200,
          parseTime: 280,
          firstPaint: 1450,
          firstContentfulPaint: 1680,
          largestContentfulPaint: 2100,
          cumulativeLayoutShift: 0.02,
        },
      };
      
      setAnalysis(mockAnalysis);
    } catch (error) {
      console.error('Bundle analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  useEffect(() => {
    // Auto-analyze on component mount
    analyzeBundles();
  }, [analyzeBundles]);

  const formatSize = (bytes: number): string => {
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const getChunkColor = (chunk: BundleChunk): string => {
    if (chunk.isInitial) return 'bg-blue-500';
    if (chunk.isAsync) return 'bg-green-500';
    return 'bg-gray-500';
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const downloadReport = () => {
    if (!analysis) return;
    
    const report = {
      timestamp: new Date().toISOString(),
      analysis,
      summary: {
        totalSize: formatSize(analysis.totalSize),
        compressionRatio: `${(((analysis.totalSize - analysis.totalGzipSize) / analysis.totalSize) * 100).toFixed(1)}%`,
        chunksCount: analysis.chunks.length,
        dependenciesCount: analysis.dependencies.length,
      }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bundle-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!analysis) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Bundle Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Analyzing bundles...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Bundle Overview
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={analyzeBundles}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  <BarChart3 className="h-4 w-4" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatSize(analysis.totalSize)}</div>
              <div className="text-sm text-muted-foreground">Total Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatSize(analysis.totalGzipSize)}</div>
              <div className="text-sm text-muted-foreground">Gzipped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analysis.chunks.length}</div>
              <div className="text-sm text-muted-foreground">Chunks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analysis.dependencies.length}</div>
              <div className="text-sm text-muted-foreground">Dependencies</div>
            </div>
          </div>

          {/* Compression Ratio */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Compression Ratio</span>
              <span className="text-sm text-muted-foreground">
                {(((analysis.totalSize - analysis.totalGzipSize) / analysis.totalSize) * 100).toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={((analysis.totalSize - analysis.totalGzipSize) / analysis.totalSize) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Chunks Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Chunks Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.chunks.map((chunk) => (
              <div
                key={chunk.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedChunk?.id === chunk.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedChunk(selectedChunk?.id === chunk.id ? null : chunk)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{chunk.name}</div>
                  <Badge variant={chunk.isInitial ? "default" : "secondary"}>
                    {chunk.isInitial ? 'Initial' : 'Async'}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>Size: {formatSize(chunk.size)}</div>
                  <div>Gzipped: {formatSize(chunk.gzipSize)}</div>
                  <div>Modules: {chunk.modules}</div>
                </div>

                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Compression</span>
                    <span className="text-xs">
                      {(((chunk.size - chunk.gzipSize) / chunk.size) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress 
                    value={((chunk.size - chunk.gzipSize) / chunk.size) * 100} 
                    className="h-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Load Time</span>
                <span className="text-sm text-muted-foreground">{analysis.performance.loadTime}ms</span>
              </div>
              <Progress value={Math.min((analysis.performance.loadTime / 3000) * 100, 100)} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">First Contentful Paint</span>
                <span className="text-sm text-muted-foreground">{analysis.performance.firstContentfulPaint}ms</span>
              </div>
              <Progress value={Math.min((analysis.performance.firstContentfulPaint / 2500) * 100, 100)} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Largest Contentful Paint</span>
                <span className="text-sm text-muted-foreground">{analysis.performance.largestContentfulPaint}ms</span>
              </div>
              <Progress value={Math.min((analysis.performance.largestContentfulPaint / 4000) * 100, 100)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {showRecommendations && analysis.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Optimization Recommendations
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRecommendations(false)}
              >
                Dismiss
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                  {getRecommendationIcon(rec.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{rec.message}</span>
                      <Badge variant={rec.impact === 'high' ? 'destructive' : rec.impact === 'medium' ? 'default' : 'secondary'}>
                        {rec.impact}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{rec.solution}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Chunk Details */}
      {selectedChunk && (
        <Card>
          <CardHeader>
            <CardTitle>Chunk Details: {selectedChunk.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Assets:</div>
                {selectedChunk.assets.map((asset, index) => (
                  <Badge key={index} variant="outline">
                    {asset}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Properties:</div>
                <div className="text-sm text-muted-foreground">
                  <div>Modules: {selectedChunk.modules}</div>
                  <div>Type: {selectedChunk.isInitial ? 'Initial Load' : 'Lazy Loaded'}</div>
                  <div>Async: {selectedChunk.isAsync ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
