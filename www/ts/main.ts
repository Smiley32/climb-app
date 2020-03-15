function main() {
  let loader: Loader = Loader.getInstance();
  loader.Initialize(function() {
    console.log('Loader initialized!');
    if (null == Tools.getToken()) {
      // The user isn't connected, we ask him
      loader.load(Loader.PAGE_HOME, {
        'nameNavText': 'Login'
      });
    } else {
      // The user is already connected, we can skip the first page
      if (null == Tools.getHall()) {
        // If there isn't any hall defined, we load the page to choose one
        Loader.getInstance().load(Loader.PAGE_HALLS, {});
      } else {
        // A hall is stored, we can load the boulder page.
        // The user can then choose to change hall
        Loader.getInstance().load(Loader.PAGE_BOULDERS, {});
      }
    }
  });
}

document.addEventListener('deviceready', main);