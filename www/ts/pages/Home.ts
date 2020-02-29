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
    // ...
  }
}