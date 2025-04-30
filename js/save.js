/**
 * スケッチアプリの保存機能を提供するJavaScriptファイル
 * キャンバスと写真の合成処理、ダウンロード処理などを提供します
 */

// 保存機能の名前空間
SketchApp.Save = {};

// キャンバスを保存
SketchApp.Save.saveCanvas = function() {
  console.log('キャンバスを保存します');
  
  // 一時的なキャンバスを作成
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = SketchApp.canvas.width;
  tempCanvas.height = SketchApp.canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  // 背景を白で塗りつぶす
  tempCtx.fillStyle = '#fff';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  
  // 写真を描画
  SketchApp.Save.drawPhotosToCanvas(tempCtx);
  
  // 描画内容をコピー
  tempCtx.drawImage(SketchApp.canvas, 0, 0);
  
  // データURLに変換
  const dataURL = tempCanvas.toDataURL('image/png');
  
  // ダウンロードリンクを作成
  SketchApp.Save.downloadImage(dataURL);
  
  console.log('キャンバスを保存しました');
};

// 写真をキャンバスに描画
SketchApp.Save.drawPhotosToCanvas = function(ctx) {
  SketchApp.photos.forEach(photo => {
    const img = new Image();
    img.src = photo.src;
    ctx.drawImage(img, photo.x, photo.y, photo.width, photo.height);
  });
};

// 画像をダウンロード
SketchApp.Save.downloadImage = function(dataURL) {
  // 日付を取得
  const date = document.getElementById('entry-date').value || new Date().toISOString().split('T')[0];
  
  // ダウンロードリンクを作成
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = `sketch_${date}.png`;
  
  // リンクをクリック
  link.click();
};
