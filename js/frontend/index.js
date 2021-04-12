$(() => {
  let app = {};
  app.utilities  = new Utilities();
  app.templater  = new Templater(app);
  app.frontend   = new Frontend(app);

  $(document).on("pjax:success", function () {
    app.frontend.initialize();
  });

  app.frontend.initialize();
});
