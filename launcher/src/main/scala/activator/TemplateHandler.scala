/**
 * Copyright (C) 2014 Typesafe <http://typesafe.com/>
 */
package activator

import activator.cache.TemplateCache
import scala.concurrent.duration._
import scala.concurrent.Await
import java.util.concurrent.TimeoutException
import akka.actor.ActorSystem
import akka.util.Timeout
import sbt.complete.{ Parsers, Parser }
import activator.cache.TemplateMetadata

object TemplateHandler extends ActivatorCliHelper {
  def apply(): Int = {
    val metadata = downloadTemplates(UICacheHelper.makeDefaultCache(ActivatorCliHelper.system), ActivatorCliHelper.defaultDuration)
    printTemplateNames(metadata)
    1
  }

  def downloadTemplates(cache: TemplateCache, duration: FiniteDuration)(implicit timeout: Timeout): Iterable[TemplateMetadata] = {
    try {
      System.out.println()
      System.out.println("Fetching the latest list of templates...")
      System.out.println()
      Await.result(cache.metadata, duration)
    } catch {
      case e: TimeoutException =>
        // fall back to just using whatever we have in the local cache
        System.out.println()
        System.out.println("Could not fetch the updated list of templates.  Using the local cache.")
        System.out.println("Check your proxy settings or increase the timeout.  For more details see:\nhttp://typesafe.com/activator/docs")
        System.out.println()

        val localOnlyCache = UICacheHelper.makeLocalOnlyCache(ActorSystem("fallback"))
        Await.result(localOnlyCache.metadata, duration)
    }
  }

  def printTemplateNames(metadata: Iterable[TemplateMetadata]) {
    metadata.toSeq.sortBy(_.name) foreach { t => println(t.name) }
  }

  def getTemplateName(possible: Seq[String]): String = {
    val templateNameParser: Parser[String] = {
      import Parser._
      import Parsers._
      token(any.* map { _ mkString "" }, "<template name>").examples(possible.toSet, false)
    }

    System.out.println("Browse the list of templates: http://typesafe.com/activator/templates")
    System.out.println("Enter a template name, or hit tab to see a list")
    readLine(templateNameParser) filterNot (_.isEmpty) getOrElse sys.error("No template name specified.")
  }

  def findTemplate(metadata: Iterable[TemplateMetadata], tName: String): Option[TemplateMetadata] = {
    metadata.find(_.name == tName) match {
      case tm @ Some(_) => tm
      case None =>
        System.err.println(s"Could not find template with name: $tName")
        None
    }
  }

}
