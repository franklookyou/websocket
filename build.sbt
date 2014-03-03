// basics

name := "websocket"

version := "1.0-SNAPSHOT"

scalaVersion := "2.10.2"

organization := "org.lookyou"

// jetty auto-deploy

Seq( webSettings :_* )

//port in container.Configuration := 8081

// onejar stuff

Seq(com.github.retronym.SbtOneJar.oneJarSettings: _*)

mainClass in oneJar := Some( "org.lookyou.Main" )

// variables

//"9.1.0.v20131115"
//"9.1.1.v20140108"
val orgEclipseJettyVersion : String = "9.1.2.v20140210"

// dependencies

libraryDependencies += "org.apache.commons" % "commons-io" % "1.3.2"

libraryDependencies += "javax.inject" % "javax.inject" % "1"

libraryDependencies += "javax.json" % "javax.json-api" % "1.0"

libraryDependencies += "org.glassfish" % "javax.json" % "1.0"

libraryDependencies += "org.eclipse.jetty" % "jetty-server" % orgEclipseJettyVersion

libraryDependencies += "org.eclipse.jetty.websocket" % "javax-websocket-server-impl" % orgEclipseJettyVersion

libraryDependencies += "org.eclipse.jetty" % "jetty-annotations" % orgEclipseJettyVersion

libraryDependencies += "org.eclipse.jetty" % "jetty-webapp" % orgEclipseJettyVersion % "container,compile"

libraryDependencies += "org.eclipse.jetty" % "jetty-plus"   % orgEclipseJettyVersion % "container,compile"
