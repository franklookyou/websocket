package com.example.services;

import org.apache.commons.io.IOUtils;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;

public class UpperServlet extends WebSocketServlet {
    @WebSocket(maxTextMessageSize = 64 * 1024)
    public static class AnnotatedEchoSocket {
        @OnWebSocketMessage
        public void onText(org.eclipse.jetty.websocket.api.Session session, String message) {
            if (session.isOpen()) {
                System.out.printf( "Echoing back uppered message [%s]%n", message );
                try {
                    session.getRemote().sendString( message.toUpperCase() );
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
            System.err.println( "close:" + statusCode );
            System.err.println( "close:" + reason );
        }
    }

    @Override
    public void configure( WebSocketServletFactory factory ) {
        // set a 10 second idle timeout
        factory.getPolicy().setIdleTimeout( 10000 );
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