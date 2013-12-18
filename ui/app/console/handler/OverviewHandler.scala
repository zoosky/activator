/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

import console.handler.rest.OverviewParser
import console.handler.rest.OverviewParser.Result
import akka.actor.Props
import scala.concurrent._
import scala.concurrent.duration._
import ExecutionContext.Implicits.global
import activator.analytics.data.{ ErrorStats, MetadataStats, MetadataStatsMetrics }

class OverviewHandler extends RequestHandler {
  val parser = context.actorOf(Props[OverviewParser], "overviewParser")

  def receive = {
    case mi: ModuleInformation =>
      // TODO : define include of temp and anonymous actors
      val metadataFuture = future { repository.metadataStatsRepository.findFiltered(mi.time, mi.scope, true, true) }
      val spanFuture = future { repository.summarySpanStatsRepository.findMetadata(mi.time, mi.scope, true, true) }
      val deviationFuture = future { repository.errorStatsRepository.findWithinTimePeriod(mi.time, mi.scope.node, mi.scope.actorSystem) }
      // TODO : use configurable limit
      val limit = mi.pagingInformation.map(p => p.limit).getOrElse(100)

      val result =
        Await.result(
          for {
            metadata <- metadataFuture
            spans <- spanFuture
            deviations <- deviationFuture
          } yield (mergeMetadata(spans, metadata, limit), ErrorStats.concatenate(deviations, mi.time, mi.scope.node, mi.scope.actorSystem)),
          5.seconds)

      parser ! Result(
        receiver = sender,
        metadata = result._1,
        deviations = result._2)
  }

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
