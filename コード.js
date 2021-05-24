const ACCESS_TOKEN = ""// => 【】も削除！
const SPREAD_SHEET = SpreadsheetApp.getActiveSpreadsheet();

//スプレッドシートを所定の書式に変更する
//
function initFunction() {
  //新しいシートを作成する関数
  const createSheets = ({ sheetName, values }) => {
    try {
      const sheet = SPREAD_SHEET.insertSheet(sheetName);//新しいシートを作成する
      console.log(sheetName + "を作成しました。");
      if (!values) {//valuesがなけ(データ取得用のシートであ)れば、非表示にするシート
        sheet.hideSheet();
      } else {//編集用のシートであれば
        const row = values.length;
        const column = values[0].length;
        sheet.getRange(1, 1, row, column).setValues(values);//新しいシートに値を貼り付ける
      }
    } catch (e) {
      console.log(sheetName + "の作成に失敗しました。");
      console.error(e);
    }
  }

  //新しく作成するシートの情報
  ////編集用のシート=>日本語のシート, データ取得用のシート=>ローマ字のシート
  const sheetsInfo = [
    {
      sheetName: "店舗情報",
      values: [["店舗情報"],[ "店舗名：\n店舗住所：\n店舗SNS："]],
    }, {
      sheetName: "カテゴリ",
      values: [["カテゴリ名"], ["ハンバーガー"]],
    }, {
      sheetName: "メニュー",
      values: [["カテゴリ", "メニュー名", "価格", "説明"], ["ハンバーガー", "バーベキューハンバーガー", 1000, "おいしいよ。"]],
    }, {
      sheetName: "info"
    }, {
      sheetName: "category"
    }, {
      sheetName: "menu"
    }
  ];

  sheetsInfo.forEach(createSheets);//新しいシートを作成する処理を行う
  ScriptApp.newTrigger("onOpen").forSpreadsheet(SPREAD_SHEET).onOpen().create();//起動時にonOpen関数を実行するトリガーを設置する
}


function onOpen() {
  const myMenu = [
    { name: '更新を登録', functionName: 'updateMenu' }
  ];
  SPREAD_SHEET.addMenu('<登録>', myMenu);
}

//編集用のシート=>fromSheet, データ取得用のシート=>toSheet
class Sheet {
  constructor(sheetName) {
    const sheetNumsObj = {
      "category": {
        fromSheetName: "カテゴリ",
        numRows: 13,
        numColumns: 1
      },
      "menu": {
        fromSheetName: "メニュー",
        numRows: 10,
        numColumns: 4
      },
      "info": {
        fromSheetName: "店舗情報",
        numRows: 2,
        numColumns: 1
      }
    };
    const sheetNums = sheetNumsObj[sheetName];
    this.toRange = SPREAD_SHEET.getSheetByName(sheetName)
      .getRange(1, 1, sheetNums["numRows"], sheetNums["numColumns"]);
    this.numRows = sheetNums["numRows"];
    this.numColumns = sheetNums["numColumns"];
    this.fromSheetName = sheetNums["fromSheetName"];
  }
  getValues() {
    return this.toRange.getValues();
  }
  peastValues() {
    const fromValues = SPREAD_SHEET.getSheetByName(this.fromSheetName)
      .getRange(2, 1, this.numRows, this.numColumns)
      .getValues();//編集シートの値を取得
    this.toRange.setValues(fromValues);
  }
}

function updateMenu() {
  const toSheets = ["category", "menu", "info"];
  toSheets.forEach(sheetName => {
    const sheet = new Sheet(sheetName);
    sheet.peastValues();
  });
}



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


//category を返す関数
function makeCategoryMessages() {
  const createContent = (categoryName) => {
    const action = {
      "type": "postback",
      "label": categoryName,
      "data": categoryName
    }
    return {
      "type": "action",
      "action": action
    }
  };

  const categorySheet = new Sheet("category");
  const values = categorySheet.getValues();//[[categoryName0],[categoryName1],...];
  const items = values.reduce((array, x) => {
    const categoryName = x[0];
    if (!categoryName) return array;//categoryNameが空欄であれば追加しない。
    return [...array, createContent(categoryName)];
  }, []);
  console.log(items);
  if (!items.length) return [{ "type": "text", "text": "メニューがありません" }];

  return [{
    "type": "text",
    "text": "メニューカテゴリです",
    "quickReply": { "items": items }
  }];
}


//menuを返す関数
function makeMenuMessages(categoryName) {
  console.log(categoryName);
  const numberWithDelimiter = (number) => {
    return "¥" + String(number).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  }
  const createContent = ([menuName, price, discription]) => {
    return {
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [],
        "backgroundColor": "#666666"
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": menuName,
            "size": "xl"
          },
          {
            "type": "text",
            "text": numberWithDelimiter(price),
            "style": "italic",
            "align": "end",
            "size": "lg"
          },
          {
            "type": "text",
            "text": discription,
            "wrap": true,
            "color": "#666666",
            "margin": "lg"
          }
        ]
      }
    }

  }

  const menuSheet = new Sheet("menu");
  //[["メニュー名", "価格", "説明"],[],...]
  const values = menuSheet
    .getValues()
    .reduce((array, x) => {
      if (x[0] !== categoryName || !x[1]) return array;//カテゴリ名が同じメニューのみ取り出す。
      return [...array, [x[1], x[2], x[3]]];
    }, []);

  if (values === []) return [{ "type": "text", "text": "メニューがありません" }];
  const contents = values.reduce((array,x) => [ ...array, createContent(x)] ,[]);
  console.log(contents);
  return [{
    type: "flex",
    altText: categoryName + "メニューです",
    contents: {
      type: "carousel",
      contents: contents
    }
  }];
}

function makeInfoMessages() {
  const infoSheet = new Sheet("info");
  const infoText = infoSheet.getValues()[0][0];//B1セルを取得
  console.log(infoText)
  return [{ "type": "text", "text": infoText }];
}

