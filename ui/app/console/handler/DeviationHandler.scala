/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

import akka.actor.{ ActorRef, Props }
import activator.analytics.data.{ TimeRange, Scope, ActorStats }

object DeviationHandler {
  case class DeviationModuleInfo(scope: Scope,
    modifiers: ScopeModifiers,
    time: TimeRange,
    dataFrom: Option[Long],
    traceId: Option[String]) extends ModuleInformationBase
}

trait DeviationHandlerBase extends RequestHandler[DeviationHandler.DeviationModuleInfo] {
  import DeviationHandler._

  def onModuleInformation(sender: ActorRef, mi: DeviationModuleInfo): Unit = {
  }
}

class DeviationHandler(builderProps: Props) extends ActorHandlerBase {
  val builder = context.actorOf(builderProps, "deviationBuilder")

  def useActorStats(sender: ActorRef, stats: ActorStats): Unit = {

  }
}
