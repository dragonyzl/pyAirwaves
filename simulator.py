#!/usr/bin/env python

from real_datas_test import REAL_DATA_ADSB
from airwaves_adsb_client import get_adsb_message
import time
from flask_socketio import SocketIO
import config as cfg

DELAY_MESSAGES = 0.5  # second

socketio = SocketIO(message_queue=cfg.SOCKETIO_MESSAGE_QUEUE)

print("Sending messages...")

for msg in REAL_DATA_ADSB:
    adsb_msg = get_adsb_message(msg.split(","))
    adsb_msg.dataOrigin = "dump1090"
    adsb_msg.entryPoint = "simulator"
    socketio.emit("message", adsb_msg.to_dict())
    time.sleep(DELAY_MESSAGES)