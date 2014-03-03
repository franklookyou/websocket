package org.lookyou;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main( String [] args ) throws Exception {
        if( args.length == 0 ) {
            System.err.println( " # org.lookyou.Main mainClass [args]*" );
            return;
        }

        List<String> argList = new ArrayList<>( Arrays.asList(args) );
        String className = argList.remove( 0 );

        Class<?> c = Class.forName( className );
        Method m = c.getMethod( "main", args.getClass() );

        String[] newArgs = argList.toArray( new String[argList.size()] );
        m.invoke( null, (Object)newArgs );
    }
}
