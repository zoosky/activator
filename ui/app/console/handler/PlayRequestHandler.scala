/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

import akka.actor.{ ActorRef, Props }
import activator.analytics.data.{ PlayRequestSummary, TimeRange, Scope }
import com.typesafe.trace.uuid.UUID
import console.handler.rest.PlayRequestJsonBuilder.PlayRequestResult

object PlayRequestHandler {
  case class PlayRequestModuleInfo(
    scope: Scope,
    modifiers: ScopeModifiers,
    time: TimeRange,
    dataFrom: Option[Long],
    traceId: Option[String]) extends ScopedModuleInformationBase
}

trait PlayRequestHandlerBase extends RequestHandler[PlayRequestHandler.PlayRequestModuleInfo] {
  import PlayRequestHandler._

  def usePlayRequestStats(sender: ActorRef, traceId: String, stats: Option[PlayRequestSummary]): Unit

  def onModuleInformation(sender: ActorRef, mi: PlayRequestModuleInfo): Unit = {
    mi.traceId match {
      // TODO : Also retrieve any actor information
      case Some(id) => usePlayRequestStats(sender, id, repository.playRequestSummaryRepository.find(new UUID(id)))
      case None => log.warning("Cannot call Play request detail information without proper trade id.")
    }
  }
}

class PlayRequestHandler(builderProps: Props) extends PlayRequestHandlerBase {
  val builder = context.actorOf(builderProps, "playRequestBuilder")

  def usePlayRequestStats(sender: ActorRef, traceId: String, stats: Option[PlayRequestSummary]): Unit = stats match {
    case Some(s) => builder ! PlayRequestResult(sender, s)
    case None => log.warning("Could not find Play request detail information with provided trace id %s", traceId)
  }
}
