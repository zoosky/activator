/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console

import akka.actor.{ ActorRef, ActorLogging, Actor }
import activator.analytics.rest.http.LocalMemoryRepository

trait RequestHandler[S <: ModuleInformationBase] extends Actor with ActorLogging {
  val repository = new LocalMemoryRepository(context.system)
  def onModuleInformation(sender: ActorRef, mi: S): Unit

  def receive = {
    case mi: S => onModuleInformation(sender, mi)
  }
}

trait PagingRequestHandler[S, M <: MultiValueModuleInformation[S]] extends RequestHandler[M] with WithPaging[M]
