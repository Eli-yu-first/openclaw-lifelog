"""
Human Activity Recognition (HAR) Service for OpenClaw LifeLog

This service analyzes video data to recognize human activities
and returns structured behavior data.
"""

import os
import base64
import tempfile
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List
from collections import Counter

from flask import Flask, request, jsonify
from flask_cors import CORS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Activity mapping from pose/motion to semantic activities
ACTIVITY_MAPPING = {
    'standing_still': 'idle',
    'walking': 'moving',
    'sitting': 'resting',
    'arm_up_down_motion': 'brushing_teeth',
    'face_touching': 'washing_face',
    'drinking_motion': 'drinking_water',
    'typing': 'working',
    'reaching': 'taking_item',
    'door_interaction': 'leaving_home'
}

# Activity categories for routing to appropriate agents
ACTIVITY_CATEGORIES = {
    'dental-hygiene': ['brushing_teeth', 'flossing', 'mouthwash'],
    'morning-routine': ['washing_face', 'showering', 'waking_up', 'breakfast', 'getting_dressed'],
    'work-life': ['working', 'drinking_water', 'resting', 'standing', 'walking'],
    'departure': ['leaving_home', 'taking_keys', 'taking_phone', 'taking_wallet', 'taking_bag'],
    'health': ['exercising', 'sleeping', 'eating']
}


class ActivityRecognizer:
    """
    Activity recognition using pose estimation and motion analysis.
    
    In production, this would use models like:
    - YOLOv8-Pose for pose estimation
    - MediaPipe for hand/face tracking
    - Custom CNN/RNN for activity classification
    """
    
    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load the activity recognition model."""
        try:
            # In production, load actual model here
            # self.model = YOLO(self.model_path or 'yolov8n-pose.pt')
            logger.info("Activity recognition model loaded (simulation mode)")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
    
    def analyze_video(self, video_path: str) -> List[Dict[str, Any]]:
        """
        Analyze video and return detected activities.
        
        Args:
            video_path: Path to the video file
            
        Returns:
            List of detected activities with timestamps
        """
        activities = []
        
        try:
            # In production, this would:
            # 1. Open video with cv2.VideoCapture
            # 2. Process each frame with pose estimation
            # 3. Analyze pose sequences to detect activities
            # 4. Return timestamped activity list
            
            # Simulation: return sample activity
            activities.append({
                'activity': 'idle',
                'start_frame': 0,
                'end_frame': 100,
                'confidence': 0.85
            })
            
        except Exception as e:
            logger.error(f"Error analyzing video: {e}")
        
        return activities
    
    def infer_activity_from_poses(self, poses: List[Dict]) -> str:
        """
        Infer activity from a sequence of pose keypoints.
        
        Args:
            poses: List of pose keypoint dictionaries
            
        Returns:
            Inferred activity name
        """
        # In production, this would analyze:
        # - Hand positions relative to face (brushing teeth, washing face)
        # - Body posture (sitting, standing, walking)
        # - Motion patterns (repetitive motions, direction)
        
        return 'idle'


# Global recognizer instance
recognizer = ActivityRecognizer()


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'har-service',
        'version': '1.0.0',
        'timestamp': datetime.utcnow().isoformat()
    })


@app.route('/analyze', methods=['POST'])
def analyze_video():
    """
    Analyze video for human activities.
    
    Request body:
    {
        "video": "<base64_encoded_video>",
        "timestamp": "2026-02-03T08:15:30Z",
        "options": {
            "min_confidence": 0.5,
            "include_poses": false
        }
    }
    
    Response:
    {
        "timestamp": "2026-02-03T08:15:30Z",
        "activity": "brushing_teeth",
        "duration_seconds": 120,
        "confidence": 0.92,
        "category": "dental-hygiene",
        "all_activities": [...]
    }
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        video_base64 = data.get('video')
        timestamp = data.get('timestamp', datetime.utcnow().isoformat())
        options = data.get('options', {})
        
        if not video_base64:
            return jsonify({'error': 'No video data provided'}), 400
        
        # Decode video
        try:
            video_bytes = base64.b64decode(video_base64)
        except Exception as e:
            return jsonify({'error': f'Invalid base64 video data: {e}'}), 400
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as f:
            f.write(video_bytes)
            video_path = f.name
        
        try:
            # Analyze video
            activities = recognizer.analyze_video(video_path)
            
            if not activities:
                return jsonify({
                    'timestamp': timestamp,
                    'activity': 'unknown',
                    'duration_seconds': 0,
                    'confidence': 0,
                    'category': None,
                    'message': 'No activities detected'
                })
            
            # Find main activity
            activity_counts = Counter([a['activity'] for a in activities])
            main_activity = activity_counts.most_common(1)[0][0]
            
            # Calculate confidence
            main_activity_frames = sum(
                a['end_frame'] - a['start_frame'] 
                for a in activities 
                if a['activity'] == main_activity
            )
            total_frames = sum(a['end_frame'] - a['start_frame'] for a in activities)
            confidence = main_activity_frames / total_frames if total_frames > 0 else 0
            
            # Determine category
            category = None
            for cat, acts in ACTIVITY_CATEGORIES.items():
                if main_activity in acts:
                    category = cat
                    break
            
            # Calculate duration (assuming 30fps)
            fps = 30
            duration_seconds = total_frames / fps
            
            response = {
                'timestamp': timestamp,
                'activity': main_activity,
                'duration_seconds': round(duration_seconds, 2),
                'confidence': round(confidence, 3),
                'category': category,
                'all_activities': activities if options.get('include_all', False) else None
            }
            
            # Remove None values
            response = {k: v for k, v in response.items() if v is not None}
            
            return jsonify(response)
            
        finally:
            # Clean up temporary file
            if os.path.exists(video_path):
                os.remove(video_path)
                
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/activities', methods=['GET'])
def list_activities():
    """List all supported activities."""
    return jsonify({
        'activities': list(ACTIVITY_MAPPING.values()),
        'categories': ACTIVITY_CATEGORIES
    })


@app.route('/analyze/image', methods=['POST'])
def analyze_image():
    """
    Analyze a single image for human pose/activity.
    
    Request body:
    {
        "image": "<base64_encoded_image>",
        "timestamp": "2026-02-03T08:15:30Z"
    }
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        image_base64 = data.get('image')
        timestamp = data.get('timestamp', datetime.utcnow().isoformat())
        
        if not image_base64:
            return jsonify({'error': 'No image data provided'}), 400
        
        # In production, analyze the image
        # For now, return a placeholder response
        return jsonify({
            'timestamp': timestamp,
            'pose': 'standing',
            'confidence': 0.85,
            'keypoints': None  # Would contain pose keypoints in production
        })
        
    except Exception as e:
        logger.error(f"Error processing image: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'false').lower() == 'true'
    
    logger.info(f"Starting HAR service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
