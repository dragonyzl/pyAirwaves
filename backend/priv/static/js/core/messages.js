"use strict"; // overcome current Chrome and Firefox issues with ECMA6 stuff like classes
/***********************************************************
 * Airsuck JS Socket Message Handler
 * v. 0.1
 *
 * Licensed under GPL V3
 * https://github.com/ThreeSixes/airSuck
 *
 * Handles socket.io messages for vehicle data coming from node
 *
 * Deps: jQuery, vehicles.js, leaflet maps initialized
 **********************************************************/

/***************************************************
 * SOCKET MESSAGE HANDLER
 **************************************************/

function handleMessage(event) {
    // const msgJSON = JSON.parse(event.data);
    const msgJSON = event.data;
    if (!mapLoaded) {
        // Return early - the map isn't loaded yet
        Logger.error("Maps not loaded. Discarding aircraft data.");
        return;
    }
    // Dump the JSON string to the message box.
    if (debug) {
        $('#' + messageBx).attr('value', JSON.stringify(msgJSON, null, 2));
    }

    // Return early - don't continue processing the keepalive.
    if ('keepalive' in msgJSON) {
        return;
    }

    // Store the vehicle name for reference in the function
    let vehName = "veh" + msgJSON.addr.toString();

    if (msgJSON.lon && msgJSON.lat) {
        const markerBounds = L.latLngBounds(L.latLng(msgJSON.lat, msgJSON.lon), L.latLng(msgJSON.lat, msgJSON.lon));
        if (!map.getBounds().contains(markerBounds)) {
            return; // Marker is out of bounds, just drop it
        }
    }

    // See if we have a vehicle in our vehicle data.
    if (vehName in vehicles && vehicles[vehName] != null) {
        // existing vehicle, call the update function
        vehicles[vehName].update(msgJSON);
    } else {
        // new vehicle, call the constructor, create marker and set listeners
        let index; // we need an index to manually traverse the vehicleTypes associative array
        let length = vehicleTypes.length;
        for (index = 0; index < length; ++index) {
            if (msgJSON.type === vehicleTypes[index].protocol) {
                // add the new vehicle (constructor should call registered update functions)
                vehicles[vehName] = vehicleTypes[index].constructor(msgJSON);

                // Add marker and listeners only if we have a Latitude and Longitude
                // Cannot create a marker without geoposition datas
                if (vehicles[vehName].lat && vehicles[vehName].lon) {
                    // create a marker icon for the vehicle (may move to the constructor)
                    vehicles[vehName].setMarker();

                    // Add listeners to marker - must be here to access the vehicles array
                    vehicles[vehName].marker.on('click', function () {
                        vehicleMarkerClickListener(vehName);
                    });
                    vehicles[vehName].marker.on('contextmenu', function () {
                        vehicleMarkerRightClickListener(vehName);
                        return false; // cancel browser context menu popup
                    });
                } else {
                    //debugger;
                    Logger.warn('handleMessage: No Lat/Lon available for: ' + vehicles[vehName].addr);
                }
                break;
            } else if (index === length) {
                // vehicle type not registered, drop data
                Logger.error('New vehicle found, type not registered: ' + msgJSON.type + ' Dropping data.')
            }
        }
    }
}

// Initiate the WebSocket
window.socket = new Phoenix.Socket("/ws", {params: {}});
socket.connect();
window.vehiclesChannel = socket.channel("room:vehicles")


// Register the message handlers
vehiclesChannel.on("new_msg", msg => handleMessage(msg));

vehiclesChannel.join()
    .receive("ok", (msg) => socketOk(msg))
    .receive("error", (reasons) => socketNok(reasons))
    .receive("timeout", () => socketNok('timeout'));

function socketOk(msg) {
    $("#websocket-status").removeClass().addClass(["badge badge-pill", "badge-success"]).prop('title', "WebSocket OK");
    $("#websocket-status i").removeClass().addClass(["fa", "fa-check icon-socket-ok"]);
    Logger.info("WebSocket OK: ", msg);
}

function socketNok(msg) {
    $("#websocket-status").removeClass().addClass(["badge badge-pill", "badge-danger"]).prop('title', "WebSocket KO");
    $("#websocket-status i").removeClass().addClass(["fa", "fa-close icon-socket-nok"]);
    Logger.info("WebSocket Err: ", msg);

}
