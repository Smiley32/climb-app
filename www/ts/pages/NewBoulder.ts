class NewBoulder extends Page {
    static TYPE_PAGE_NEW_BOULDER: string = 'PAGE_NEW_BOULDER';
  
    public getType() : string {
      return NewBoulder.TYPE_PAGE_NEW_BOULDER;
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
    
    //
    // Connect events
    public connect() {
      console.log('test');
      console.log(this);
      // document.getElementById('HallsSearchButton').addEventListener('click', this.onSearchClick.bind(this));
    }

    //
    // Private functions
    // ...
  
    //
    // Callback functions (on click for example)
    // ...
}