package snap

import org.junit.Assert._
import org.junit._
import WebSocketActor._
import play.api.libs.json._

class WebSocketActorTest {
  @Test
  def testMessageSerialization(): Unit = {
    val message1 = InspectRequest(Json.obj("foo" -> "bar"))
    val message1Json = Json.toJson(message1)
    val message1Return = message1Json.as[InspectRequest]
    assertTrue("InspectRequest message makes JSON round trip", message1 == message1Return)
  }
}
