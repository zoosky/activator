package console.handler.rest

import play.api.libs.json.{ Json, JsObject, JsValue, JsArray, Writes, JsString }
import activator.analytics.data.{ TimeRange, ErrorStats, DeviationDetail }

object ErrorStatsJsonBuilder {
  import TimeRangeJsonBuilder._
  import JsonBuilder._
  import DevationDetailJsonBuilder._

  def createJson(errorStats: ErrorStats): JsObject = {
    Json.obj(
      "id" -> errorStats.id.toString,
      "timerange" -> createTimeRangeJson(errorStats.timeRange),
      "deviationCount" -> errorStats.metrics.counts.total,
      "errorCount" -> errorStats.metrics.counts.errors,
      "errors" -> createDeviationDetailJsonSeq(errorStats.metrics.deviations.errors),
      "warningCount" -> errorStats.metrics.counts.warnings,
      "warnings" -> createDeviationDetailJsonSeq(errorStats.metrics.deviations.warnings),
      "deadLetterCount" -> errorStats.metrics.counts.deadLetters,
      "deadLetters" -> createDeviationDetailJsonSeq(errorStats.metrics.deviations.deadLetters),
      "unhandledMessageCount" -> errorStats.metrics.counts.unhandledMessages,
      "unhandledMessages" -> createDeviationDetailJsonSeq(errorStats.metrics.deviations.unhandledMessages),
      "deadlockCount" -> errorStats.metrics.counts.deadlocks,
      "deadlocks" -> createDeviationDetailJsonSeq(errorStats.metrics.deviations.deadlockedThreads)) ++
      optJson("node", errorStats.node) ++
      optJson("actorSystem", errorStats.actorSystem)
  }

  def createJsonSeq(errorStatsSeq: Seq[ErrorStats]): JsArray =
    new JsArray(errorStatsSeq.map(createJson(_)))
}
