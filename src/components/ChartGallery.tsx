import React from 'react';
import { BarChart3, TrendingUp, PieChart, Download } from 'lucide-react';

interface Chart {
  id: string;
  title: string;
  type: string;
  image: string;
  description: string;
}

interface ChartGalleryProps {
  charts?: Chart[];
  isLoading: boolean;
}

function ChartGallery({ charts, isLoading }: ChartGalleryProps) {
  const getChartIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bar':
        return <BarChart3 className="w-5 h-5" />;
      case 'line':
        return <TrendingUp className="w-5 h-5" />;
      case 'pie':
        return <PieChart className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const handleDownload = async (chart: Chart) => {
    try {
      const response = await fetch(chart.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${chart.title.replace(/ /g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading chart:', error);
      alert('Failed to download chart.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-blue-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">Generating Charts...</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!charts || charts.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Charts will be generated automatically after data analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Generated Charts</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charts.map((chart) => (
          <div
            key={chart.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group"
          >
            <div className="relative overflow-hidden">
              <img
                src={chart.image}
                alt={chart.title}
                className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                {getChartIcon(chart.type)}
                <span className="text-sm font-medium capitalize">{chart.type}</span>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleDownload(chart)}
                  className="bg-white/90 backdrop-blur-sm rounded-lg p-2 hover:bg-white transition-colors duration-200"
                >
                  <Download className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{chart.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{chart.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          📊 Charts are automatically generated based on your data structure and AI recommendations. 
          Each visualization is optimized to highlight key patterns and insights in your dataset.
        </p>
      </div>
    </div>
  );
}

export default ChartGallery;