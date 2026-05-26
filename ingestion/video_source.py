import cv2
import os
from pathlib import Path

def video_source(video_config, project_root):
    source = video_config["source"]
    video_path = os.path.join(project_root, source)
    filename = Path(video_path).name
    #video_path = project_root / source
    return cv2.VideoCapture(str(video_path)), filename