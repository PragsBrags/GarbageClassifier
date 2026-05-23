from collections import Counter
import supervision as sv
import torch, torchvision
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
import torchvision.transforms.functional as F

class FRCNN_Inference:
    def __init__(self, model_path, class_names):
        self.model_weights = torch.load(model_path)
        self.model = torchvision.models.detection.fasterrcnn_resnet50_fpn_v2(weights=None)
        in_features = self.model.roi_heads.box_predictor.cls_score.in_features
        self.model.roi_heads.box_predictor = FastRCNNPredictor(in_features, 7)
        self.model.load_state_dict(self.model_weights["model_state_dict"])
        self.model.eval()
        self.class_names = self._build_class_name_map(class_names)
        self.tracker = sv.ByteTrack()
        self.seen_track_ids = set()
        self.total_counts = Counter()
    
    def _build_class_name_map(self, class_names):
        class_names = class_names

        return {
            class_id: name
            for class_id, name in enumerate(class_names, start=1)
        }

    def predict(self, frame):
        frame = F.to_tensor(frame)

        with torch.no_grad():
            result = self.model([frame])[0]

        boxes = result["boxes"].detach().cpu().numpy()
        scores = result["scores"].detach().cpu().numpy()
        labels = result["labels"].detach().cpu().numpy()

        detections = sv.Detections(
        xyxy=boxes,
        confidence=scores,
        class_id=labels
        )

        detections = self.tracker.update_with_detections(detections=detections)

        track_ids = detections.tracker_id
        class_ids = detections.class_id

        for track_id, class_id in zip(track_ids, class_ids):
            track_id = int(track_id)
            if track_id not in self.seen_track_ids:
                self.seen_track_ids.add(track_id)
                class_name = self.class_names.get(int(class_id), "unknown")
                self.total_counts[class_name] += 1

        return dict(self.total_counts)