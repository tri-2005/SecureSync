import socket
import os
import config_manager


def get_target_endpoint():
    """Retrieve remote IP and Port dynamically from config.json."""
    try:
        cfg = config_manager.get_config()
        return cfg.get("remote_ip", "192.168.1.12"), int(cfg.get("remote_port", 5000))
    except Exception:
        return "192.168.1.12", 5000


def send_file(file_path):

    filename = os.path.basename(file_path)
    file_size = os.path.getsize(file_path)

    server_ip, server_port = get_target_endpoint()

    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    client.connect((server_ip, server_port))

    print(f"Connected to Kali ({server_ip}:{server_port}).")
    print(f"Sending: {filename}")
    print(f"Size: {file_size} bytes")

    # Tell Kali this is a FILE transfer
    client.sendall(b"FILE  ")

    filename_bytes = filename.encode("utf-8")

    # Send filename length
    client.sendall(
        len(filename_bytes).to_bytes(4, "big")
    )

    # Send filename
    client.sendall(filename_bytes)

    # Send file size
    client.sendall(
        file_size.to_bytes(8, "big")
    )

    # Send file contents
    with open(file_path, "rb") as file:

        while True:

            data = file.read(4096)

            if not data:
                break

            client.sendall(data)

    print(f"File sent successfully: {filename}")

    client.close()

    # Best-effort logging
    try:
        import event_logger
        event_logger.log_transfer(filename, "Windows → Kali", "Completed", file_size)
    except Exception:
        pass


def delete_file(file_path):

    filename = os.path.basename(file_path)

    server_ip, server_port = get_target_endpoint()

    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    client.connect((server_ip, server_port))

    print(f"Connected to Kali ({server_ip}:{server_port}).")
    print(f"Deleting: {filename}")

    # Tell Kali this is a DELETE operation
    client.sendall(b"DELETE")

    filename_bytes = filename.encode("utf-8")

    # Send filename length
    client.sendall(
        len(filename_bytes).to_bytes(4, "big")
    )

    # Send filename
    client.sendall(filename_bytes)

    print(f"Delete request sent: {filename}")

    client.close()

    # Best-effort logging
    try:
        import event_logger
        event_logger.log_transfer(filename, "Windows → Kali (Delete)", "Completed")
    except Exception:
        pass


def rename_file(old_path, new_path):

    old_filename = os.path.basename(old_path)
    new_filename = os.path.basename(new_path)

    server_ip, server_port = get_target_endpoint()

    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    client.connect((server_ip, server_port))

    print(f"Connected to Kali ({server_ip}:{server_port}).")
    print(f"Renaming: {old_filename} -> {new_filename}")

    # Tell Kali this is a RENAME operation
    client.sendall(b"RENAME")

    # Send old filename
    old_filename_bytes = old_filename.encode("utf-8")

    client.sendall(
        len(old_filename_bytes).to_bytes(4, "big")
    )

    client.sendall(old_filename_bytes)

    # Send new filename
    new_filename_bytes = new_filename.encode("utf-8")

    client.sendall(
        len(new_filename_bytes).to_bytes(4, "big")
    )

    client.sendall(new_filename_bytes)

    print(f"Rename request sent: {old_filename} -> {new_filename}")

    client.close()

    # Best-effort logging
    try:
        import event_logger
        event_logger.log_transfer(f"{old_filename} → {new_filename}", "Windows → Kali (Rename)", "Completed")
    except Exception:
        pass
