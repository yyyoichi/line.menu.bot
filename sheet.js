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