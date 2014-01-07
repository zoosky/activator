/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

import akka.actor.{ ActorRef, Props }
import console.handler.rest.ActorsJsonBuilder.ActorsResult
import activator.analytics.repository.ActorStatsSorted
import activator.analytics.data.{ ActorStatsSorts, ActorStatsSort }
import activator.analytics.data.Sorting
import activator.analytics.data.Sorting.SortDirection

object ActorsHandler {
  def extractSortOn(sortInformation: Option[SortInformation]): ActorStatsSort = sortInformation match {
    case Some(sort) ⇒ sort.command match {
      case "deviation" ⇒ ActorStatsSorts.DeviationsSort
      case "maxTimeInMailbox" ⇒ ActorStatsSorts.MaxTimeInMailboxSort
      case "maxMailboxSize" ⇒ ActorStatsSorts.MaxMailboxSizeSort
      case "actorPath" ⇒ ActorStatsSorts.ActorPath
      case "actorName" ⇒ ActorStatsSorts.ActorName
      case _ ⇒ ActorStatsSorts.ProcessedMessagesSort
    }
    case _ ⇒ ActorStatsSorts.ProcessedMessagesSort
  }

  def extractSortDirection(sortInformation: Option[SortInformation]): SortDirection = sortInformation match {
    case Some(sort) => sort.direction match {
      case "asc" => Sorting.ascendingSort
      case _ => Sorting.descendingSort
    }
    case _ => Sorting.descendingSort
  }
}

trait ActorsHandlerBase extends RequestHandler {
  import ActorsHandler._

  def useActorStats(sender: ActorRef, stats: ActorStatsSorted): Unit

  def receive = {
    case mi: ModuleInformation => onModuleInformation(sender, mi)
  }

  def onModuleInformation(sender: ActorRef, mi: ModuleInformation): Unit = {
    val anonymous = mi.actorInformation.map(_.includeAnonymous).getOrElse(false)
    val temporary = mi.actorInformation.map(_.includeTemporary).getOrElse(false)
    val offset = mi.pagingInformation.map(_.offset).getOrElse(0)
    val limit = mi.pagingInformation.map(_.limit).getOrElse(100)
    val sortOn = extractSortOn(mi.sortInformation)
    val sortDirection = extractSortDirection(mi.sortInformation)
    useActorStats(
      sender,
      repository.actorStatsRepository.findSorted(mi.time, mi.scope, anonymous, temporary, offset, limit, sortOn, sortDirection))
  }
}

class ActorsHandler(builderProps: Props) extends ActorsHandlerBase {
  val builder = context.actorOf(builderProps, "actorsBuilder")

  def useActorStats(sender: ActorRef, stats: ActorStatsSorted): Unit = {
    builder ! ActorsResult(sender, stats)
  }
}
