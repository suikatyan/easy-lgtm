$(() => {
  let app = {};
  app.utilities  = new Utilities();
  app.templater  = new Templater(app);
  app.frontend   = new Frontend(app);

  app.frontend.initialize();
});
