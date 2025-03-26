import React from 'react';

const ModelMetrics = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="metrics-container">
      <h2 className="text-2xl font-bold mb-6">Model Performance Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Accuracy</h3>
          <p className="text-3xl font-bold text-blue-600">
            {(metrics.accuracy * 100).toFixed(2)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Precision</h3>
          <p className="text-3xl font-bold text-blue-600">
            {(metrics.precision * 100).toFixed(2)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Recall</h3>
          <p className="text-3xl font-bold text-blue-600">
            {(metrics.recall * 100).toFixed(2)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">F1 Score</h3>
          <p className="text-3xl font-bold text-blue-600">
            {(metrics.f1 * 100).toFixed(2)}%
          </p>
        </div>
      </div>
      {metrics.plot && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Model Metrics Visualization</h3>
          <img
            src={`data:image/png;base64,${metrics.plot}`}
            alt="Model Metrics Visualization"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ModelMetrics; 