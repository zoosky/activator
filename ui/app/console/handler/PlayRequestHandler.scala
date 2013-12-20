/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

import akka.actor.{ ActorRef, Props }
import activator.analytics.data.ActorStats

trait PlayRequestHandlerBase extends RequestHandler {
  def receive = {
    case mi: ModuleInformation => onModuleInformation(sender, mi)
  }

  def onModuleInformation(sender: ActorRef, mi: ModuleInformation): Unit = {
  }
}

class PlayRequestHandler(builderProps: Props) extends ActorHandlerBase {
  val builder = context.actorOf(builderProps, "playRequestBuilder")

  def useActorStats(sender: ActorRef, stats: ActorStats): Unit = {

  }
}
