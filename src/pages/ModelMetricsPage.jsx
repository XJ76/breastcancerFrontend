import React, { useEffect } from 'react';
import { Spinner } from 'flowbite-react';
import useBreastCancerStore from '../store/breastCancerStore';
import ModelMetrics from '../components/ModelMetrics';

const ModelMetricsPage = () => {
  const { metrics, metricsLoading, metricsError, fetchModelMetrics } = useBreastCancerStore();

  useEffect(() => {
    fetchModelMetrics();
  }, [fetchModelMetrics]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Model Performance Analysis</h1>
      
      {metricsLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" color="pink" />
          <p className="ml-4 text-lg text-pink-500">Loading model metrics...</p>
        </div>
      ) : metricsError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{metricsError}</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ModelMetrics metrics={metrics} />
        </div>
      )}
    </div>
  );
};

export default ModelMetricsPage; 