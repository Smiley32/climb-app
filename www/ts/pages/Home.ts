class Home extends Page {
  static TYPE_PAGE_HOME: string = 'PAGE_HOME';

  public getType() : string {
    return Home.TYPE_PAGE_HOME;
  }

  public create(fct: PageFunction, params: any) {
    console.log(params.test);
    this.mount(fct(params));
  }

  public destroy() {
    // ...
  }

  public enter() {
    // ...
  }

  public leave() {
    console.log('Left Home');
  }
  
  //
  // Connect events
  public connect() {
    console.log(this);
    document.getElementById('HomeConnectButton').addEventListener('click', this.onConnectClick.bind(this));
    document.getElementById('HomeIgnoreButton').addEventListener('click', this.onIgnoreClick.bind(this));
  }

  //
  // Callback functions (on click for example)
  public onConnectClick() {
    console.log('Try to connect');

    //
    // Get value from the fields
    let pseudo = (<HTMLInputElement>document.getElementById("HomePseudoInput")).value;
    let password = (<HTMLInputElement>document.getElementById("HomePasswordInput")).value;

    if (pseudo.length < 1 || password.length < 1) {
      Tools.displayError('Les champs ne sont pas remplis');
      return;
    }

    //
    // Send a request to the server
    let that = this;
    Tools.post(Tools.SERVER_BASE_URL + 'post/login', {
      'pseudo': pseudo,
      'password': password
    }, function(data) {
      console.log(data);
      let parsed = JSON.parse(data);
      if (parsed.error === 0) {
        // Success
        // We can store the token
        Tools.setToken(parsed.token);
        //
        // We can load the next page.
        Loader.getInstance().load(Loader.PAGE_HALLS, {});
      }
    }, function(data) {
      // An error occurred.
      let parsed = JSON.parse(data);
      console.log(parsed.message);
      Tools.displayError(parsed.message);
    });
  }

  public onIgnoreClick() {
    console.log('Ignore connection');
    Loader.getInstance().load(Loader.PAGE_HALLS, {});
  }
}