import json
import os
import threading
from datetime import datetime

LOG_PATH = os.path.join(os.path.dirname(__file__), "securesync_logs.json")
_lock = threading.Lock()

MAX_LOG_ENTRIES = 200


def _load_log_data():
    if not os.path.exists(LOG_PATH):
        return {"activity_logs": [], "transfers": []}
    try:
        with open(LOG_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            if not isinstance(data, dict):
                return {"activity_logs": [], "transfers": []}
            return {
                "activity_logs": data.get("activity_logs", []),
                "transfers": data.get("transfers", [])
            }
    except Exception:
        return {"activity_logs": [], "transfers": []}


def log_event(event_type, file_path, source="Windows Watcher", status="Completed"):
    """
    Log a filesystem event (CREATE, MODIFY, DELETE, RENAME).
    BEST-EFFORT: Never raises an exception so sync operations are never interrupted.
    """
    try:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        filename = os.path.basename(file_path) if file_path else "unknown"
        
        entry = {
            "id": f"act-{int(datetime.now().timestamp() * 1000)}",
            "timestamp": timestamp,
            "event": event_type,
            "file": filename,
            "source": source,
            "status": status,
            "path": file_path
        }

        with _lock:
            data = _load_log_data()
            data["activity_logs"].insert(0, entry)
            data["activity_logs"] = data["activity_logs"][:MAX_LOG_ENTRIES]

            with open(LOG_PATH, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
    except Exception as e:
        # Silently catch any logging errors - best effort only
        pass


def log_transfer(filename, direction="Windows → Kali", status="Completed", bytes_sent=0):
    """
    Log a transfer record.
    BEST-EFFORT: Never raises an exception.
    """
    try:
        timestamp = datetime.now().strftime("%H:%M:%S")
        entry = {
            "id": f"t-{int(datetime.now().timestamp() * 1000)}",
            "file": filename,
            "direction": direction,
            "source": "Windows (C:\\SyncFolder)",
            "destination": "Kali (/home/trivikram/SyncFolder)",
            "status": status,
            "progress": 100 if status == "Completed" else 50,
            "speed": "TCP Stream",
            "time": timestamp
        }

        with _lock:
            data = _load_log_data()
            data["transfers"].insert(0, entry)
            data["transfers"] = data["transfers"][:MAX_LOG_ENTRIES]

            with open(LOG_PATH, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
    except Exception:
        pass


def get_logs():
    """Retrieve logged activity and transfers safely."""
    try:
        with _lock:
            return _load_log_data()
    except Exception:
        return {"activity_logs": [], "transfers": []}
