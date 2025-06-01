import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = os.environ.get('UPLOAD_DIR', './documents')
MODELS_DIR = os.environ.get('MODELS_DIR', './models')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# GPT4ALL Interface (Mock - replace with actual implementation)
class GPT4ALLInterface:
    def __init__(self):
        self.current_model = None
    
    def load_model(self, model_name):
        # Add actual model loading code here
        self.current_model = model_name
        return f"Loaded model: {model_name}"
    
    def generate_response(self, prompt):
        # Add actual inference code here
        return f"Response for: {prompt}"

gpt_interface = GPT4ALLInterface()

@app.route('/models', methods=['GET'])
def get_models():
    try:
        models = [f for f in os.listdir(MODELS_DIR) if f.endswith('.bin')]
        return jsonify(models)
    except FileNotFoundError:
        return jsonify([])

@app.route('/model', methods=['POST'])
def set_model():
    model = request.json.get('model')
    if model:
        result = gpt_interface.load_model(model)
        return jsonify({"status": result})
    return jsonify({"error": "Invalid model"}), 400

@app.route('/chat', methods=['POST'])
def chat():
    prompt = request.json.get('prompt')
    if prompt and gpt_interface.current_model:
        response = gpt_interface.generate_response(prompt)
        return jsonify({"response": response})
    return jsonify({"error": "Model not loaded or invalid prompt"}), 400

@app.route('/documents', methods=['GET'])
def list_documents():
    documents = []
    for root, _, files in os.walk(UPLOAD_FOLDER):
        for file in files:
            path = os.path.join(root, file)
            documents.append({
                "name": file,
                "path": os.path.relpath(path, UPLOAD_FOLDER),
                "size": os.path.getsize(path)
            })
    return jsonify(documents)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    custom_path = request.form.get('path', '')
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    filename = secure_filename(file.filename)
    target_dir = os.path.join(UPLOAD_FOLDER, custom_path)
    os.makedirs(target_dir, exist_ok=True)
    save_path = os.path.join(target_dir, filename)
    
    file.save(save_path)
    return jsonify({
        "message": "File uploaded successfully",
        "path": os.path.relpath(save_path, UPLOAD_FOLDER)
    })

@app.route('/set-upload-path', methods=['POST'])
def set_upload_path():
    global UPLOAD_FOLDER
    new_path = request.json.get('path')
    if new_path:
        UPLOAD_FOLDER = new_path
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        return jsonify({"message": f"Upload path set to {new_path}"})
    return jsonify({"error": "Invalid path"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)