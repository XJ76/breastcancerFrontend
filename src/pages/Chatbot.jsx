import { useState, useEffect } from "react";
import { Modal, Button, TextInput, Spinner } from "flowbite-react";
import { Resizable } from "re-resizable";

const dataset = {
  "Lump in breast,changes in breast size": ["Invasive Ductal Carcinoma", "Schedule an immediate mammogram and consult your doctor. This is the most common type of breast cancer that starts in the milk ducts."],
  "Dimpling of breast skin,nipple changes": ["Inflammatory Breast Cancer", "Seek immediate medical attention. This aggressive form requires prompt treatment. Look for redness, swelling and skin changes."],
  "Nipple discharge,breast pain": ["Ductal Carcinoma In Situ (DCIS)", "Schedule a diagnostic mammogram. Early detection is key. This non-invasive cancer has high cure rates when caught early."],
  "Thickening of breast tissue,skin changes": ["Lobular Carcinoma", "Consult your healthcare provider. This type starts in the milk-producing glands and may be harder to detect on mammograms."],
  "Family history,genetic concerns": ["Hereditary Breast Cancer", "Consider genetic testing for BRCA1/BRCA2 mutations. Discuss preventive measures with your doctor."],
  "Regular screening,prevention": ["Preventive Care", "Schedule annual mammograms after 40, perform monthly self-exams, maintain healthy weight, limit alcohol, exercise regularly."],
  "Diet and lifestyle": ["Risk Reduction", "Eat a balanced diet rich in fruits and vegetables, maintain healthy weight, limit alcohol intake, stay physically active."],
  "Early detection methods": ["Screening Guidelines", "Monthly self-exams, annual clinical breast exams, mammograms as recommended by your doctor based on age and risk factors."],
  "Treatment options": ["Medical Advice", "Options may include surgery, radiation, chemotherapy, hormone therapy. Treatment plans are personalized based on cancer type and stage."],
  "Support resources": ["Support Services", "Connect with support groups, counseling services, and breast cancer organizations for emotional and practical support."]
};

const ChatBotComponent = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showChat) {
      const initialMessage = { 
        text: "Hello, I'm your Breast Cancer AI Assistant. I can provide information about breast cancer types, prevention, and early detection. Please select from the topics above or ask a question.", 
        sender: "bot" 
      };
      setMessages([initialMessage]);
    }
  }, [showChat]);

  const handleSendMessage = (topic) => {
    const newMessage = { text: topic, sender: "user" };
    setMessages([...messages, newMessage]);
    setLoading(true);

    setTimeout(() => {
      const information = dataset[topic];
      let botMessage;
      if (information) {
        botMessage = { 
          text: `${information[0]}: ${information[1]}`, 
          sender: "bot" 
        };
      } else {
        botMessage = { 
          text: "I apologize, but I don't have specific information about that. Please consult with a healthcare professional for medical advice.", 
          sender: "bot" 
        };
      }
      setMessages((prevMessages) => [...prevMessages, botMessage, { 
        text: "Would you like information about other breast cancer topics?", 
        sender: "bot" 
      }]);
      setLoading(false);
    }, 1000);
  };

  const handleAdditionalHelp = async (query) => {
    const newMessage = { text: query, sender: "user" };
    setMessages([...messages, newMessage]);
    setLoading(true);

    // Generic response for additional questions
    setTimeout(() => {
      const botMessage = {
        text: "For specific medical advice, please consult with your healthcare provider. Remember to: 1) Perform monthly self-exams 2) Get regular mammograms 3) Maintain a healthy lifestyle 4) Know your family history",
        sender: "bot"
      };
      setMessages((prevMessages) => [...prevMessages, botMessage, {
        text: "Is there anything else you'd like to know about breast cancer?",
        sender: "bot"
      }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-pink-400 to-pink-600">
      <Button onClick={() => setShowChat(true)} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-pink-600 shadow-lg hover:bg-gray-200">
        Open Breast Cancer Assistant
      </Button>
      <Modal show={showChat} onClose={() => setShowChat(false)} size="5xl">
        <Modal.Header className="bg-pink-600 text-white">Breast Cancer AI Assistant</Modal.Header>
        <Modal.Body className="bg-gray-100">
          <Resizable
            defaultSize={{
              width: 1000,
              height: 600,
            }}
            minWidth={800}
            minHeight={400}
            maxWidth={1200}
            maxHeight={800}
            className="bg-white rounded-lg shadow-lg"
          >
            <div className="flex flex-col space-y-4 p-4">
              <div className="flex flex-wrap space-x-2">
                {Object.keys(dataset).map((topic, index) => (
                  <Button key={index} onClick={() => handleSendMessage(topic)} className="m-1 bg-pink-500 text-white hover:bg-pink-700">
                    {topic}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col space-y-2 overflow-y-auto max-h-64 p-4 bg-gray-200 rounded-lg">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg ${
                      message.sender === "user" ? "bg-pink-500 text-white self-end" : "bg-gray-300 text-gray-800 self-start"
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
                {loading && (
                  <div className="self-start">
                    <Spinner size="sm" color="pink" />
                  </div>
                )}
              </div>
              <TextInput
                placeholder="Ask a question about breast cancer..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAdditionalHelp(input);
                    setInput("");
                  }
                }}
                className="border border-pink-300 rounded-lg p-2"
              />
            </div>
          </Resizable>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ChatBotComponent;
