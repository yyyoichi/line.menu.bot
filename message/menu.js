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