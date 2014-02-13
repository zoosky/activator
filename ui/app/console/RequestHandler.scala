/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console

import akka.actor.{ ActorRef, ActorLogging, Actor }
import activator.analytics.rest.http.LocalMemoryRepository

trait RequestHandlerLike[S <: ModuleInformationBase] {
  def repository: LocalMemoryRepository
  def onModuleInformation(sender: ActorRef, mi: S): Unit
}

trait RequestHandler[S <: ModuleInformationBase] extends Actor with ActorLogging with RequestHandlerLike[S] {
  val repository = new LocalMemoryRepository(context.system)

  def receive = {
    case mi: S => onModuleInformation(sender, mi)
  }
}

trait PagingRequestHandlerLike[S, M <: MultiValueModuleInformation[S]] extends RequestHandlerLike[M] with WithPaging[M]

trait PagingRequestHandler[S, M <: MultiValueModuleInformation[S]] extends PagingRequestHandlerLike[S, M] with RequestHandler[M]
