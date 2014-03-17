var websocket = null

function consolize( obj, str ) {
    obj.consoleMessage = str
    return obj
}

function postJson( obj ) {
    this.postMessage( JSON.stringify(obj) )
}

var onOpen = function( evt ) {
    var obj = consolize( {}, "CONNECTED" )
    postJson( obj )
}

var onClose = function( evt ) {
    var obj = consolize( {}, "CLOSED:" + evt.code + "/" + evt.reason )
    postJson( obj )
}

var onError = function( evt ) {
    var obj = consolize( {}, 'ERROR:' + evt.code + "/" + evt.reason )
    postJson( obj )
}

var onMessage = function( evt ) {
    var obj = consolize( JSON.parse(evt.data), "RECEIVED: " + evt.data )
    postJson( obj )
}

this.onmessage = function( oEvent ) {
    if( websocket == null ) {
        var wsUri = "ws://" + oEvent.data + "/upper"
        websocket = new WebSocket( wsUri )

        websocket.onopen = onOpen
        websocket.onclose = onClose
        websocket.onerror = onError
        websocket.onmessage = onMessage
    }
    else {
        websocket.send( oEvent.data )
    }
}
