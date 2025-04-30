/**
 * スケッチアプリの描画機能を管理するJavaScriptファイル
 * ペンツール、消しゴムツール、キャンバス操作のイベントハンドラを提供します
 */

// 描画機能の名前空間
SketchApp.Drawing = {};

// キャンバスのマウスダウンイベント
SketchApp.Drawing.handleCanvasMouseDown = function(e) {
  if (SketchApp.currentTool === 'select') {
    // 選択ツールの場合は何もしない
    return;
  }
  
  SketchApp.isDrawing = true;
  [SketchApp.lastX, SketchApp.lastY] = [e.offsetX, e.offsetY];
  console.log(`描画開始: ${SketchApp.lastX}, ${SketchApp.lastY}`);
};

// キャンバスのマウス移動イベント
SketchApp.Drawing.handleCanvasMouseMove = function(e) {
  if (SketchApp.currentTool === 'select') {
    // 選択ツールの場合は何もしない
    return;
  }
  
  if (!SketchApp.isDrawing) return;
  
  const x = e.offsetX;
  const y = e.offsetY;
  
  if (SketchApp.currentTool === 'pen') {
    SketchApp.Drawing.drawLine(SketchApp.lastX, SketchApp.lastY, x, y);
  } else if (SketchApp.currentTool === 'eraser') {
    SketchApp.Drawing.erase(x, y);
  }
  
  [SketchApp.lastX, SketchApp.lastY] = [x, y];
};

// キャンバスのマウスアップイベント
SketchApp.Drawing.handleCanvasMouseUp = function() {
  if (SketchApp.currentTool === 'select') {
    // 選択ツールの場合は何もしない
    return;
  }
  
  SketchApp.isDrawing = false;
  console.log('描画終了');
};

// キャンバスのマウスアウトイベント
SketchApp.Drawing.handleCanvasMouseOut = function() {
  if (SketchApp.currentTool === 'select') {
    // 選択ツールの場合は何もしない
    return;
  }
  
  SketchApp.isDrawing = false;
  console.log('描画終了');
};

// キャンバスのタッチスタートイベント
SketchApp.Drawing.handleCanvasTouchStart = function(e) {
  if (SketchApp.currentTool === 'select') {
    // 選択ツールの場合は何もしない
    return;
  }
  
  e.preventDefault();
  SketchApp.isDrawing = true;
  const rect = SketchApp.canvas.getBoundingClientRect();
  const touch = e.touches[0];
  [SketchApp.lastX, SketchApp.lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
  console.log(`タッチ描画開始: ${SketchApp.lastX}, ${SketchApp.lastY}`);
};

// キャンバスのタッチムーブイベント
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

// キャンバスのタッチエンドイベント
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
  SketchApp.ctx.fillStyle = '#fff';
  SketchApp.ctx.arc(x, y, SketchApp.currentSize * 2, 0, Math.PI * 2);
  SketchApp.ctx.fill();
};
