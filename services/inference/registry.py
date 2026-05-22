from pathlib import Path

from services.inference.service import InferenceService
from services.inference.adapters.yolo_adapter import YOLO_Inference as YoloAdapter



MODEL_REGISTRY = {
    "yolo_gc": {
        "adapter": YoloAdapter,
        "preprocessor": YoloPreprocessor,
        "weights": "models/YoloGC.pt",
        "tracker": "tracker/bytetrack.yaml",
        "input_size": (640, 640),
    },
    "faster_rcnn_gc": {
        "adapter": FasterRCNNAdapter,
        "preprocessor": FasterRCNNPreprocessor,
        "weights": "models/Fasterrcnn_bestmodel.pth",
        "input_size": (800, 800),
    },
}


def build_inference_service(model_name, project_root):
    if model_name not in MODEL_REGISTRY:
        available_models = ", ".join(MODEL_REGISTRY.keys())
        raise ValueError(
            f"Unknown model '{model_name}'. Available models: {available_models}"
        )

    config = MODEL_REGISTRY[model_name]
    project_root = Path(project_root)

    weights_path = project_root / config["weights"]

    preprocessor = config["preprocessor"](
        input_size=config["input_size"]
    )

    if model_name == "yolo_gc":
        model_adapter = config["adapter"](
            model_path=weights_path,
            tracker_path=project_root / config["tracker"],
        )
    else:
        model_adapter = config["adapter"](
            model_path=weights_path,
        )

    return InferenceService(
        model_adapter=model_adapter,
        preprocessor=preprocessor,
    )