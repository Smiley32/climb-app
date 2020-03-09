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
    var html = Loader.getInstance().fctMessageTemplate({
      'type': 'danger',
      'message': 'Un premier test d\'erreur'
    });
    document.getElementById('HomeMessageContainer').innerHTML = html;
  }

  public onIgnoreClick() {
    console.log('Ignore connection');
    Loader.getInstance().load(Loader.PAGE_HALLS, {});
  }
}