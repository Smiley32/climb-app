class Boulders extends Page {
    static TYPE_PAGE_BOULDERS: string = 'PAGE_BOULDERS';
  
    private _fctBoulderCard = null;
  
    public getType() : string {
      return Boulders.TYPE_PAGE_BOULDERS;
    }
  
    public create(fct: PageFunction, params: any) {
      let that = this;
      Tools.get(Loader.PATH_TEMPLATES + 'cardBoulder.html', function(text) {
        that._fctBoulderCard = doT.template(text);
      });
      this.mount(fct(params));

      this.getBoulders();
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
      document.getElementById('BouldersAddButton').addEventListener('click', this.onNewBoulderButtonClick.bind(this));
    }

    //
    // Private functions
    private getBoulders() {
      let that = this;
      let hallId = Tools.getHall();
      if (null == hallId) {
        console.log('Error, no hall choosen');
        return;
      }
      Tools.get(Tools.SERVER_BASE_URL + 'get/boulder?hall_id=' + hallId + '&search=', function(text) {
        console.log('GET: ' + text);
        let parsed = JSON.parse(text);
        if (!parsed) {
          console.log('Error trying to get boulders from the database');
        } else {
          let html: string = '';
          for (let i = 0; i < parsed.length; i++) {
            html += that._fctBoulderCard({
              'image': Tools.SERVER_BASE_URL + 'images/' + parsed[i]['id'] + '.jpg',
              'description': parsed[i]['description'],
              'difficulty': Tools.gradeValueToFrench(parsed[i]['difficulty']),
              'success_count': 42,
              'creator': parsed[i]['creator_name'],
              'hall': parsed[i]['hall_name']
            });
          }
          document.getElementById('BouldersListContainer').innerHTML = html;
        }
      });
    }
  
    //
    // Callback functions (on click for example)
    private onNewBoulderButtonClick() {
      Loader.getInstance().load(Loader.PAGE_NEW_BOULDER, {});
    }
}