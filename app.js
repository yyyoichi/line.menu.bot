const ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty("ACCESS_TOKEN");
const SPREAD_SHEET = SpreadsheetApp.getActiveSpreadsheet();
function onOpen() {
  const myMenu = [
    { name: '更新を登録', functionName: 'updateMenu' }
  ];
  SPREAD_SHEET.addMenu('<登録>', myMenu);
}

function updateMenu() {
  const toSheets = ["category", "menu", "info"];
  toSheets.forEach(sheetName => {
    const sheet = new Sheet(sheetName);
    sheet.peastValues();
  });
}