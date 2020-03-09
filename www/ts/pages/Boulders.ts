class Boulders extends Page {
    static TYPE_PAGE_BOULDERS: string = 'PAGE_BOULDERS';
  
    private _fctBoulderCard = null;
  
    public getType() : string {
      return Boulders.TYPE_PAGE_BOULDERS;
    }
  
    public create(fct: PageFunction, params: any) {
      console.log(params.test);
      let that = this;
      Tools.get(Loader.PATH_TEMPLATES + 'cardBoulder.html', function(text) {
        that._fctBoulderCard = doT.template(text);
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
      // document.getElementById('HallsSearchButton').addEventListener('click', this.onSearchClick.bind(this));
    }

    //
    // Private functions
    private getBoulders() {
        let that = this;
        Tools.get(Tools.SERVER_BASE_URL + 'get/boulder?hall_id=1&search=', function(text) {
            console.log('GET: ' + text);
            let parsed = JSON.parse(text);
            if (!parsed) {
                console.log('Error trying to get boulders from the database');
            } else {
                let html: string = '';
                for (let i = 0; i < parsed.length; i++) {
                    html += that._fctBoulderCard({
                        'description': parsed[i]['description'],
                        'difficulty': parsed[i]['difficulty'],
                        'success_count': 42,
                        'creator': parsed[i]['creator_id'],
                        'hall': parsed[i]['hall_id']
                    });
                }
                document.getElementById('BouldersListContainer').innerHTML = html;
            }
        });
    }
  
    //
    // Callback functions (on click for example)
    // ...
}