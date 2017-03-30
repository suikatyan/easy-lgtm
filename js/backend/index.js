$(() => {
  let app = {};
  app.utilities    = new Utilities();
  app.storage      = new Storage(app);
  app.imageService = new ImageService(app);
  app.backend      = new Backend(app);

  app.backend.initialize();
});
