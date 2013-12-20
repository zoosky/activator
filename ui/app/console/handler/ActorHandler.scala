/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

import akka.actor.{ ActorRef, Props }
import activator.analytics.data.ActorStats
import console.handler.rest.ActorJsonBuilder.ActorResult

trait ActorHandlerBase extends RequestHandler {
  def useActorStats(sender: ActorRef, stats: ActorStats): Unit

  def receive = {
    case mi: ModuleInformation => onModuleInformation(sender, mi)
  }

  def onModuleInformation(sender: ActorRef, mi: ModuleInformation): Unit = {
    useActorStats(sender, ActorStats.concatenate(repository.actorStatsRepository.findWithinTimePeriod(mi.time, mi.scope), mi.time, mi.scope))
  }
}

class ActorHandler(builderProps: Props) extends ActorHandlerBase {
  val builder = context.actorOf(builderProps, "actorBuilder")

  def useActorStats(sender: ActorRef, stats: ActorStats): Unit = {
    builder ! ActorResult(sender, stats)
  }
}
