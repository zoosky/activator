/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

import console.handler.rest.OverviewJsonBuilder.OverviewResult
import akka.actor.{ ActorRef, Props }
import scala.concurrent._
import ExecutionContext.Implicits.global
import activator.analytics.data.{ ErrorStats, MetadataStats, MetadataStatsMetrics }

object OverviewHandler {
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
    val anonymous = mi.actorInformation.map(_.includeAnonymous).getOrElse(false)
    val temporary = mi.actorInformation.map(_.includeTemporary).getOrElse(false)
    val metadataFuture = future { repository.metadataStatsRepository.findFiltered(mi.time, mi.scope, anonymous, temporary) }
    val spanFuture = future { repository.summarySpanStatsRepository.findMetadata(mi.time, mi.scope, anonymous, temporary) }
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

class OverviewHandler(builderProps: Props) extends OverviewHandlerBase {
  val builder = context.actorOf(builderProps, "overviewBuilder")
  def useMetadataStats(sender: ActorRef, stats: MetadataStats, errorStats: ErrorStats): Unit = {
    builder ! OverviewResult(receiver = sender,
      metadata = stats,
      deviations = errorStats)
  }

}
