from collections import Counter
from ultralytics import YOLO
import numpy as np

class YOLO_Inference():
    def __init__(self, model_path):
        self.model = YOLO(model_path)
        self.seen_classes = set()
        self.total_counts = Counter()
    
    def predict(self, frame):
        results = self.model.track(frame, persist=True, tracker="tracker/bytetrack.yaml")
        for result in results:
            boxes = result.boxes
            if boxes is None:
                continue
            track_ids = boxes.id.cpu().numpy()
            class_ids = boxes.cls.cpu().numpy()

            for track_id, class_id in zip(track_ids, class_ids):
                if track_id not in self.seen_classes:
                    self.seen_classes.add(track_id)
                    class_name = self.model.names[int(class_id)]
                    self.total_counts[class_name] += 1

        return dict(self.total_counts)


