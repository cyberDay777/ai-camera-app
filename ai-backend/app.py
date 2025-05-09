from flask import Flask, request, jsonify
import base64
import cv2
import numpy as np
from io import BytesIO
from PIL import Image

app = Flask(__name__)

def enhance_image(img_np):
    result = cv2.detailEnhance(img_np, sigma_s=10, sigma_r=0.15)
    return result

@app.route('/enhance', methods=['POST'])
def enhance():
    data = request.get_json()
    img_base64 = data['image']
    img_bytes = base64.b64decode(img_base64)
    img = Image.open(BytesIO(img_bytes)).convert('RGB')
    img_np = np.array(img)

    enhanced_np = enhance_image(img_np)
    _, buffer = cv2.imencode('.png', enhanced_np)
    img_b64 = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({'image': img_b64})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
