import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState('');
  const [documents, setDocuments] = useState([]);
  const [uploadPath, setUploadPath] = useState('./documents');
  const [file, setFile] = useState(null);
  const [customPath, setCustomPath] = useState('');

  // Fetch available models
  useEffect(() => {
    fetch('http://localhost:5000/models')
      .then(res => res.json())
      .then(setModels);
  }, []);

  // Fetch documents
  useEffect(() => {
    fetchDocuments();
  }, [uploadPath]);

  const fetchDocuments = () => {
    fetch('http://localhost:5000/documents')
      .then(res => res.json())
      .then(setDocuments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    setResponse(data.response || data.error);
  };

  const handleModelChange = async (model) => {
    setCurrentModel(model);
    await fetch('http://localhost:5000/model', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model })
    });
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', customPath);
    
    await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    });
    
    setFile(null);
    setCustomPath('');
    fetchDocuments();
  };

  const setNewUploadPath = async () => {
    await fetch('http://localhost:5000/set-upload-path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: uploadPath })
    });
    fetchDocuments();
  };

  return (
    <div className="app">
      <div className="sidebar">
        <h2>AI Models</h2>
        <select value={currentModel} onChange={(e) => handleModelChange(e.target.value)}>
          <option value="">Select Model</option>
          {models.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
        
        <h2>Document Storage</h2>
        <div className="path-selector">
          <input 
            type="text" 
            value={uploadPath} 
            onChange={(e) => setUploadPath(e.target.value)} 
            placeholder="Storage path" 
          />
          <button onClick={setNewUploadPath}>Set Path</button>
        </div>
        
        <h2>Upload Document</h2>
        <form onSubmit={handleFileUpload}>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
          />
          <input 
            type="text" 
            value={customPath} 
            onChange={(e) => setCustomPath(e.target.value)} 
            placeholder="Subdirectory (optional)" 
          />
          <button type="submit">Upload</button>
        </form>
        
        <h2>Documents</h2>
        <ul>
          {documents.map(doc => (
            <li key={doc.path}>
              {doc.name} - {(doc.size / 1024).toFixed(2)}KB
            </li>
          ))}
        </ul>
      </div>
      
      <div className="chat-container">
        <div className="chat-history">
          {response && <div className="message">{response}</div>}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask something..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;