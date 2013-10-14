/**
 * Copyright (C) 2011-2013 Typesafe <http://typesafe.com/>
 */
package snap

import akka.actor.{ Terminated, Actor, ActorRef }

trait ActorWrapper {
  var isTerminated = false
  def actorTerminated() {
    isTerminated = true
  }
}

case class ActorWrapperHelper(actor: ActorRef) extends ActorWrapper

class ActorWatcher(watchee: ActorRef, watcher: ActorWrapper) extends Actor {
  context.watch(watchee)
  def receive = {
    case Terminated(_) => watcher.actorTerminated()
  }
}
