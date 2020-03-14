class Halls extends Page {
  static TYPE_PAGE_HALLS: string = 'PAGE_HALLS';

  private _fctHallCard = null;

  public getType() : string {
    return Halls.TYPE_PAGE_HALLS;
  }

  public create(fct: PageFunction, params: any) {
    console.log(params.test);
    let that = this;
    Tools.get(Loader.PATH_TEMPLATES + 'cardHall.html', function(text) {
      that._fctHallCard = doT.template(text);
    });
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
    document.getElementById('HallsSearchButton').addEventListener('click', this.onSearchClick.bind(this));
  }

  //
  // Callback functions (on click for example)
  public onSearchClick() {
    let search = (<HTMLInputElement>document.getElementById('HallsSearchText')).value;
    let that = this;
    Tools.get(Tools.SERVER_BASE_URL + 'get/hall?search=' + search, function(data) {
      console.log(data);
      let parsed = JSON.parse(data);
      if (null !== that._fctHallCard) {
        let html: string = '';
        for (let i : number = 0; i < parsed.length; i++) {
          html += that._fctHallCard({
            'id': parsed[i]['id'],
            'name': parsed[i]['name'],
            'city': parsed[i]['city'],
            'htmlID': 'CardHall' + parsed[i]['id']
          });
        }
        document.getElementById('HallsListContainer').innerHTML = html;
        for (let i : number = 0; i < parsed.length; i++) {
          let elmt = document.getElementById('CardHall' + parsed[i]['id']);
          if (elmt) {
            elmt.addEventListener('click', that.onCardHallClick.bind(that, parsed[i]['id']));
          } else {
            console.log('Unable to set an event');
          }
        }
      }
    });
  }

  public onCardHallClick(id: number) {
    Tools.setHall(id);
    Loader.getInstance().load(Loader.PAGE_BOULDERS, {});
  }
}