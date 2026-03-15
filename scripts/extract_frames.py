"""
Extract key frames from the Brew Story anniversary video.
Uses OpenCV to capture frames at regular intervals, skipping near-duplicates.
"""
import cv2
import os
import numpy as np

VIDEO_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'Creative Inspo', 'Recording 2026-03-15 114506.mp4')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'stills')

# Extract a frame every N seconds
INTERVAL_SECONDS = 2
# Skip frames that are too similar (structural similarity threshold)
SIMILARITY_THRESHOLD = 0.92

def frame_similarity(f1, f2):
    """Simple histogram-based similarity check."""
    h1 = cv2.calcHist([f1], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])
    h2 = cv2.calcHist([f2], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])
    cv2.normalize(h1, h1)
    cv2.normalize(h2, h2)
    return cv2.compareHist(h1, h2, cv2.HISTCMP_CORREL)

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    cap = cv2.VideoCapture(VIDEO_PATH)
    if not cap.isOpened():
        print(f"ERROR: Cannot open video: {VIDEO_PATH}")
        return

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps
    frame_interval = int(fps * INTERVAL_SECONDS)

    print(f"Video: {duration:.1f}s, {fps:.0f} FPS, {total_frames} total frames")
    print(f"Extracting every {INTERVAL_SECONDS}s ({frame_interval} frames)")

    saved = []
    prev_frame = None
    frame_idx = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_idx % frame_interval == 0:
            # Check similarity to previous saved frame
            if prev_frame is not None:
                sim = frame_similarity(frame, prev_frame)
                if sim > SIMILARITY_THRESHOLD:
                    frame_idx += 1
                    continue

            timestamp = frame_idx / fps
            filename = f"still_{len(saved)+1:03d}_{timestamp:.0f}s.jpg"
            filepath = os.path.join(OUTPUT_DIR, filename)

            cv2.imwrite(filepath, frame, [cv2.IMWRITE_JPEG_QUALITY, 95])
            h, w = frame.shape[:2]
            saved.append(filename)
            prev_frame = frame.copy()
            print(f"  [{len(saved):2d}] {filename} ({w}x{h})")

        frame_idx += 1

    cap.release()
    print(f"\nExtracted {len(saved)} unique frames to {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
