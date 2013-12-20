/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

import akka.actor.{ ActorRef, Props }
import activator.analytics.data.ActorStats

trait DeviationsHandlerBase extends RequestHandler {
  def receive = {
    case mi: ModuleInformation => onModuleInformation(sender, mi)
  }

  def onModuleInformation(sender: ActorRef, mi: ModuleInformation): Unit = {
  }
}

class DeviationsHandler(builderProps: Props) extends ActorHandlerBase {
  val builder = context.actorOf(builderProps, "deviationsBuilder")

  def useActorStats(sender: ActorRef, stats: ActorStats): Unit = {

  }
}
