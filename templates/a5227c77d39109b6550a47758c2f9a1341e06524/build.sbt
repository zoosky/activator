name := "hello-scala"

version := "1.0"

scalaVersion := "2.10.0"

scalaSource in Compile <<= baseDirectory / "app"

javaSource in Compile <<= baseDirectory / "app"

sourceDirectory in Compile <<= baseDirectory / "app"

scalaSource in Test <<= baseDirectory / "test"

javaSource in Test <<= baseDirectory / "test"

sourceDirectory in Test <<= baseDirectory / "test"

libraryDependencies += "org.scalatest" % "scalatest_2.10" % "1.9.1" % "test"
