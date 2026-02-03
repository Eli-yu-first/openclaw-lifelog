"""
Human Activity Recognition (HAR) Service for OpenClaw LifeLog
Full-spectrum behavior analysis covering all life scenarios

This service analyzes video/image data to recognize human activities
and returns structured behavior data for routing to appropriate agents.
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

# Complete activity categories covering all life scenarios (14 categories, 120+ activities)
ACTIVITY_CATEGORIES = {
    "health-fitness": [
        "exercising", "walking", "running", "cycling", "swimming",
        "yoga", "stretching", "weight_training", "sports", "climbing_stairs"
    ],
    "nutrition-diet": [
        "eating_breakfast", "eating_lunch", "eating_dinner", "snacking",
        "drinking_water", "drinking_coffee", "drinking_tea", "drinking_alcohol",
        "cooking", "ordering_food"
    ],
    "sleep-rest": [
        "going_to_bed", "falling_asleep", "waking_up", "getting_out_of_bed",
        "napping", "resting", "insomnia", "night_waking"
    ],
    "social-communication": [
        "phone_calling", "video_calling", "texting", "meeting_people",
        "attending_party", "family_time", "dating", "networking",
        "online_chatting", "social_media"
    ],
    "entertainment-leisure": [
        "watching_tv", "watching_movie", "playing_games", "listening_music",
        "reading_book", "browsing_internet", "watching_video", "photography",
        "drawing_painting", "playing_instrument", "gardening", "crafting", "collecting"
    ],
    "learning-education": [
        "studying", "attending_class", "online_learning", "reading_textbook",
        "doing_homework", "taking_notes", "reviewing", "practicing",
        "researching", "writing_paper", "coding_learning", "language_learning"
    ],
    "finance-shopping": [
        "shopping_online", "shopping_offline", "grocery_shopping", "paying_bills",
        "banking", "investing", "budgeting", "comparing_prices",
        "returning_items", "using_coupons"
    ],
    "home-environment": [
        "cleaning", "vacuuming", "mopping", "doing_laundry", "folding_clothes",
        "ironing", "washing_dishes", "organizing", "taking_out_trash",
        "watering_plants", "pet_care", "home_repair", "decorating"
    ],
    "transportation-travel": [
        "commuting", "driving", "taking_bus", "taking_subway", "taking_taxi",
        "riding_bike", "riding_scooter", "walking_commute", "flying",
        "taking_train", "traveling", "business_trip"
    ],
    "personal-care": [
        "brushing_teeth", "flossing", "mouthwash", "washing_face", "showering",
        "bathing", "washing_hair", "skincare", "shaving", "makeup",
        "nail_care", "hair_styling", "getting_haircut", "medical_checkup",
        "taking_medicine", "using_toilet"
    ],
    "productivity-focus": [
        "working", "computer_work", "typing", "writing", "meeting",
        "presenting", "brainstorming", "planning", "emailing", "phone_work",
        "deep_work", "break_time", "procrastinating"
    ],
    "emotional-wellness": [
        "meditating", "deep_breathing", "journaling", "therapy_session",
        "relaxing", "crying", "laughing", "stress_relief",
        "gratitude_practice", "self_reflection", "mood_tracking"
    ],
    "morning-routine": [
        "morning_routine_start", "morning_stretch", "morning_exercise",
        "getting_dressed"
    ],
    "departure": [
        "leaving_home", "checking_items", "taking_keys", "taking_wallet",
        "taking_phone", "taking_bag"
    ]
}

# Build lookup tables
ALL_ACTIVITIES = []
ACTIVITY_TO_CATEGORY = {}
for category, activities in ACTIVITY_CATEGORIES.items():
    ALL_ACTIVITIES.extend(activities)
    for activity in activities:
        ACTIVITY_TO_CATEGORY[activity] = category


def get_activity_category(activity: str) -> str:
    """Get the category (target agent) for a given activity."""
    return ACTIVITY_TO_CATEGORY.get(activity, "unknown")


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
            logger.info(f"Supported activities: {len(ALL_ACTIVITIES)}")
            logger.info(f"Supported categories: {len(ACTIVITY_CATEGORIES)}")
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
                'activity': 'working',
                'start_frame': 0,
                'end_frame': 100,
                'confidence': 0.85,
                'category': 'productivity-focus'
            })
            
        except Exception as e:
            logger.error(f"Error analyzing video: {e}")
        
        return activities
    
    def analyze_image(self, image_path: str) -> Dict[str, Any]:
        """
        Analyze a single image for activity detection.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Detected activity information
        """
        try:
            # In production, this would analyze the image
            # For now, return a placeholder
            return {
                'activity': 'computer_work',
                'confidence': 0.78,
                'category': 'productivity-focus',
                'detected_objects': ['person', 'computer', 'desk'],
                'pose': 'sitting'
            }
        except Exception as e:
            logger.error(f"Error analyzing image: {e}")
            return {'activity': 'unknown', 'confidence': 0}


# Global recognizer instance
recognizer = ActivityRecognizer()


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'har-service',
        'version': '2.0.0',
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'total_activities': len(ALL_ACTIVITIES),
        'total_categories': len(ACTIVITY_CATEGORIES)
    })


@app.route('/activities', methods=['GET'])
def list_activities():
    """List all supported activities grouped by category."""
    return jsonify({
        'categories': ACTIVITY_CATEGORIES,
        'total_activities': len(ALL_ACTIVITIES),
        'total_categories': len(ACTIVITY_CATEGORIES)
    })


@app.route('/activities/<category>', methods=['GET'])
def list_category_activities(category):
    """List activities for a specific category."""
    if category not in ACTIVITY_CATEGORIES:
        return jsonify({
            'error': 'Category not found',
            'available_categories': list(ACTIVITY_CATEGORIES.keys())
        }), 404
    
    return jsonify({
        'category': category,
        'activities': ACTIVITY_CATEGORIES[category],
        'count': len(ACTIVITY_CATEGORIES[category])
    })


@app.route('/category/<activity>', methods=['GET'])
def get_category(activity):
    """Get the category (target agent) for a specific activity."""
    category = get_activity_category(activity)
    if category == "unknown":
        return jsonify({
            'error': 'Activity not found',
            'activity': activity,
            'suggestion': 'Use /activities endpoint to see all supported activities'
        }), 404
    
    return jsonify({
        'activity': activity,
        'category': category,
        'target_agent': category,
        'all_activities_in_category': ACTIVITY_CATEGORIES.get(category, [])
    })


@app.route('/analyze', methods=['POST'])
def analyze_video():
    """
    Analyze video for human activities.
    
    Request body:
    {
        "video": "<base64_encoded_video>",
        "timestamp": "2026-02-03T08:15:30Z",
        "context": {
            "location": "home",
            "time_of_day": "morning"
        },
        "options": {
            "min_confidence": 0.5,
            "include_all": false
        }
    }
    
    Response:
    {
        "timestamp": "2026-02-03T08:15:30Z",
        "activity": "brushing_teeth",
        "duration_seconds": 120,
        "confidence": 0.92,
        "category": "personal-care",
        "target_agent": "personal-care",
        "routing": {...}
    }
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        video_base64 = data.get('video')
        timestamp = data.get('timestamp', datetime.utcnow().isoformat() + 'Z')
        context = data.get('context', {})
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
            
            # Determine category (target agent)
            category = get_activity_category(main_activity)
            
            # Calculate duration (assuming 30fps)
            fps = 30
            duration_seconds = total_frames / fps
            
            response = {
                'timestamp': timestamp,
                'activity': main_activity,
                'duration_seconds': round(duration_seconds, 2),
                'confidence': round(confidence, 3),
                'category': category,
                'target_agent': category,
                'context': context,
                'routing': {
                    'activity': main_activity,
                    'target_agent': category,
                    'confidence': round(confidence, 3)
                }
            }
            
            if options.get('include_all', False):
                response['all_activities'] = activities
            
            return jsonify(response)
            
        finally:
            # Clean up temporary file
            if os.path.exists(video_path):
                os.remove(video_path)
                
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/analyze/image', methods=['POST'])
def analyze_image():
    """
    Analyze a single image for human pose/activity.
    
    Request body:
    {
        "image": "<base64_encoded_image>",
        "timestamp": "2026-02-03T08:15:30Z",
        "context": {}
    }
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        image_base64 = data.get('image')
        timestamp = data.get('timestamp', datetime.utcnow().isoformat() + 'Z')
        context = data.get('context', {})
        
        if not image_base64:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode image
        try:
            image_bytes = base64.b64decode(image_base64)
        except Exception as e:
            return jsonify({'error': f'Invalid base64 image data: {e}'}), 400
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
            f.write(image_bytes)
            image_path = f.name
        
        try:
            # Analyze image
            result = recognizer.analyze_image(image_path)
            
            activity = result.get('activity', 'unknown')
            category = get_activity_category(activity)
            
            return jsonify({
                'timestamp': timestamp,
                'activity': activity,
                'confidence': result.get('confidence', 0),
                'category': category,
                'target_agent': category,
                'detected_objects': result.get('detected_objects', []),
                'pose': result.get('pose'),
                'context': context,
                'routing': {
                    'activity': activity,
                    'target_agent': category,
                    'confidence': result.get('confidence', 0)
                }
            })
            
        finally:
            if os.path.exists(image_path):
                os.remove(image_path)
        
    except Exception as e:
        logger.error(f"Error processing image: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/analyze/stream', methods=['POST'])
def analyze_stream():
    """
    Analyze continuous video stream (multiple frames).
    
    Request body:
    {
        "frames": ["<base64_frame1>", "<base64_frame2>", ...],
        "session_id": "session_123",
        "context": {}
    }
    """
    try:
        data = request.json
        
        if not data or 'frames' not in data:
            return jsonify({
                'error': 'Missing frames data',
                'required_fields': ['frames'],
                'optional_fields': ['session_id', 'context']
            }), 400
        
        session_id = data.get('session_id', 'default')
        context = data.get('context', {})
        frames = data.get('frames', [])
        
        # Aggregate activities across frames
        activity_counts = Counter()
        confidence_sums = {}
        
        for frame in frames:
            try:
                # Decode and analyze each frame
                frame_bytes = base64.b64decode(frame)
                with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
                    f.write(frame_bytes)
                    result = recognizer.analyze_image(f.name)
                    os.remove(f.name)
                
                activity = result.get('activity', 'unknown')
                confidence = result.get('confidence', 0)
                
                activity_counts[activity] += 1
                if activity not in confidence_sums:
                    confidence_sums[activity] = 0
                confidence_sums[activity] += confidence
                
            except Exception as e:
                logger.warning(f"Error processing frame: {e}")
        
        # Build aggregated results
        aggregated_activities = []
        for activity, count in activity_counts.most_common():
            category = get_activity_category(activity)
            avg_confidence = confidence_sums.get(activity, 0) / count if count > 0 else 0
            aggregated_activities.append({
                'activity': activity,
                'category': category,
                'target_agent': category,
                'occurrence_count': count,
                'average_confidence': round(avg_confidence, 3)
            })
        
        return jsonify({
            'session_id': session_id,
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'frames_analyzed': len(frames),
            'aggregated_activities': aggregated_activities,
            'context': context
        })
        
    except Exception as e:
        logger.error(f"Error processing stream: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'false').lower() == 'true'
    
    logger.info(f"Starting HAR service on port {port}")
    logger.info(f"Total supported activities: {len(ALL_ACTIVITIES)}")
    logger.info(f"Total categories: {len(ACTIVITY_CATEGORIES)}")
    app.run(host='0.0.0.0', port=port, debug=debug)
