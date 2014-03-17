var debug = true
var inputElement
var outputElement
var containerElement

function init() {
    inputElement = document.getElementById( "textId" )
    outputElement = document.getElementById( "outputId" )
    containerElement = document.getElementById( "containerId" )
    containerElement.addEventListener( "mousewheel", zoom, false )
    window.addEventListener( "resize", resize )
}
window.addEventListener( "load", init, false )

var myWorker = new Worker( "/upperWorker.js"  )
myWorker.postMessage( window.location.hostname + ":" + window.location.port )

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

        var circle = new Kinetic.Circle({
            radius: 10,
            fill: 'red'
        });

        draggableLayer.add( circle )

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

var prevTime = new Date( 0 )
var prevPos = { x:0, y:0 }
var xPerSec = 0.0
var yPerSec = 0.0

var clearVelocity = function() {
    prevTime = new Date( 0 )
    prevPos = { x:0, y:0 }
    xPerSec = 0.0
    yPerSec = 0.0
}

var velocityStuff = function() {
    var curPos = draggableLayer.getPosition()
    var curTime = new Date()
    var unitTime = prevTime.getMilliseconds() - curTime.getMilliseconds()
    if( unitTime > 1000 ) {
        console.log( "clear velocity" )
        clearVelocity()
        return;
    }

    if( prevPos.x != 0.0 ) {
        xPerSec = (curPos.x - prevPos.x) / (unitTime / 1000)
    }

    if( prevPos.y != 0.0 ) {
        yPerSec = (curPos.y - prevPos.y) / (unitTime / 1000)
    }

    console.log( "velocityX:" + xPerSec )
    console.log( "velocityY:" + yPerSec )

    prevPos = curPos
}

var calculateBounds = function(pos) {
    var oldScale = draggableLayer.getScale()
    var backgroundPos = background.getPosition()
    var backgroundSize = background.getSize()
    var truncatedPos = pos


    var upY = ( backgroundPos.y * oldScale.y ) * -1
    if( pos.y > upY ) {
        truncatedPos.y = upY
    }

    var leftX = ( backgroundPos.x * oldScale.x ) * -1
    if( pos.x > leftX ) {
        truncatedPos.x = leftX
    }

    var rightX = ( ((backgroundSize.width + backgroundPos.x) * oldScale.x) - window.innerWidth ) * -1
    if( pos.x < rightX ) {
        truncatedPos.x = rightX
    }

    var downY = ( ((backgroundSize.height + backgroundPos.y) * oldScale.y) - window.innerHeight ) * -1
    if( pos.y < downY )
    {
        truncatedPos.y = downY
    }

    return truncatedPos
}

var draggableLayer = new Kinetic.Layer({
    draggable: true,
    dragBoundFunc: function(pos) {
        velocityStuff()
        return calculateBounds( pos )
    }
})

//a large transparent background to make everything draggable
var background = new Kinetic.Rect({
    x: -2500,
    y: -1500,
    width: 5000,
    height: 3000,
    fill: "#A9BA9D",
    opacity: 1,
    stroke: 'olive',
    strokeWidth: 20
});

draggableLayer.add( background )
stage.add( draggableLayer )

var zoom = function(e) {
    var zoomAmount = e.wheelDeltaY * 0.001

    var oldScale = draggableLayer.getScale()
    var newScale = {
        x: oldScale.x + zoomAmount,
        y: oldScale.y + zoomAmount
    }

    if( (newScale.x < .35) || (newScale.x > 4) ) {
        return
    }

    var draggablePos = draggableLayer.getPosition()
    var mousePos = stage.getPointerPosition()

    var oldMousePosition = {
        x: ( mousePos.x - draggablePos.x ) / oldScale.x,
        y: ( mousePos.y - draggablePos.y ) / oldScale.y
    }

//    draggableLayer.add(
//        new Kinetic.Circle({
//            id: "old",
//            radius: 10,
//            fill: 'purple',
//            x: oldMousePosition.x,
//            y: oldMousePosition.y
//        })
//    )

    var newMousePosition = {
        x: ( mousePos.x - draggablePos.x ) / newScale.x,
        y: ( mousePos.y - draggablePos.y ) / newScale.y
    }

//    draggableLayer.add(
//        new Kinetic.Circle({
//            id: "new",
//            radius: 10,
//            fill: 'orange',
//            x: newMousePosition.x,
//            y: newMousePosition.y
//        })
//    )

    var transformedPosition = {
        x: draggablePos.x - (oldMousePosition.x - newMousePosition.x) * newScale.x,
        y: draggablePos.y - (oldMousePosition.y - newMousePosition.y) * newScale.y
    }

    draggableLayer.setScale( newScale )

    var boundedPosition = draggableLayer.dragBoundFunc()( transformedPosition )

    draggableLayer.setPosition( boundedPosition )
    draggableLayer.batchDraw()
}

var resize = function(e) {
    var newSize = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    stage.setSize( newSize )
    stage.batchDraw()
}
