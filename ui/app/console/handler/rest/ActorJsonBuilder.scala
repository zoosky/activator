/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console.handler.rest

import akka.actor.ActorRef
import console.ClientController.Update
import activator.analytics.data.{ Scope, ActorStats }
import play.api.libs.json.{ Json, JsObject }

class ActorJsonBuilder extends JsonBuilderActor {
  import ActorJsonBuilder._

  def receive = {
    case r: ActorResult => r.receiver ! Update(createJson(r.stats))
  }
}

object ActorJsonBuilder {
  case class ActorResult(receiver: ActorRef, stats: ActorStats)

  def createJson(stats: ActorStats): JsObject = {
    Json.obj(
      "type" -> "actor",
      "data" ->
        Json.obj(
          "actor" -> createActorJson(stats)))
  }

  def createActorJson(stats: ActorStats): JsObject = {
    Json.obj(
      "timerange" ->
        Json.obj(
          "startTime" -> stats.timeRange.startTime,
          "endTime" -> stats.timeRange.endTime,
          "rangeType" -> stats.timeRange.toString),
      "scope" -> createScopeJson(stats.scope),
      "createdCount" -> stats.metrics.counts.createdCount,
      "stoppedCount" -> stats.metrics.counts.stoppedCount,
      "failedCount" -> stats.metrics.counts.failedCount,
      "restartCount" -> stats.metrics.counts.restartCount,
      "deviationCount" -> stats.metrics.counts.deviationCount,
      "errorCount" -> stats.metrics.counts.errorCount,
      "warningCount" -> stats.metrics.counts.warningCount,
      "deadLetterCount" -> stats.metrics.counts.deadLetterCount,
      "unhandledMessageCount" -> stats.metrics.counts.unhandledMessageCount,
      "processedMessagesCount" -> stats.metrics.counts.processedMessagesCount,
      "tellMessagesCount" -> stats.metrics.counts.tellMessagesCount,
      "askMessagesCount" -> stats.metrics.counts.askMessagesCount,
      "meanMailboxSize" -> stats.metrics.meanMailboxSize,
      "maxMailboxSize" -> stats.metrics.mailbox.maxMailboxSize,
      "maxMailboxSizeTimestamp" -> stats.metrics.mailbox.maxMailboxSizeTimestamp,
      "maxMailboxSizeAddressNode" -> stats.metrics.mailbox.maxMailboxSizeAddress.node,
      "maxMailboxSizeAddressPath" -> stats.metrics.mailbox.maxMailboxSizeAddress.path,
      "meanTimeInMailbox" -> stats.metrics.meanTimeInMailbox,
      "maxTimeInMailbox" -> stats.metrics.mailbox.maxTimeInMailbox,
      "maxTimeInMailboxTimestamp" -> stats.metrics.mailbox.maxTimeInMailboxTimestamp,
      "maxTimeInMailboxAddressNode" -> stats.metrics.mailbox.maxTimeInMailboxAddress.node,
      "maxTimeInMailboxAddressPath" -> stats.metrics.mailbox.maxTimeInMailboxAddress.path,
      "latestTraceEventTimestamp" -> stats.metrics.latestTraceEventTimestamp,
      "latestMessageTimestamp" -> stats.metrics.latestMessageTimestamp,
      "rateUnit" -> "messages/second",
      "meanProcessedMessageRate" -> stats.meanProcessedMessageRate,
      "meanProcessedMessageRateUnit" -> "messages/second",
      "meanBytesReadRate" -> stats.meanBytesReadRate,
      "meanBytesReadRateUnit" -> "bytes/second",
      "meanBytesWrittenRate" -> stats.meanBytesWrittenRate,
      "meanBytesWrittenRateUnit" -> "bytes/second")
  }

  def createScopeJson(scope: Scope): JsObject = {
    val node = scope.node.getOrElse("")
    val actorSystem = scope.actorSystem.getOrElse("")
    val path = scope.path.getOrElse("")
    val dispatcher = scope.dispatcher.getOrElse("")
    val tag = scope.tag.getOrElse("")
    val playPattern = scope.playPattern.getOrElse("")
    val playController = scope.playController.getOrElse("")
    Json.obj(
      "node" -> node,
      "actorSystem" -> actorSystem,
      "actorPath" -> path,
      "dispatcher" -> dispatcher,
      "tag" -> tag,
      "playPattern" -> playPattern,
      "playController" -> playController)
  }
}
