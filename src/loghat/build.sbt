name := "loghat"

version := "1.0"

scalaVersion := "2.11.7"

libraryDependencies += "io.spray" %% "spray-json" % "1.3.2"
libraryDependencies ++= Seq(
  "org.json4s" %% "json4s-core" % "3.3.0",
  "org.json4s" %% "json4s-jackson" % "3.3.0",
  "org.apache.commons" % "commons-lang3" % "3.4",
  "com.rockymadden.stringmetric" %% "stringmetric-core" % "0.27.4"
)
