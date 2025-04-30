/**
 * スケッチアプリのメインJavaScriptファイル
 * アプリの初期化と基本設定を行います
 */

// 名前空間の作成
const SketchApp = {};

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
  // 初期化
  SketchApp.init();
});

// アプリケーションの初期化と設定
SketchApp.init = function() {
  console.log('アプリケーションを初期化します');
  
  // キャンバス関連の変数
  SketchApp.canvas = document.getElementById('canvas');
  SketchApp.ctx = SketchApp.canvas.getContext('2d');
  SketchApp.currentTool = 'pen';
  SketchApp.currentColor = '#000000';
  SketchApp.currentSize = 5;
  SketchApp.isDrawing = false;
  SketchApp.lastX = 0;
  SketchApp.lastY = 0;
  
  // 写真関連の変数
  SketchApp.photos = [];
  SketchApp.selectedPhoto = null;
  SketchApp.isDragging = false;
  SketchApp.dragOffsetX = 0;
  SketchApp.dragOffsetY = 0;
  SketchApp.photoIdCounter = 0;

  // ツールボタン
  SketchApp.toolButtons = document.querySelectorAll('.tool-button');
  SketchApp.colorButtons = document.querySelectorAll('.color-button');
  SketchApp.sizeButtons = document.querySelectorAll('.size-button');
  SketchApp.clearButton = document.getElementById('clear-canvas');
  SketchApp.addPhotoButton = document.getElementById('add-photo-button');
  SketchApp.photoUploadInput = document.getElementById('photo-upload');
  SketchApp.saveButton = document.getElementById('save-button');
  SketchApp.drawingArea = document.getElementById('drawing-area');
  
  // キャンバスのサイズを設定
  SketchApp.resizeCanvas();
  
  // ウィンドウリサイズ時にキャンバスサイズを更新
  window.addEventListener('resize', SketchApp.resizeCanvas);
  
  // イベントリスナーを設定
  SketchApp.setupEventListeners();
  
  // 日付を今日の日付に設定
  document.getElementById('entry-date').valueAsDate = new Date();
  
  console.log('初期化完了');
};

// キャンバスのリサイズ
SketchApp.resizeCanvas = function() {
  const drawingArea = document.querySelector('.drawing-area');
  SketchApp.canvas.width = drawingArea.clientWidth;
  SketchApp.canvas.height = drawingArea.clientHeight;
  
  // キャンバスをクリア
  SketchApp.ctx.fillStyle = '#fff';
  SketchApp.ctx.fillRect(0, 0, SketchApp.canvas.width, SketchApp.canvas.height);
  
  console.log(`キャンバスサイズ: ${SketchApp.canvas.width}x${SketchApp.canvas.height}`);
};

// イベントリスナーの設定
SketchApp.setupEventListeners = function() {
  // 描画イベント
  SketchApp.canvas.addEventListener('mousedown', SketchApp.Drawing.handleCanvasMouseDown);
  SketchApp.canvas.addEventListener('mousemove', SketchApp.Drawing.handleCanvasMouseMove);
  SketchApp.canvas.addEventListener('mouseup', SketchApp.Drawing.handleCanvasMouseUp);
  SketchApp.canvas.addEventListener('mouseout', SketchApp.Drawing.handleCanvasMouseOut);
  
  // タッチイベント
  SketchApp.canvas.addEventListener('touchstart', SketchApp.Drawing.handleCanvasTouchStart);
  SketchApp.canvas.addEventListener('touchmove', SketchApp.Drawing.handleCanvasTouchMove);
  SketchApp.canvas.addEventListener('touchend', SketchApp.Drawing.handleCanvasTouchEnd);
  
  // 写真のドラッグイベント（描画エリア全体に対して一度だけ設定）
  SketchApp.drawingArea.addEventListener('mousemove', SketchApp.Photo.handleDrawingAreaMouseMove);
  SketchApp.drawingArea.addEventListener('mouseup', SketchApp.Photo.handleDrawingAreaMouseUp);
  
  // 写真のタッチドラッグイベント
  SketchApp.drawingArea.addEventListener('touchmove', SketchApp.Photo.handleDrawingAreaTouchMove, { passive: false });
  SketchApp.drawingArea.addEventListener('touchend', SketchApp.Photo.handleDrawingAreaTouchEnd);
  
  // ツールボタン
  SketchApp.toolButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tool = button.dataset.tool;
      console.log(`ツール変更: ${tool}`);
      SketchApp.currentTool = tool;
      
      // 選択ツールに切り替えた場合、カーソルを変更
      if (tool === 'select') {
        SketchApp.canvas.style.cursor = 'default';
      } else {
        SketchApp.canvas.style.cursor = 'crosshair';
      }
      
      // アクティブクラスの切り替え
      SketchApp.toolButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // 選択ツールでない場合は選択を解除
      if (tool !== 'select') {
        SketchApp.Photo.unselectAllPhotos();
      }
    });
  });
  
  // カラーボタン
  SketchApp.colorButtons.forEach(button => {
    button.addEventListener('click', () => {
      const color = button.dataset.color;
      console.log(`色変更: ${color}`);
      SketchApp.currentColor = color;
      
      // アクティブクラスの切り替え
      SketchApp.colorButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
  
  // サイズボタン
  SketchApp.sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const size = parseInt(button.dataset.size);
      console.log(`サイズ変更: ${size}`);
      SketchApp.currentSize = size;
      
      // アクティブクラスの切り替え
      SketchApp.sizeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
  
  // クリアボタン
  SketchApp.clearButton.addEventListener('click', () => {
    console.log('キャンバスをクリア');
    SketchApp.ctx.fillStyle = '#fff';
    SketchApp.ctx.fillRect(0, 0, SketchApp.canvas.width, SketchApp.canvas.height);
    
    // 写真も全て削除
    SketchApp.Photo.removeAllPhotos();
  });
  
  // 写真追加ボタン
  SketchApp.addPhotoButton.addEventListener('click', () => {
    console.log('写真追加ボタンがクリックされました');
    SketchApp.photoUploadInput.click();
  });
  
  // 写真アップロード
  SketchApp.photoUploadInput.addEventListener('change', SketchApp.Photo.handlePhotoUpload);
  
  // 保存ボタン
  SketchApp.saveButton.addEventListener('click', SketchApp.Save.saveCanvas);
};
