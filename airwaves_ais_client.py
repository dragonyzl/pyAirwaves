#!/usr/bin/env python
"""
blah
"""

import config
from flask_socketio import SocketIO
import config as cfg
from libPyAirwaves.structs import AisType
from app import create_app
import pyais

count_failed_connection = 0
max_failed_connection = 10

app = create_app()
app.app_context().push()


def broadcast(msg: pyais.messages.NMEAMessage):
    is_fragmented = msg.count > 1
    if is_fragmented:
        print("Fragmented packet:", msg)
    else:
        print("Single packet:", msg)

    ais_message = AisType()
    ais_message.entryPoint = "airwaves_ais_client"
    ais_message.src = config.PYAW_HOSTNAME
    ais_message.clientName = config.AIS_SOURCE["name"]
    ais_message.dataOrigin = "rtl-ais"
    ais_message.raw = msg.raw
    ais_message.payload = msg.data

    ais_parsed = msg.decode()

    if is_fragmented:
        ais_message.isAssembled = True

    # Populate the structure from parsed VDM
    ais_message.populateFromParsedVdm(ais_parsed)

    # Valid message and emit if lat/lon are present
    # if ais_message.lat and ais_message.lon:
    print(ais_message.to_dict())
    socketio.emit("message", ais_message.to_dict())


if __name__ == "__main__":
    socketio = SocketIO(message_queue=cfg.SOCKETIO_MESSAGE_QUEUE)

    while True:
        try:
            for msg in pyais.TCPStream(config.AIS_SOURCE["host"], port=config.AIS_SOURCE["port"]):
                decoded_message = msg.decode()
                broadcast(msg)
        except Exception as e:
            print("Got an exception, reconnecting...", e)
            pass