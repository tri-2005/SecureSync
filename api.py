import http.server
import socketserver
import json
import os
import socket
import datetime
import urllib.parse

import config_manager
import event_logger
from transfer import send_file, delete_file, rename_file


API_PORT = 8000


def get_sync_folder():
    cfg = config_manager.get_config()
    folder = cfg.get("sync_folder", r"C:\SyncFolder")

    if not os.path.exists(folder):
        try:
            os.makedirs(folder, exist_ok=True)
        except Exception:
            pass

    return folder


def format_bytes(size_bytes):
    if size_bytes < 1024:
        return f"{size_bytes} B"

    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"

    elif size_bytes < 1024 * 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.1f} MB"

    else:
        return f"{size_bytes / (1024 * 1024 * 1024):.1f} GB"


# ---------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------

def check_secure_sync_service(ip, port):
    """
    Perform a real SecureSync health check.

    Sends:
        HEALTH

    Expected response:
        OK
    """

    sock = None

    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2.0)

        sock.connect((ip, int(port)))

        sock.sendall(b"HEALTH")

        response = sock.recv(2)

        return response == b"OK"

    except Exception:
        return False

    finally:
        if sock:
            try:
                sock.close()
            except Exception:
                pass


# ---------------------------------------------------------
# API HANDLER
# ---------------------------------------------------------

