/**
 * スケッチアプリの描画機能を管理するJavaScriptファイル
 * ペンツール、消しゴムツール、キャンバス操作のイベントハンドラを提供します
 */

// 描画機能の名前空間
SketchApp.Drawing = {};

// 描画エリアのマウスダウンイベント
SketchApp.Drawing.handleCanvasMouseDown = function(e) {
  if (SketchApp.currentTool === 'select') {
    // 選択ツールの場合は何もしない
    return;
  }
  
  // 写真の上でのクリックを許可するため、この条件チェックを削除
  // if (e.target.closest('.photo-container')) {
  //   return;
  // }
  
  SketchApp.isDrawing = true;
  const rect = SketchApp.canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  [SketchApp.lastX, SketchApp.lastY] = [x, y];
  
// 最初の点を描画
if (SketchApp.currentTool === 'pen') {
  SketchApp.ctx.beginPath();
  SketchApp.ctx.arc(x, y, SketchApp.currentSize / 2, 0, Math.PI * 2);
  SketchApp.ctx.fillStyle = SketchApp.currentColor;
  SketchApp.ctx.fill();
} else if (SketchApp.currentTool === 'eraser') {
  SketchApp.Drawing.erase(x, y);
}
  
  console.log(`描画開始: ${SketchApp.lastX}, ${SketchApp.lastY}`);
};

// 描画エリアのマウス移動イベント
SketchApp.Drawing.handleCanvasMouseMove = function(e) {
  if (SketchApp.currentTool === 'select') {
    // 選択ツールの場合は何もしない
    return;
  }
  
  if (!SketchApp.isDrawing) return;
  
  const rect = SketchApp.canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  if (SketchApp.currentTool === 'pen') {
    SketchApp.Drawing.drawLine(SketchApp.lastX, SketchApp.lastY, x, y);
  } else if (SketchApp.currentTool === 'eraser') {
    SketchApp.Drawing.erase(x, y);
  }
  
  [SketchApp.lastX, SketchApp.lastY] = [x, y];
};

// 描画エリアのマウスアップイベント
SketchApp.Drawing.handleCanvasMouseUp = function() {
  if (SketchApp.currentTool === 'select') {
    // 選択ツールの場合は何もしない
    return;
  }
  
  SketchApp.isDrawing = false;
  console.log('描画終了');
};

// 描画エリアのマウスアウトイベント
SketchApp.Drawing.handleCanvasMouseOut = function() {
  if (SketchApp.currentTool === 'select') {
    // 選択ツールの場合は何もしない
    return;
  }
  
  SketchApp.isDrawing = false;
  console.log('描画終了');
};

// 描画エリアのタッチスタートイベント
SketchApp.Drawing.handleCanvasTouchStart = function(e) {
  if (SketchApp.currentTool === 'select') {
    // 選択ツールの場合は何もしない
    return;
  }
  
  // 写真の上でのタッチを許可するため、この条件チェックを削除
  // if (e.target.closest('.photo-container')) {
  //   return;
  // }
  
  e.preventDefault();
  SketchApp.isDrawing = true;
  const rect = SketchApp.canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  [SketchApp.lastX, SketchApp.lastY] = [x, y];
  
  // 最初の点を描画
  if (SketchApp.currentTool === 'pen') {
    SketchApp.ctx.beginPath();
    SketchApp.ctx.arc(x, y, SketchApp.currentSize / 2, 0, Math.PI * 2);
    SketchApp.ctx.fillStyle = SketchApp.currentColor;
    SketchApp.ctx.fill();
  } else if (SketchApp.currentTool === 'eraser') {
    SketchApp.Drawing.erase(x, y);
  }
  
  console.log(`タッチ描画開始: ${SketchApp.lastX}, ${SketchApp.lastY}`);
};

// 描画エリアのタッチムーブイベント
SketchApp.Drawing.handleCanvasTouchMove = function(e) {
  if (SketchApp.currentTool === 'select') {
    // 選択ツールの場合は何もしない
    return;
  }
  
  e.preventDefault();
  if (!SketchApp.isDrawing) return;
  
  const rect = SketchApp.canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  
  if (SketchApp.currentTool === 'pen') {
    SketchApp.Drawing.drawLine(SketchApp.lastX, SketchApp.lastY, x, y);
  } else if (SketchApp.currentTool === 'eraser') {
    SketchApp.Drawing.erase(x, y);
  }
  
  [SketchApp.lastX, SketchApp.lastY] = [x, y];
};

// 描画エリアのタッチエンドイベント
SketchApp.Drawing.handleCanvasTouchEnd = function() {
  if (SketchApp.currentTool === 'select') {
    // 選択ツールの場合は何もしない
    return;
  }
  
  SketchApp.isDrawing = false;
  console.log('描画終了');
};

// 線を描画する
SketchApp.Drawing.drawLine = function(startX, startY, endX, endY) {
  SketchApp.ctx.beginPath();
  SketchApp.ctx.moveTo(startX, startY);
  SketchApp.ctx.lineTo(endX, endY);
  SketchApp.ctx.strokeStyle = SketchApp.currentColor;
  SketchApp.ctx.lineWidth = SketchApp.currentSize;
  SketchApp.ctx.lineCap = 'round';
  SketchApp.ctx.stroke();
};

// 消しゴムで消す
SketchApp.Drawing.erase = function(x, y) {
  SketchApp.ctx.beginPath();
  SketchApp.ctx.globalCompositeOperation = 'destination-out';
  SketchApp.ctx.arc(x, y, SketchApp.currentSize * 2, 0, Math.PI * 2);
  SketchApp.ctx.fill();
  SketchApp.ctx.globalCompositeOperation = 'source-over';
};
