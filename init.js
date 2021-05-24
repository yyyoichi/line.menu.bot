//スプレッドシートを所定の書式に変更する
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