class SecureSyncAPIHandler(http.server.BaseHTTPRequestHandler):

    # -----------------------------------------------------
    # SEND JSON RESPONSE
    # -----------------------------------------------------

    def _send_json(self, data, status=200):

        try:
            body_bytes = json.dumps(data).encode("utf-8")

            self.send_response(status)

            self.send_header(
                "Content-Type",
                "application/json"
            )

            self.send_header(
                "Content-Length",
                str(len(body_bytes))
            )

            self.send_header(
                "Access-Control-Allow-Origin",
                "*"
            )

            self.send_header(
                "Access-Control-Allow-Methods",
                "GET, POST, DELETE, OPTIONS"
            )

            self.send_header(
                "Access-Control-Allow-Headers",
                "Content-Type"
            )

            self.end_headers()

            self.wfile.write(body_bytes)

        except (
            ConnectionError,
            ConnectionResetError,
            ConnectionAbortedError,
            BrokenPipeError,
            OSError
        ):
            # Browser closed the connection.
            # Do not crash the API.
            pass

    # -----------------------------------------------------
    # OPTIONS / CORS
    # -----------------------------------------------------

    def do_OPTIONS(self):

        self._send_json(
            {"status": "ok"},
            200
        )

    # -----------------------------------------------------
    # SILENCE DEFAULT HTTP LOGS
    # -----------------------------------------------------

    def log_message(self, format, *args):
        pass

    # =====================================================
    # GET REQUESTS
    # =====================================================

    def do_GET(self):

        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # -------------------------------------------------
        # 1. GET CONFIG
        # -------------------------------------------------

        if path == "/api/config":

            cfg = config_manager.get_config()

            self._send_json(
                cfg,
                200
            )

            return

        # -------------------------------------------------
        # 2. GET FILES
        # -------------------------------------------------

        elif path == "/api/files":

            sync_dir = get_sync_folder()

            files_list = []

            try:

                if os.path.exists(sync_dir):

                    entries = os.scandir(sync_dir)

                    for entry in entries:

                        if entry.is_file():

                            stat = entry.stat()

                            mod_time = (
                                datetime.datetime
                                .fromtimestamp(
                                    stat.st_mtime
                                )
                                .strftime(
                                    "%Y-%m-%d %H:%M:%S"
                                )
                            )

                            files_list.append(
                                {
                                    "id": f"real-{entry.name}",

                                    "name": entry.name,

                                    "size": format_bytes(
                                        stat.st_size
                                    ),

                                    "bytes": stat.st_size,

                                    "lastModified": mod_time,

                                    "source": "SyncFolder",

                                    "status": "Synced",

                                    "path": entry.path
                                }
                            )

                    files_list.sort(
                        key=lambda x: x["lastModified"],
                        reverse=True
                    )

            except Exception as error:

                print(
                    f"[API] Error reading sync directory: {error}"
                )

            self._send_json(
                files_list,
                200
            )

            return

        # -------------------------------------------------
        # 3. GET ACTIVITY LOGS
        # -------------------------------------------------

        elif path == "/api/logs":

            logs = event_logger.get_logs()

            self._send_json(
                logs.get(
                    "activity_logs",
                    []
                ),
                200
            )

            return

        # -------------------------------------------------
        # 4. GET TRANSFERS
        # -------------------------------------------------

        elif path == "/api/transfers":

            logs = event_logger.get_logs()

            self._send_json(
                logs.get(
                    "transfers",
                    []
                ),
                200
            )

            return

        # -------------------------------------------------
        # 5. GET SYSTEM STATUS
        # -------------------------------------------------

        elif path == "/api/status":

            cfg = config_manager.get_config()

            local_port = int(
                cfg.get(
                    "local_port",
                    5001
                )
            )

            remote_ip = cfg.get(
                "remote_ip",
                "192.168.1.10"
            )

            remote_port = int(
                cfg.get(
                    "remote_port",
                    5000
                )
            )

            sync_folder = cfg.get(
                "sync_folder",
                r"C:\SyncFolder"
            )

            # ---------------------------------------------
            # REAL WINDOWS RECEIVER HEALTH CHECK
            # ---------------------------------------------

            receiver_online = check_secure_sync_service(
                "127.0.0.1",
                local_port
            )

            # ---------------------------------------------
            # REAL KALI SERVER HEALTH CHECK
            # ---------------------------------------------

            remote_online = check_secure_sync_service(
                remote_ip,
                remote_port
            )

            response = {

                "local_node": {

                    "role": cfg.get(
                        "role",
                        "windows"
                    ),

                    "name": cfg.get(
                        "node_name",
                        "Windows Workstation"
                    ),

                    "receiver_status":
                        "Online"
                        if receiver_online
                        else "Not available",

                    "receiver_port":
                        local_port,

                    "sync_folder":
                        sync_folder,

                    "folder_exists":
                        os.path.exists(
                            sync_folder
                        )
                },

                "remote_node": {

                    "ip":
                        remote_ip,

                    "port":
                        remote_port,

                    "server_status":
                        "Online"
                        if remote_online
                        else "Not available"
                }
            }

            self._send_json(
                response,
                200
            )

            return

        # -------------------------------------------------
        # UNKNOWN GET ENDPOINT
        # -------------------------------------------------

        else:

            self._send_json(
                {
                    "error":
                        "Endpoint not found"
                },
                404
            )

    # =====================================================
    # POST REQUESTS
    # =====================================================

    def do_POST(self):

        parsed = urllib.parse.urlparse(
            self.path
        )

        path = parsed.path

        # -------------------------------------------------
        # READ REQUEST BODY
        # -------------------------------------------------

        content_length = int(
            self.headers.get(
                "Content-Length",
                0
            )
        )

        body = (
            self.rfile
            .read(content_length)
            .decode("utf-8")
            if content_length > 0
            else "{}"
        )

        try:

            data = json.loads(body)

        except Exception:

            data = {}

        # =================================================
        # 1. UPDATE NETWORK CONFIG
        # =================================================

        if path == "/api/config":

            success, message = (
                config_manager.save_config(
                    data
                )
            )

            self._send_json(
                {
                    "success":
                        success,

                    "message":
                        message
                },

                200
                if success
                else 400
            )

            return

        # =================================================
        # 2. TEST REMOTE CONNECTION
        # =================================================

        elif path == "/api/config/test":

            target_ip = (
                data.get("remote_ip")
                or
                config_manager
                .get_config()
                .get(
                    "remote_ip",
                    "192.168.1.10"
                )
            )

            target_port = int(
                data.get("remote_port")
                or
                config_manager
                .get_config()
                .get(
                    "remote_port",
                    5000
                )
            )

            success = check_secure_sync_service(
                target_ip,
                target_port
            )

            if success:

                self._send_json(
                    {
                        "success": True,

                        "message":
                            f"SecureSync connection successful to "
                            f"{target_ip}:{target_port}"
                    },

                    200
                )

            else:

                self._send_json(
                    {
                        "success": False,

                        "message":
                            f"SecureSync health check failed for "
                            f"{target_ip}:{target_port}"
                    },

                    200
                )

            return

        # =================================================
        # 3. CREATE FILE
        # =================================================

        elif path == "/api/files/create":

            filename = data.get(
                "filename"
            )

            content = data.get(
                "content",
                ""
            )

            # ---------------------------------------------
            # Validate filename
            # ---------------------------------------------

            if not filename:

                self._send_json(
                    {
                        "success": False,

                        "message":
                            "Filename is required"
                    },

                    400
                )

                return

            # ---------------------------------------------
            # Prevent paths such as:
            #
            # ../test.txt
            # C:\something
            # ---------------------------------------------

            if os.path.basename(
                filename
            ) != filename:

                self._send_json(
                    {
                        "success": False,

                        "message":
                            "Only filenames are allowed"
                    },

                    400
                )

                return

            # ---------------------------------------------
            # Get SyncFolder
            # ---------------------------------------------

            sync_dir = get_sync_folder()

            file_path = os.path.join(
                sync_dir,
                filename
            )

            # ---------------------------------------------
            # Don't overwrite existing files
            # ---------------------------------------------

            if os.path.exists(
                file_path
            ):

                self._send_json(
                    {
                        "success": False,

                        "message":
                            f"File already exists: {filename}"
                    },

                    409
                )

                return

            # ---------------------------------------------
            # Create the actual file
            # ---------------------------------------------

            try:

                with open(
                    file_path,
                    "w",
                    encoding="utf-8"
                ) as file:

                    file.write(
                        content
                    )

                # -----------------------------------------
                # Log UI creation
                # -----------------------------------------

                try:

                    event_logger.log_event(
                        "CREATE",
                        file_path,
                        "UI",
                        "Created"
                    )

                except Exception:

                    pass

                self._send_json(
                    {
                        "success": True,

                        "message":
                            f"Created {filename}"
                    },

                    201
                )

            except Exception as error:

                self._send_json(
                    {
                        "success": False,

                        "message":
                            f"Create failed: {str(error)}"
                    },

                    500
                )

            return

        # =================================================
        # 4. MANUAL SEND FILE
        # =================================================

        elif path == "/api/files/send":

            filename = data.get(
                "filename"
            )

            sync_dir = get_sync_folder()

            file_path = (
                os.path.join(
                    sync_dir,
                    filename
                )
                if filename
                else None
            )

            if (
                not file_path
                or
                not os.path.exists(
                    file_path
                )
            ):

                self._send_json(
                    {
                        "success": False,

                        "message":
                            f"File not found: {filename}"
                    },

                    404
                )

                return

            try:

                send_file(
                    file_path
                )

                self._send_json(
                    {
                        "success": True,

                        "message":
                            f"Sent {filename} via transfer.py"
                    },

                    200
                )

            except Exception as error:

                self._send_json(
                    {
                        "success": False,

                        "message":
                            f"Transfer failed: {str(error)}"
                    },

                    500
                )

            return

        # =================================================
        # 5. MANUAL RENAME FILE
        # =================================================

        elif path == "/api/files/rename":

            old_name = data.get(
                "old_filename"
            )

            new_name = data.get(
                "new_filename"
            )

            sync_dir = get_sync_folder()

            old_path = (
                os.path.join(
                    sync_dir,
                    old_name
                )
                if old_name
                else None
            )

            new_path = (
                os.path.join(
                    sync_dir,
                    new_name
                )
                if new_name
                else None
            )

            if (
                not old_path
                or
                not os.path.exists(
                    old_path
                )
            ):

                self._send_json(
                    {
                        "success": False,

                        "message":
                            f"Source file not found: {old_name}"
                    },

                    404
                )

                return

            try:

                os.rename(
                    old_path,
                    new_path
                )

                rename_file(
                    old_path,
                    new_path
                )

                self._send_json(
                    {
                        "success": True,

                        "message":
                            f"Renamed {old_name} → {new_name}"
                    },

                    200
                )

            except Exception as error:

                self._send_json(
                    {
                        "success": False,

                        "message":
                            f"Rename failed: {str(error)}"
                    },

                    500
                )

            return

        # =================================================
        # UNKNOWN POST ENDPOINT
        # =================================================

        else:

            self._send_json(
                {
                    "error":
                        "Endpoint not found"
                },

                404
            )

    # =====================================================
    # DELETE REQUESTS
    # =====================================================

    def do_DELETE(self):

        parsed = urllib.parse.urlparse(
            self.path
        )

        path = parsed.path

        # -------------------------------------------------
        # DELETE FILE
        # -------------------------------------------------

        if path.startswith(
            "/api/files/delete"
        ):

            query = urllib.parse.parse_qs(
                parsed.query
            )

            filename = query.get(
                "filename",
                [None]
            )[0]

            # ---------------------------------------------
            # Also support JSON body
            # ---------------------------------------------

            if not filename:

                content_length = int(
                    self.headers.get(
                        "Content-Length",
                        0
                    )
                )

                if content_length > 0:

                    body = (
                        self.rfile
                        .read(
                            content_length
                        )
                        .decode("utf-8")
                    )

                    try:

                        filename = json.loads(
                            body
                        ).get(
                            "filename"
                        )

                    except Exception:

                        filename = None

            sync_dir = get_sync_folder()

            file_path = (
                os.path.join(
                    sync_dir,
                    filename
                )
                if filename
                else None
            )

            if (
                file_path
                and
                os.path.exists(
                    file_path
                )
            ):

                try:

                    delete_file(
                        file_path
                    )

                    os.remove(
                        file_path
                    )

                    self._send_json(
                        {
                            "success": True,

                            "message":
                                f"Deleted {filename}"
                        },

                        200
                    )

                    return

                except Exception as error:

                    self._send_json(
                        {
                            "success": False,

                            "message":
                                f"Delete failed: {str(error)}"
                        },

                        500
                    )

                    return

            else:

                self._send_json(
                    {
                        "success": False,

                        "message":
                            f"File not found: {filename}"
                    },

                    404
                )

                return


# =========================================================
# THREADED HTTP SERVER
# =========================================================

class ThreadedHTTPServer(
    socketserver.ThreadingMixIn,
    socketserver.TCPServer
):

    daemon_threads = True

    allow_reuse_address = True

    def handle_error(
        self,
        request,
        client_address
    ):
        # Prevent broken client connections
        # from filling the terminal with tracebacks.
        pass


# =========================================================
# START SERVER
# =========================================================

def run_server():

    server_address = (
        "",
        API_PORT
    )

    httpd = ThreadedHTTPServer(
        server_address,
        SecureSyncAPIHandler
    )

    print(
        "SecureSync API Server "
        f"running on port {API_PORT}..."
    )

    try:

        httpd.serve_forever()

    except KeyboardInterrupt:

        print(
            "\nStopping API server..."
        )

        httpd.server_close()


# =========================================================
# MAIN
# =========================================================

if __name__ == "__main__":

    run_server()