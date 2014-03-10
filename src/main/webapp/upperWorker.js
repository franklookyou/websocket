var wsUri = "ws://localhost:8080/upper"
// 3/9/2014 bug prevents firefox from opening sockets on a worker
var websocket = new WebSocket( wsUri )

function consolize( obj, str ) {
    obj.yonsole = str
    return obj
}

function postJson( obj ) {
    this.postMessage( JSON.stringify(obj) )
}

{
    websocket.onopen = function( evt ) {
        var obj = consolize( {}, "CONNECTED" )
        postJson( obj )
    }

    websocket.onclose = function( evt ) {
        var obj = consolize( {}, "CLOSED:" + evt.code + "/" + evt.reason )
        postJson( obj )
    }

    websocket.onerror = function( evt ) {
        var obj = consolize( {}, 'ERROR:' + evt.code + "/" + evt.reason )
        postJson( obj )
    }

    websocket.onmessage = function( evt ) {
        var obj = consolize( JSON.parse(evt.data), "RECEIVED: " + evt.data )
        postJson( obj )
    }
}

this.onmessage = function( oEvent ) {
    websocket.send( oEvent.data )
}
