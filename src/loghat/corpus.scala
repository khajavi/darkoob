import java.io.{File, PrintWriter}

import com.typesafe.scalalogging.LazyLogging
import org.jqurantree.arabic.ArabicText
import org.jqurantree.orthography.Document
import org.json4s.JsonAST.JArray

import scala.collection.SortedMap
import scala.io.Source

case class Location(surah: Int, ayah: Int, token: Int, subtoken: Int, token_str: String, token_raw_str: String)

object corpus extends App with LazyLogging {
  val corpus_url = "quranic-corpus-morphology-0.4.txt"
  val lines = Source.fromFile(corpus_url).getLines.toList.drop(57)

//  logger.info("parsing corpus")

  val pattern = "\\((\\d+):(\\d+):(\\d+):(\\d+)\\).*?LEM:(.*?)\\|".r
  val words = lines.filter(_.contains("ROOT")).flatMap { row =>
    val matches = pattern.findAllMatchIn(row)
    matches.map { row =>
      (Location(row.group(1).toInt, row.group(2).toInt, row.group(3).toInt, row.group(4).toInt, Document.getChapter(row.group(1).toInt).getVerse(row.group(2).toInt).getToken(row.group(3).toInt).toString, Document.getChapter(row.group(1).toInt).getVerse(row.group(2).toInt).getToken(row.group(3).toInt).removeDiacritics.toString), ArabicText.fromBuckwalter(row.group(5)))
    }.toIndexedSeq
  }

  val sorted = words.groupBy { case (_, token) =>
    (token.toString, token.removeDiacritics().toString)
  }.map { case (token, list) =>
    (token, list.map(_._1))
  }.toIndexedSeq.sortBy(_._1.toString)

  val wordMap = SortedMap(sorted: _*)

  import org.json4s.JsonDSL._

//  logger.info("creating json file")
  val jsonAst = {
    wordMap.map { case ((title, raw), list) =>
      ("lemma" -> JArray(List(title, raw))) ~ ("refs" -> list.map { ref =>
        ("surah" -> ref.surah) ~
          ("ayah" -> ref.ayah) ~
          ("word" -> JArray(List(ref.token_str,ref.token_raw_str))) ~
          ("token" -> JArray(List(ref.token,ref.subtoken)))
      })
    }
  }

  import org.json4s.jackson.JsonMethods._

//  logger.info("writing to file")
  val writer = new PrintWriter(new File("lemma.words.json"))
  writer.write(pretty(jsonAst))
  writer.close()
}
