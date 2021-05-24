function makeInfoMessages() {
  const infoSheet = new Sheet("info");
  const infoText = infoSheet.getValues()[0][0];//B1セルを取得
  console.log(infoText)
  return [{ "type": "text", "text": infoText }];
}