import os
import cv2

from ingestion.videofeed import sampling
from services.inference.model import YOLO_Inference

script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'models/YoloGC.pt')

cap = cv2.VideoCapture(os.path.join(script_dir,'test/test_video.mp4'))
def main():
    yolo = YOLO_Inference(model_path)

    for frames in sampling(cap):
        predictions = yolo.predict(frames)

        print("Current Counts:", predictions)

if __name__ == "__main__":
    main()