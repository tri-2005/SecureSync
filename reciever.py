import socket
import os
import config_manager

def get_receiver_port():
    try:
        cfg = config_manager.get_config()
        return int(cfg.get("local_port", 5001))
    except Exception:
        return 5001


HOST = "0.0.0.0"
PORT = get_receiver_port()

SAVE_FOLDER = r"C:\SyncFolder"
MARKER_FILE = r"C:\SecureSync\.received"


def recv_exact(connection, size):
    data = b""

    while len(data) < size:
        chunk = connection.recv(size - len(data))

        if not chunk:
            raise ConnectionError(
                "Connection closed before receiving all data"
            )

        data += chunk

    return data


def write_marker(file_path):
    with open(MARKER_FILE, "w") as marker:
        marker.write(file_path)


server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

server.bind((HOST, PORT))
server.listen(5)

print(f"Windows receiver listening on port {PORT}...")


while True:

    connection, address = server.accept()

    try:

        event_type = recv_exact(
            connection,
            6
        ).decode("utf-8")


        # =========================
        # HEALTH CHECK
        # =========================

        if event_type == "HEALTH":

            connection.sendall(b"OK")

            print("Health check received.")

            continue


        # =========================
        # FILE
        # =========================

        if event_type == "FILE  ":

            filename_length = int.from_bytes(
                recv_exact(connection, 4),
                "big"
            )

            filename = recv_exact(
                connection,
                filename_length
            ).decode("utf-8")

            file_size = int.from_bytes(
                recv_exact(connection, 8),
                "big"
            )

            print(f"\nReceiving: {filename}")
            print(f"Size: {file_size} bytes")

            file_path = os.path.join(
                SAVE_FOLDER,
                filename
            )

            received = 0

            with open(file_path, "wb") as file:

                while received < file_size:

                    data = connection.recv(
                        min(4096, file_size - received)
                    )

                    if not data:
                        raise ConnectionError(
                            "Connection closed during file transfer"
                        )

                    file.write(data)
                    received += len(data)

            print(
                f"File received successfully: {filename}"
            )

            write_marker(file_path)

            try:
                import event_logger

                event_logger.log_event(
                    "CREATE",
                    file_path,
                    "Kali Receiver",
                    "Completed"
                )

                event_logger.log_transfer(
                    filename,
                    "Kali → Windows",
                    "Completed",
                    file_size
                )

            except Exception:
                pass


        # =========================
        # DELETE
        # =========================

        elif event_type == "DELETE":

            filename_length = int.from_bytes(
                recv_exact(connection, 4),
                "big"
            )

            filename = recv_exact(
                connection,
                filename_length
            ).decode("utf-8")

            file_path = os.path.join(
                SAVE_FOLDER,
                filename
            )

            print(
                f"\nDelete request received: {filename}"
            )

            write_marker(file_path)

            if os.path.exists(file_path):

                os.remove(file_path)

                print(
                    f"File deleted: {filename}"
                )

            else:

                print(
                    f"File not found: {filename}"
                )

            try:
                import event_logger

                event_logger.log_event(
                    "DELETE",
                    file_path,
                    "Kali Receiver",
                    "Completed"
                )

                event_logger.log_transfer(
                    filename,
                    "Kali → Windows (Delete)",
                    "Completed"
                )

            except Exception:
                pass


        # =========================
        # RENAME
        # =========================

        elif event_type == "RENAME":

            old_filename_length = int.from_bytes(
                recv_exact(connection, 4),
                "big"
            )

            old_filename = recv_exact(
                connection,
                old_filename_length
            ).decode("utf-8")

            new_filename_length = int.from_bytes(
                recv_exact(connection, 4),
                "big"
            )

            new_filename = recv_exact(
                connection,
                new_filename_length
            ).decode("utf-8")

            old_path = os.path.join(
                SAVE_FOLDER,
                old_filename
            )

            new_path = os.path.join(
                SAVE_FOLDER,
                new_filename
            )

            print(
                f"\nRename request: "
                f"{old_filename} -> {new_filename}"
            )

            write_marker(new_path)

            if os.path.exists(old_path):

                os.rename(
                    old_path,
                    new_path
                )

                print(
                    f"File renamed: "
                    f"{old_filename} -> {new_filename}"
                )

            else:

                print(
                    f"File not found: {old_filename}"
                )

            try:
                import event_logger

                event_logger.log_event(
                    "RENAME",
                    f"{old_filename} → {new_filename}",
                    "Kali Receiver",
                    "Completed"
                )

                event_logger.log_transfer(
                    f"{old_filename} → {new_filename}",
                    "Kali → Windows (Rename)",
                    "Completed"
                )

            except Exception:
                pass


        else:

            print(
                f"Unknown event type: {event_type}"
            )


    except Exception as error:

        print(
            f"Error handling connection: {error}"
        )


    finally:

        connection.close()