/**
 * スケッチアプリの写真管理機能を提供するJavaScriptファイル
 * 写真のアップロード、表示、移動、削除などの機能を提供します
 */

// 写真管理機能の名前空間
SketchApp.Photo = {};

// 描画エリアのマウス移動イベント（写真のドラッグ用）
SketchApp.Photo.handleDrawingAreaMouseMove = function(e) {
  if (!SketchApp.isDragging || !SketchApp.selectedPhoto) return;
  
  const rect = SketchApp.drawingArea.getBoundingClientRect();
  const x = e.clientX - rect.left - SketchApp.dragOffsetX;
  const y = e.clientY - rect.top - SketchApp.dragOffsetY;
  
  // 選択中の写真の位置を更新
  const photoElement = document.getElementById(`photo-${SketchApp.selectedPhoto.id}`);
  if (photoElement) {
    photoElement.style.left = `${x}px`;
    photoElement.style.top = `${y}px`;
    
    // 写真オブジェクトの位置も更新
    SketchApp.selectedPhoto.x = x;
    SketchApp.selectedPhoto.y = y;
  }
};

// 描画エリアのマウスアップイベント（写真のドラッグ終了用）
SketchApp.Photo.handleDrawingAreaMouseUp = function() {
  SketchApp.isDragging = false;
};

// 写真アップロード処理
SketchApp.Photo.handlePhotoUpload = function(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      // 画像のサイズを調整
      const maxWidth = SketchApp.canvas.width * 0.3;
      const maxHeight = SketchApp.canvas.height * 0.3;
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = height * (maxWidth / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = width * (maxHeight / height);
        height = maxHeight;
      }
      
      // 写真の位置を計算（既存の写真の数に応じて位置をずらす）
      const offset = SketchApp.photos.length * 20; // 20pxずつずらす
      const x = (SketchApp.canvas.width - width) / 2 + offset;
      const y = (SketchApp.canvas.height - height) / 2 + offset;
      
      // 写真オブジェクトを作成
      const photoId = SketchApp.photoIdCounter++;
      const photo = {
        id: photoId,
        src: event.target.result,
        x: x,
        y: y,
        width: width,
        height: height
      };
      
      // 写真を配列に追加
      SketchApp.photos.push(photo);
      
      // 写真要素を作成
      SketchApp.Photo.createPhotoElement(photo);
      
      console.log(`写真を追加しました (ID: ${photoId})`);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
  
  // ファイル選択をリセット
  e.target.value = '';
};

// 写真要素を作成
SketchApp.Photo.createPhotoElement = function(photo) {
  const photoElement = document.createElement('div');
  photoElement.className = 'photo-container';
  photoElement.id = `photo-${photo.id}`;
  photoElement.style.left = `${photo.x}px`;
  photoElement.style.top = `${photo.y}px`;
  photoElement.style.width = `${photo.width}px`;
  photoElement.style.height = `${photo.height}px`;
  
  const img = document.createElement('img');
  img.src = photo.src;
  photoElement.appendChild(img);
  
  // 削除ボタンを追加
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  deleteButton.innerHTML = '×';
  deleteButton.addEventListener('click', (e) => {
    e.stopPropagation();
    SketchApp.Photo.removePhoto(photo.id);
  });
  photoElement.appendChild(deleteButton);
  
  // 選択イベントを追加
  photoElement.addEventListener('mousedown', (e) => {
    if (SketchApp.currentTool !== 'select') return;
    
    e.stopPropagation();
    
    // 他の写真の選択を解除
    SketchApp.Photo.unselectAllPhotos();
    
    // この写真を選択
    photoElement.classList.add('selected');
    SketchApp.selectedPhoto = photo;
    
    // ドラッグ開始
    SketchApp.isDragging = true;
    const rect = photoElement.getBoundingClientRect();
    SketchApp.dragOffsetX = e.clientX - rect.left;
    SketchApp.dragOffsetY = e.clientY - rect.top;
  });
  
  // 描画エリアに追加
  SketchApp.drawingArea.appendChild(photoElement);
};

// 写真を削除
SketchApp.Photo.removePhoto = function(id) {
  // 写真要素を削除
  const photoElement = document.getElementById(`photo-${id}`);
  if (photoElement) {
    photoElement.remove();
  }
  
  // 写真オブジェクトを削除
  SketchApp.photos = SketchApp.photos.filter(photo => photo.id !== id);
  
  // 選択中の写真だった場合は選択を解除
  if (SketchApp.selectedPhoto && SketchApp.selectedPhoto.id === id) {
    SketchApp.selectedPhoto = null;
  }
  
  console.log(`写真を削除しました (ID: ${id})`);
};

// 全ての写真を削除
SketchApp.Photo.removeAllPhotos = function() {
  // 全ての写真要素を削除
  SketchApp.photos.forEach(photo => {
    const photoElement = document.getElementById(`photo-${photo.id}`);
    if (photoElement) {
      photoElement.remove();
    }
  });
  
  // 写真配列をクリア
  SketchApp.photos = [];
  SketchApp.selectedPhoto = null;
  
  console.log('全ての写真を削除しました');
};

// 全ての写真の選択を解除
SketchApp.Photo.unselectAllPhotos = function() {
  const photoElements = document.querySelectorAll('.photo-container');
  photoElements.forEach(element => {
    element.classList.remove('selected');
  });
  SketchApp.selectedPhoto = null;
};
