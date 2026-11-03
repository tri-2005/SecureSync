from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from transfer import send_file, delete_file, rename_file
import time
import os

WATCH_FOLDER = r"C:\SyncFolder"
MARKER_FILE = r"C:\SecureSync\.received"

REMOTE_EVENT_TIMEOUT = 3

recent_remote_events = {}


def wait_for_file(file_path):
    previous_size = -1

    while True:
        if not os.path.exists(file_path):
            return False

        current_size = os.path.getsize(file_path)

        if current_size == previous_size:
            return True

        previous_size = current_size
        time.sleep(1)


def mark_remote_event(file_path):
    recent_remote_events[file_path] = time.time()


def is_remote_event(file_path):

    current_time = time.time()

    # Remove old remote-event records
    expired_paths = []

    for path, timestamp in recent_remote_events.items():
        if current_time - timestamp > REMOTE_EVENT_TIMEOUT:
            expired_paths.append(path)

    for path in expired_paths:
        del recent_remote_events[path]

    # Check marker file
    if os.path.exists(MARKER_FILE):

        try:
            with open(MARKER_FILE, "r") as marker:
                received_file = marker.read().strip()

            if received_file == file_path:

                # Remember this remote event
                mark_remote_event(file_path)

                # Remove marker
                os.remove(MARKER_FILE)

                return True

        except Exception:
            pass

    # Check recently received remote event
    if file_path in recent_remote_events:
        return True

    return False


class SyncFolderHandler(FileSystemEventHandler):

    def on_created(self, event):

        if event.is_directory:
            return

        print(f"FILE CREATED: {event.src_path}")

        # Best-effort logging
        try:
            import event_logger
            event_logger.log_event("CREATE", event.src_path, "Windows Watcher", "Completed")
        except Exception:
            pass

        if is_remote_event(event.src_path):
            print("File came from Kali. Skipping transfer.")
            return

        if wait_for_file(event.src_path):
            print("File is stable. Starting transfer...")
            send_file(event.src_path)

    def on_modified(self, event):

        if event.is_directory:
            return

        print(f"FILE MODIFIED: {event.src_path}")

        # Best-effort logging
        try:
            import event_logger
            event_logger.log_event("MODIFY", event.src_path, "Windows Watcher", "Completed")
        except Exception:
            pass

        if is_remote_event(event.src_path):
            print("Modification came from Kali. Skipping transfer.")
            return

        if wait_for_file(event.src_path):
            print("Modified file is stable. Starting transfer...")
            send_file(event.src_path)

    def on_deleted(self, event):

        if event.is_directory:
            return

        print(f"FILE DELETED: {event.src_path}")

        # Best-effort logging
        try:
            import event_logger
            event_logger.log_event("DELETE", event.src_path, "Windows Watcher", "Completed")
        except Exception:
            pass

        if is_remote_event(event.src_path):
            print("Deletion came from Kali. Skipping transfer.")
            return

        print("Sending delete request to Kali...")
        delete_file(event.src_path)

    def on_moved(self, event):

        if event.is_directory:
            return

        print(f"FILE RENAMED: {event.src_path} -> {event.dest_path}")

        # Best-effort logging
        try:
            import event_logger
            rename_label = f"{os.path.basename(event.src_path)} → {os.path.basename(event.dest_path)}"
            event_logger.log_event("RENAME", rename_label, "Windows Watcher", "Completed")
        except Exception:
            pass

        if is_remote_event(event.dest_path):
            print("Rename came from Kali. Skipping transfer.")
            return

        print("Sending rename request to Kali...")
        rename_file(event.src_path, event.dest_path)


event_handler = SyncFolderHandler()

observer = Observer()
observer.schedule(
    event_handler,
    WATCH_FOLDER,
    recursive=True
)

observer.start()

print(f"Watching folder: {WATCH_FOLDER}")

try:

    while True:
        time.sleep(1)

except KeyboardInterrupt:

    print("Stopping watcher...")
    observer.stop()

observer.join()