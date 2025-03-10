import { useState } from "react";
import { FileInput, Label, Modal, Spinner } from "flowbite-react";

const RawImageComponent = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [symptoms, setSymptoms] = useState({ symptoms: [""] });
  const [diagnosis, setDiagnosis] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  const handleFileUpload = (event) => {
    setLoading(true);
    // Here we would make an API call to the AI model
    setTimeout(() => {
      setLoading(false);
      setShowModal(true);
    }, 2000); // Simulate AI processing time
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
    const newSymptoms = [...symptoms.symptoms];
    newSymptoms[index] = event.target.value;
    setSymptoms({ symptoms: newSymptoms });
  };

  const addSymptomField = () => {
    setSymptoms({ symptoms: [...symptoms.symptoms, ""] });
  };

  const handleSubmit = () => {
    // Here we would combine image analysis with symptoms for final diagnosis
    console.log("Processing image and symptoms:", symptoms);
    // Mock diagnosis - in production this would come from AI model
    setDiagnosis("Based on the image analysis and symptoms, further examination is recommended");
    setRecommendations([
      "Schedule follow-up with specialist",
      "Additional imaging may be required",
      "Regular self-examination advised"
    ]);
    closeModal();
  };

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-6">
      <div className="flex flex-col gap-8 p-8 bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex w-full items-center justify-center text-3xl font-bold mb-6 text-gray-800">
          <h1>Upload Image</h1>
        </div>
        <div className="flex w-full items-center justify-center">
          <Label
            htmlFor="dropzone-file"
            className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-4 border-dashed border-pink-400 bg-gray-100 hover:bg-gray-200 transition duration-300 transform hover:scale-105"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5 px-4">
              {loading ? (
                <div className="flex flex-col items-center">
                  <Spinner size="xl" color="pink" />
                  <p className="mt-4 text-lg text-gray-500 font-semibold">
                    Analyzing Image...
                  </p>
                  <p className="text-sm text-gray-400">
                    Our AI model is processing your image.
                  </p>
                </div>
              ) : (
                <>
                  <svg
                    className="mb-4 h-12 w-12 text-pink-600"
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
                      Click to upload the{" "}
                      <span className="font-bold">image</span>
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-700">
                    PNG, JPG, JPEG
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
          <h2 className="text-xl font-semibold mb-4">AI Analysis Results</h2>
          {diagnosis ? (
            <>
              <p className="text-base font-medium mb-2">Diagnosis: {diagnosis}</p>
              <ul className="list-disc list-inside">
                {recommendations && recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600">{rec}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-base text-gray-500">
              Upload an image to receive AI-powered analysis and recommendations.
            </p>
          )}
        </div>
      </div>
      {showModal || showRecommendations ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      ) : null}
      <Modal show={showModal} onClose={closeModal}>
        <Modal.Header className="bg-gray-100 text-gray-800">Additional Symptoms</Modal.Header>
        <Modal.Body className="bg-gray-100">
          <p className="text-gray-800">Please add any additional symptoms or concerns.</p>
          {symptoms.symptoms.map((symptom, index) => (
            <input
              key={index}
              type="text"
              value={symptom}
              onChange={(event) => handleSymptomChange(index, event)}
              className="w-full p-2 mt-2 mb-2 border rounded"
              placeholder="Enter symptom or concern"
            />
          ))}
          <button
            className="bg-pink-600 text-white px-4 py-2 rounded mt-2 hover:bg-pink-700"
            onClick={addSymptomField}
          >
            + Add more symptoms
          </button>
        </Modal.Body>
        <Modal.Footer className="bg-gray-100">
          <button
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
            onClick={closeModal}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
      <Modal show={showRecommendations} onClose={closeRecommendationsModal}>
        <Modal.Header className="bg-gray-100 text-gray-800">Detailed Analysis</Modal.Header>
        <Modal.Body className="bg-gray-100">
          <h2 className="text-xl font-semibold mb-4">AI Analysis Results</h2>
          {diagnosis ? (
            <>
              <p className="text-base font-medium mb-4">{diagnosis}</p>
              <h3 className="text-lg font-medium mb-2">Recommendations:</h3>
              <ul className="list-disc list-inside">
                {recommendations && recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600 mb-2">{rec}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-base text-gray-500">
              No analysis available. Please upload an image first.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-gray-100">
          <button
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
            onClick={closeRecommendationsModal}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RawImageComponent;
