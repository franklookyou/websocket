var debug = true
var inputElement
var outputElement
var canvasCtx

function init() {
    inputElement = document.getElementById( "textId" )
    outputElement = document.getElementById( "outputId" )

    canvasCtx = document.getElementById( "canvasId" ).getContext( "2d" )
    canvasCtx.fillStyle = "#00FF00"
}
window.addEventListener( "load", init, false )

var myWorker = new Worker( "/upperWorker.js"  )
myWorker.onmessage = function( oEvent ) {
    obj = JSON.parse( oEvent.data )

    if( debug && "consoleMessage" in obj  ) console.log( obj.consoleMessage )
    if( "upper" in obj  ) {
        canvasCtx.fillRect( obj.x, obj.y, obj.width, obj.height )
        writeToScreen( obj.upper )
    }
}

function upperCase() {
    myWorker.postMessage( inputElement.value  )
}

function writeToScreen( message ) {
    // clear old text
    while( outputElement.lastChild ) {
        myNode.removeChild( myNode.lastChild );
    }

    var pre = document.createElement( "p" )
    pre.style.wordWrap = "break-word"
    pre.innerHTML = message
    outputElement.appendChild( pre )
}
