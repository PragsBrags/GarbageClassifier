import cv2
import numpy as np

def letterbox (frame, resized_shape=(640,640), color=(114,114,114)):
    # Resizes and adds padding to the input frame while maintaining aspect ratio
    shape = frame.shape[:2]

    #Scale factor (new/old)
    r = min(resized_shape[0]/shape[0], resized_shape[1]/shape[1])

    # Compute padding
    new_unpad = (int(round(shape[1] * r)), int(round(shape[0] * r)))
    dw, dh = resized_shape[1] - new_unpad[0], resized_shape[0] - new_unpad[1]  # wh padding
    
    dw /= 2  # divide padding into top/bottom, left/right
    dh /= 2

    if shape[::-1] != new_unpad:  # resize
        frame = cv2.resize(frame, new_unpad, interpolation=cv2.INTER_LINEAR)
        
    top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
    left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
    
    frame = cv2.copyMakeBorder(frame, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)
    return frame

def ROI_cropping(frame):
     #ROI coordinates
        h,w,_ = frame.shape
        ymin, ymax = int(h * 0.3), int(h * 0.7)
        xmin, xmax = int(w * 0.3), int(w * 0.7)
        return xmin, xmax, ymin, ymax