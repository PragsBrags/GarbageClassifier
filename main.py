import os
import cv2

from ingestion.sampler import sampling
from ingestion.video_source import video_source
from services.inference.registry import build_inference_service
from services.inference.service import InferenceService

script_dir = os.path.dirname(os.path.abspath(__file__))

def main():

    cap = video_source()

    InferenceService = build_inference_service(
        model_name=selected_model,
        project_root=script_dir,
    )
    
    for frames in sampling(cap):
        predictions = InferenceService.predict(frames)
        print("Current Counts:", predictions)

if __name__ == "__main__":
    main()