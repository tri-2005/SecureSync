import json
import os
import threading

CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config.json")
_lock = threading.Lock()

DEFAULT_CONFIG = {
    "node_name": "Windows Workstation",
    "role": "windows",
    "local_ip": "127.0.0.1",
    "local_port": 5001,
    "remote_ip": "192.168.1.10",
    "remote_port": 5000,
    "sync_folder": r"C:\SyncFolder",
    "api_port": 8000
}


def get_config():
    """Load configuration from config.json with fallback defaults."""
    with _lock:
        if not os.path.exists(CONFIG_PATH):
            return DEFAULT_CONFIG.copy()
        
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                # Merge with defaults to ensure all keys exist
                merged = DEFAULT_CONFIG.copy()
                merged.update(data)
                return merged
        except Exception as e:
            print(f"[config_manager] Error reading config: {e}")
            return DEFAULT_CONFIG.copy()


def save_config(new_config):
    """Save updated configuration dictionary back to config.json."""
    with _lock:
        try:
            current = DEFAULT_CONFIG.copy()
            if os.path.exists(CONFIG_PATH):
                with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                    current.update(json.load(f))
            
            current.update(new_config)
            
            with open(CONFIG_PATH, "w", encoding="utf-8") as f:
                json.dump(current, f, indent=2)
            
            return True, "Configuration saved successfully."
        except Exception as e:
            err_msg = f"Failed to save configuration: {str(e)}"
            print(f"[config_manager] {err_msg}")
            return False, err_msg
