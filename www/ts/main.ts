function main() {
  let loader: Loader = Loader.getInstance();
  loader.Initialize(function() {
    console.log('Loader initialized!');
    loader.load(Loader.PAGE_HOME, {
      test: 'Smiley32'
    });
  });
}

document.addEventListener('deviceready', main);