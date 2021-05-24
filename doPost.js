//LINEから呼び出される。
function doPost(e) {
  // WebHookで受信した応答用Token
  const event = JSON.parse(e.postData.contents).events[0];
  const url = 'https://api.line.me/v2/bot/message/reply';
  const payload = getPayload(event);
  const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + ACCESS_TOKEN
  }
  const options = {
    'headers': headers, 'method': 'post',
    'payload': JSON.stringify(payload),
    // muteHttpExceptions: true, // エラーをデバックする場合、コメントオフ
  };
  try {
    UrlFetchApp.fetch(url, options);//LINEに情報を流す
  } catch (e) {
    console.error(e);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ 'content': 'post ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

