package com.example.services;

import org.apache.commons.io.IOUtils;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;

public class UpperServlet extends WebSocketServlet {
    @WebSocket(maxTextMessageSize = 64 * 1024)
    public static class AnnotatedEchoSocket {
        int x = 50;
        int y = 50;

        public String getResponse( String message )
        {
            JsonObjectBuilder builder = Json.createObjectBuilder();
            builder.add( "upper", message.toUpperCase() );
            builder.add( "x", x += 200 );
            builder.add( "y", y += 200 );
            builder.add( "width", 50 );
            builder.add( "height", 75 );
            JsonObject result = builder.build();
            StringWriter sw = new StringWriter();
            try (JsonWriter writer = Json.createWriter(sw)) {
                writer.writeObject(result);
            }

            return result.toString();
        }

        @OnWebSocketMessage
        public void onText(org.eclipse.jetty.websocket.api.Session session, String message) {
            if (session.isOpen()) {
                System.out.printf( "Echoing back uppered message [%s]%n", message );
                try {
                    session.getRemote().sendString( getResponse(message) );
                } catch (IOException e) {
                    throw new RuntimeException( e );
                }
            }
        }

        @OnWebSocketError
        public void onError( org.eclipse.jetty.websocket.api.Session session, Throwable error ) {
            System.err.println( "error:" + error );
        }

        @OnWebSocketClose
        public void onClose( org.eclipse.jetty.websocket.api.Session session, int statusCode, String reason ) {
            System.err.println( "close:" + statusCode + "/" + reason );
        }
    }

    @Override
    public void configure( WebSocketServletFactory factory ) {
        // set a 10 second idle timeout
        factory.getPolicy().setIdleTimeout( 1000000 );
        // register my socket
        factory.register( AnnotatedEchoSocket.class );
    }

    @Override
    protected void doGet( HttpServletRequest req, HttpServletResponse resp ) throws ServletException, IOException {
        InputStream stuffStream = this.getClass().getClassLoader().getResourceAsStream("upper.html");
        String stuff = IOUtils.toString( stuffStream );
        resp.getWriter().print( stuff );
    }
}