# Local-AI-Agent
Self-hosted local AI agent to safely use inside companies


# GPT4ALL Web Interface

![Project Demo](demo-screenshot.png)

A full-featured web interface for interacting with GPT4ALL models, managing documents, and configuring storage locations. This project provides a user-friendly frontend for your local GPT4ALL installation with document management capabilities.

## Features

- **Chat Interface**: Interact with your GPT4ALL models
- **Model Management**: List and switch between different AI models
- **Document Upload**: Store files with custom subdirectory support
- **Document Browser**: View existing documents with file sizes
- **Configurable Storage**: Set custom storage locations at runtime
- **Responsive UI**: Clean and intuitive interface

## Installation

### Prerequisites
- Python 3.7+
- Node.js 16+
- GPT4ALL installed locally

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install flask flask-cors
```

3. Configure environment variables:
```bash
export UPLOAD_DIR=/path/to/your/storage
export MODELS_DIR=/path/to/your/models
```

### Frontend Setup

1. Install dependencies:
```bash
npx create-react-app frontend
cd frontend
npm install
```

2. Replace the default files:
- Replace `src/App.js` with the provided frontend code
- Replace `src/App.css` with the provided CSS

## Running the Application

### Start the Backend
```bash
python app.py
```

### Start the Frontend
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Configuration

The application can be configured through environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `UPLOAD_DIR` | `./documents` | Document storage location |
| `MODELS_DIR` | `./models` | Directory containing GPT4ALL models |
| `FLASK_PORT` | `5000` | Backend server port |

## Project Structure

```
gpt4all-web-interface/
├── app.py               # Flask backend server
├── frontend/            # React application
│   ├── src/
│   │   ├── App.js       # Main application component
│   │   └── App.css      # Application styles
│   └── package.json
└── README.md
```

## Notes and Limitations

1. The current implementation uses a mock GPT4ALL interface - you'll need to integrate the actual GPT4ALL bindings
2. File uploads are limited to 100MB by default (Flask configuration)
3. The UI doesn't support multiple chat sessions - each prompt replaces the previous response
4. Security features are minimal - add authentication for production use

## Future Improvements

- [ ] Implement actual GPT4ALL integration
- [ ] Add document search functionality
- [ ] Support multiple chat sessions/history
- [ ] Add file preview capabilities
- [ ] Implement user authentication
- [ ] Add document deletion functionality
- [ ] Support chunked file uploads for large documents

## Security Considerations

For production use:
1. Add authentication (JWT or session-based)
2. Implement file type validation
3. Add rate limiting to API endpoints
4. Sanitize path inputs to prevent directory traversal attacks
5. Use HTTPS for all communications

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.