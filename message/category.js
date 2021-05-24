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