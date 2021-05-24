function getPayload(event) {
  const replyToken = event["replyToken"];//LINEに送信するToken
  const type = event["type"];
  console.log("type:" +type)
  //受け取ったメッセージタイプがmessageであれば
  if (type === "message") {
    const text = event["message"]["text"];
    if (text === "メニュー") {//テキスト内容が"メニュー"で
      return {
        'replyToken': replyToken,
        "messages": makeCategoryMessages()
      };
    } else if (text === "店舗情報") {
      return {
        'replyToken': replyToken,
        "messages": makeInfoMessages()
      };
    }

    //受け取ったメッセージタイプがpostboackイベント（カテゴリをタップした場合にpostbackになる）であったら
  } else if (type === "postback") {
    const categoryName = event["postback"]["data"];
    return {
      'replyToken': replyToken,
      "messages": makeMenuMessages(categoryName)
    };
  }
}
