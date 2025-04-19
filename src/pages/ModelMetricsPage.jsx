import React, { useEffect } from 'react';

import { Spinner } from 'flowbite-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import ModelMetrics from '../components/ModelMetrics';
import useBreastCancerStore from '../store/breastCancerStore';

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
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dummy Chart</h2>
            <LineChart width={600} height={300} data={metrics}>
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelMetricsPage; 