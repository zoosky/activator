/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

import akka.actor.{ ActorRef, Props }
import activator.analytics.data.{ TimeRange, Scope, ActorStats }
import activator.analytics.rest.http.SortingHelpers.SortDirection

object PlayRequestsHandler {
  case class PlayRequestsModuleInfo(scope: Scope,
    modifiers: ScopeModifiers,
    time: TimeRange,
    pagingInformation: Option[PagingInformation],
    sortOn: PlayRequestsSort,
    sortDirection: SortDirection,
    dataFrom: Option[Long],
    traceId: Option[String]) extends MultiValueModuleInformation[PlayRequestsSort]

  def extractSortOn(in: Option[String]): PlayRequestsSort = PlayRequestsSorts.DefineMe
}

trait PlayRequestsHandlerBase extends RequestHandler[PlayRequestsHandler.PlayRequestsModuleInfo] {
  import PlayRequestsHandler._

  def onModuleInformation(sender: ActorRef, mi: PlayRequestsModuleInfo): Unit = {
  }
}

class PlayRequestsHandler(builderProps: Props, val defaultLimit: Int) extends PlayRequestsHandlerBase {
  val builder = context.actorOf(builderProps, "playRequestsBuilder")

  def useActorStats(sender: ActorRef, stats: ActorStats): Unit = {

  }
}

sealed trait PlayRequestsSort
object PlayRequestsSorts {
  case object DefineMe extends PlayRequestsSort
}
