import cv2
import os

def video_source():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    cap = cv2.VideoCapture(os.path.join(script_dir,'test/test_video.mp4'))
    return cap