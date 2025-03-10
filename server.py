from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from diffusers import StableDiffusionPipeline
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Check for GPU
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load Stable Diffusion Model
model_id = "CompVis/stable-diffusion-v1-4"
pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float16 if device == "cuda" else torch.float32
)
pipe.to(device)

@app.route("/generate", methods=["POST"])
def generate_image():
    data = request.json
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    image = pipe(prompt, guidance_scale=8.5).images[0]

    # Convert image to base64 for easy frontend display
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return jsonify({"image_url": f"data:image/png;base64,{img_str}"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
