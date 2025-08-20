
import React, { useState } from 'react';
import axios from 'axios';
import { Rss, Upload, Download, FileText } from 'lucide-react';

function FeedsPanel() {
  const [products, setProducts] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!products.trim()) return;
    
    setLoading(true);
    try {
      const productList = products.split('\n').filter(p => p.trim());
      const res = await axios.post('/api/feeds/generate', { products: productList });
      setResults(res.data.results || []);
    } catch (err) {
      console.error('Feed generation failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csv = 'Product,Description\n' + 
      results.map(r => `"${r.product}","${r.description}"`).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-descriptions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Rss className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-900">Product Feeds</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product List (one per line)
            </label>
            <textarea
              value={products}
              onChange={(e) => setProducts(e.target.value)}
              placeholder="iPhone 14 Pro&#10;Samsung Galaxy S23&#10;MacBook Pro 14-inch&#10;..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={10}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !products.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Generate Descriptions</span>
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Generated Descriptions</h3>
            {results.length > 0 && (
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{result.product}</h4>
                    <p className="text-gray-700 text-sm">{result.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <Rss className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Enter product names to generate descriptions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedsPanel;
