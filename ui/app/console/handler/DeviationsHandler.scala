/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

import akka.actor.{ ActorRef, Props }
import activator.analytics.data.{ TimeRange, Scope, ActorStats }
import activator.analytics.rest.http.SortingHelpers.SortDirection

object DeviationsHandler {
  case class DeviationsModuleInfo(scope: Scope,
    modifiers: ScopeModifiers,
    time: TimeRange,
    pagingInformation: Option[PagingInformation],
    sortOn: DeviationsSort,
    sortDirection: SortDirection,
    dataFrom: Option[Long],
    traceId: Option[String]) extends MultiValueModuleInformation[DeviationsSort]

  def extractSortOn(in: Option[String]): DeviationsSort = DeviationsSorts.DefineMe
}

trait DeviationsHandlerBase extends RequestHandler[DeviationsHandler.DeviationsModuleInfo] {
  import DeviationsHandler._

  def onModuleInformation(sender: ActorRef, mi: DeviationsModuleInfo): Unit = {
  }
}

class DeviationsHandler(builderProps: Props, val defaultLimit: Int) extends ActorHandlerBase {
  val builder = context.actorOf(builderProps, "deviationsBuilder")

  def useActorStats(sender: ActorRef, stats: ActorStats): Unit = {

  }
}

sealed trait DeviationsSort
object DeviationsSorts {
  case object DefineMe extends DeviationsSort
}
