# import BaseHTTPServer, SimpleHTTPServer
from http.server import SimpleHTTPRequestHandler, HTTPServer
import ssl
from pathlib import Path

# openssl req -new -x509 -days 365 -nodes -out cert.pem -keyout cert.pem
httpd = HTTPServer(("", 443), SimpleHTTPRequestHandler)

httpd.socket = ssl.wrap_socket(
    httpd.socket,
    server_side=True,
    certfile="./cert.pem",
    keyfile="./key.pem",
    ssl_version=ssl.PROTOCOL_TLSv1,
)

print("HTTPS Server is running...")
httpd.serve_forever()
