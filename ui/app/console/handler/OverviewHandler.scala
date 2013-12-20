/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

import console.handler.rest.OverviewParser
import console.handler.rest.OverviewParser.Result
import akka.actor.{ ActorRef, Props }
import scala.concurrent._
import scala.concurrent.duration._
import ExecutionContext.Implicits.global
import activator.analytics.data.{ ErrorStats, MetadataStats, MetadataStatsMetrics }

object OverviewHandler {

  // Pure function.  Don't wrap up in an actor.  Much easier to test on its own.
  def mergeMetadata(spanStatMetadata: MetadataStats, metadataStats: MetadataStats, limit: Int): MetadataStats = {
    val allPaths = spanStatMetadata.metrics.paths ++ metadataStats.metrics.paths
    val limitedPaths = allPaths.toSeq.sortWith((a, b) ⇒ a < b).take(limit).toSet
    new MetadataStats(
      timeRange = metadataStats.timeRange,
      scope = metadataStats.scope,
      metrics = MetadataStatsMetrics(
        spanTypes = spanStatMetadata.metrics.spanTypes,
        paths = limitedPaths,
        totalActorCount = Some(allPaths.size),
        dispatchers = spanStatMetadata.metrics.dispatchers ++ metadataStats.metrics.dispatchers,
        nodes = spanStatMetadata.metrics.nodes ++ metadataStats.metrics.nodes,
        actorSystems = spanStatMetadata.metrics.actorSystems ++ metadataStats.metrics.actorSystems,
        tags = spanStatMetadata.metrics.tags ++ metadataStats.metrics.tags,
        playPatterns = metadataStats.metrics.playPatterns,
        playControllers = metadataStats.metrics.playControllers))
  }
}

trait OverviewHandlerBase extends RequestHandler {
  import OverviewHandler._
  def useMetadataStats(sender: ActorRef, stats: MetadataStats, errorStats: ErrorStats): Unit
  def onModuleInformation(sender: ActorRef, mi: ModuleInformation): Unit = {
    // TODO : define include of temp and anonymous actors
    val metadataFuture = future { repository.metadataStatsRepository.findFiltered(mi.time, mi.scope, true, true) }
    val spanFuture = future { repository.summarySpanStatsRepository.findMetadata(mi.time, mi.scope, true, true) }
    val deviationFuture = future { repository.errorStatsRepository.findWithinTimePeriod(mi.time, mi.scope.node, mi.scope.actorSystem) }
    // TODO : use configurable limit
    val limit = mi.pagingInformation.map(p => p.limit).getOrElse(100)
    for {
      metadata <- metadataFuture
      spans <- spanFuture
      deviations <- deviationFuture
    } useMetadataStats(sender, mergeMetadata(spans, metadata, limit), ErrorStats.concatenate(deviations, mi.time, mi.scope.node, mi.scope.actorSystem))
  }

  def receive = {
    case mi: ModuleInformation => onModuleInformation(sender, mi)
  }

}


// Q: Why put Props here instead of hard-coding what Props we want?
// A: To make it easy to test in isolation.
// Now we can pass in Props of *anything* we want - so we can pass in Props to something that has access to
// The promise end of a future so we can test that the message is passed through as expected.
class OverviewHandler(builderProps: Props) extends OverviewHandlerBase {
  val builder = context.actorOf(builderProps, "overviewBuilder")
  def useMetadataStats(sender: ActorRef, stats: MetadataStats, errorStats: ErrorStats): Unit = {
    builder ! Result(receiver = sender,
      metadata = stats,
      deviations = errorStats)
  }

}
