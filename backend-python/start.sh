#! /usr/bin/env sh

nohup python server.py --ssl 1 --cert ./cert.pem --port 8000 &

python https.py