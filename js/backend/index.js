
importScripts(
  '../common/Utilities.js',
  './Storage.js',
  './LgtmImage.js',
  './ImageService.js',
  './Backend.js'
);

let app = {};
app.utilities    = new Utilities();
app.storage      = new Storage(app);
app.imageService = new ImageService(app);
app.backend      = new Backend(app);

// 直接初期化
app.backend.initialize();
