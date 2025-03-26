import { useState, useEffect } from "react";
import { FileInput, Label, Modal, Spinner } from "flowbite-react";
import useBreastCancerStore from "../store/breastCancerStore";
import ModelMetrics from "./ModelMetrics";

const BreastCancerDetectionComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [symptoms, setSymptoms] = useState([""]);
  const [diagnosis, setDiagnosis] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  const {
    result,
    metrics,
    loading,
    metricsLoading,
    error: apiError,
    metricsError,
    detectBreastCancer,
    fetchModelMetrics,
  } = useBreastCancerStore();

  useEffect(() => {
    // Fetch model metrics when component mounts
    fetchModelMetrics();
  }, [fetchModelMetrics]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await detectBreastCancer(file);
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleRecommendationsClick = () => {
    setShowRecommendations(true);
  };

  const closeRecommendationsModal = () => {
    setShowRecommendations(false);
  };

  const handleSymptomChange = (index, event) => {
    const newSymptoms = [...symptoms];
    newSymptoms[index] = event.target.value;
    setSymptoms(newSymptoms);
  };

  const addSymptomField = () => {
    setSymptoms([...symptoms, ""]);
  };

  const handleSubmit = () => {
    if (result) {
      setDiagnosis(result.prediction);
      setRecommendations(result.message);
    } else {
      setError("Unable to determine diagnosis from given symptoms or mammogram image");
    }
    closeModal();
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-6">
      <div className="flex flex-col gap-8 p-8 bg-white rounded-2xl shadow-2xl w-full max-w-2xl mb-8">
        <div className="flex w-full items-center justify-center text-3xl font-bold mb-6 text-gray-800">
          <h1>Upload Mammogram Image</h1>
        </div>
        <div className="flex w-full items-center justify-center">
          <Label
            htmlFor="dropzone-file"
            className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-4 border-dashed border-gray-500 bg-gray-100 hover:bg-gray-200 transition duration-300 transform hover:scale-105"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5 px-4">
              {loading ? (
                <div className="flex flex-col items-center">
                  <Spinner size="xl" color="pink" />
                  <p className="mt-4 text-lg text-pink-500 font-semibold">
                    Analyzing Mammogram...
                  </p>
                  <p className="text-sm text-pink-300">
                    Please wait while we process your mammogram image.
                  </p>
                </div>
              ) : (
                <>
                  <svg
                    className="mb-4 h-12 w-12 text-gray-700"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-700">
                    <span className="font-semibold">
                      Click to upload your{" "}
                      <span className="font-bold">mammogram image</span>
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-700">
                    DICOM, PNG, JPG, JPEG
                  </p>
                </>
              )}
            </div>
            <FileInput
              id="dropzone-file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </Label>
        </div>
        <div
          className="w-full h-64 p-6 bg-gray-100 border rounded-xl text-gray-800 shadow-inner transition duration-300 transform hover:scale-105 cursor-pointer"
          onClick={handleRecommendationsClick}
        >
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          {loading ? (
            <p className="text-base">Analyzing mammogram...</p>
          ) : apiError ? (
            <p className="text-base text-red-500">{apiError}</p>
          ) : result ? (
            <>
              <p className="text-base">Prediction: {result.prediction}</p>
              <p className="text-base">Confidence: {(result.confidence * 100).toFixed(2)}%</p>
              <p className="text-base">{result.message}</p>
            </>
          ) : (
            <p className="text-base">Upload an image to get started</p>
          )}
        </div>
      </div>

      {/* Model Metrics Section */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8">
        {metricsLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner size="xl" color="pink" />
            <p className="ml-4 text-lg text-pink-500">Loading model metrics...</p>
          </div>
        ) : metricsError ? (
          <div className="text-red-500 text-center p-4">{metricsError}</div>
        ) : (
          <ModelMetrics metrics={metrics} />
        )}
      </div>

      {showModal || showRecommendations ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      ) : null}
      <Modal show={showModal} onClose={closeModal}>
        <Modal.Header className="bg-gray-100 text-gray-800">Additional Symptoms</Modal.Header>
        <Modal.Body className="bg-gray-100">
          <p className="text-gray-800">Please add any additional symptoms or observations you've noticed.</p>
          {symptoms.map((symptom, index) => (
            <input
              key={index}
              type="text"
              value={symptom}
              onChange={(event) => handleSymptomChange(index, event)}
              className="w-full p-2 mt-2 mb-2 border rounded"
              placeholder="Enter symptom"
            />
          ))}
          <button
            className="bg-pink-700 text-white px-4 py-2 rounded mt-2"
            onClick={addSymptomField}
          >
            + Add more symptoms
          </button>
        </Modal.Body>
        <Modal.Footer className="bg-gray-100">
          <button
            className="bg-pink-700 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded"
            onClick={closeModal}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
      <Modal show={showRecommendations} onClose={closeRecommendationsModal}>
        <Modal.Header className="bg-gray-100 text-gray-800">Analysis Results</Modal.Header>
        <Modal.Body className="bg-gray-100">
          <h2 className="text-xl font-semibold mb-4">Detailed Analysis</h2>
          {loading ? (
            <p className="text-base">Analyzing mammogram...</p>
          ) : apiError ? (
            <p className="text-base text-red-500">{apiError}</p>
          ) : result ? (
            <>
              <p className="text-base">Prediction: {result.prediction}</p>
              <p className="text-base">Confidence: {(result.confidence * 100).toFixed(2)}%</p>
              <p className="text-base">{result.message}</p>
            </>
          ) : (
            <p className="text-base">No results available</p>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-gray-100">
          <button
            className="bg-pink-700 text-white px-4 py-2 rounded"
            onClick={closeRecommendationsModal}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BreastCancerDetectionComponent;
