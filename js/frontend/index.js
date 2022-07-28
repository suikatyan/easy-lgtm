$(() => {
  let app = {};
  app.utilities  = new Utilities();
  app.templater  = new Templater(app);
  app.frontend   = new Frontend(app);

  $(document).on("turbo:visit", function () {
    app.frontend.initialize();
  });

  app.frontend.initialize();
});
