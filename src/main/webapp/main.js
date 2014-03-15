var debug = true
var inputElement
var outputElement
var containerElement

function init() {
    inputElement = document.getElementById( "textId" )
    outputElement = document.getElementById( "outputId" )
    containerElement = document.getElementById( "containerId" )
    containerElement.addEventListener("mousewheel", zoom, false)
    window.addEventListener( "resize", resize )
}
window.addEventListener( "load", init, false )

var myWorker = new Worker( "/upperWorker.js"  )
myWorker.onmessage = function( oEvent ) {
    obj = JSON.parse( oEvent.data )

    if( debug && "consoleMessage" in obj  ) console.log( obj.consoleMessage )
    if( "upper" in obj  ) {

        draggableLayer.add(new Kinetic.Rect({
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            fill: "rgb(0,0,200)"
        })
        );

        draggableLayer.draw()
        writeToScreen( obj.upper )
    }
}

function writeToScreen( message ) {
    // clear old text
    while( outputElement.lastChild ) {
        outputElement.removeChild( outputElement.lastChild );
    }

    var pre = document.createElement( "span" )
    pre.innerHTML = message
    outputElement.appendChild( pre )
}

function upperCase() {
    myWorker.postMessage( inputElement.value  )
}


var stage = new Kinetic.Stage({
    container: "containerId",
    width: window.innerWidth,
    height: window.innerHeight
});

var oldSize = stage.getSize()

var draggableLayer = new Kinetic.Layer()
draggableLayer.setDraggable( "draggable" )

//a large transparent background to make everything draggable
var background = new Kinetic.Rect({
    x: -1000,
    y: -1000,
    width: 3000,
    height: 2000,
    fill: "#A9BA9D",
    opacity: 1
});

draggableLayer.add( background )

stage.add( draggableLayer )

var zoom = function(e) {
    var zoomAmount = e.wheelDeltaY * 0.001

    var newScale = draggableLayer.getScale()
    var oldOffset = draggableLayer.getOffset()

    newScale.x -= zoomAmount
    newScale.y -= zoomAmount

    draggableLayer.setScale( newScale )
//    draggableLayer.setOffset( newOffset )

    draggableLayer.batchDraw()
}

var resize = function(e) {
    var newSize = draggableLayer.getSize()

    newSize.width = window.innerWidth
    newSize.height = window.innerHeight

    stage.setSize( newSize )
    oldSize = newSize

    stage.batchDraw()
}
