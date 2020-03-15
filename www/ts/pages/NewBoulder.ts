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
    document.getElementById('NewBoulderNewImageButton').addEventListener('click', this.onNewBoulderNewImageButtonClick.bind(this));
    document.getElementById('NewBoulderAddButton').addEventListener('click', this.onNewBoulderAddButtonClick.bind(this));

  }

  //
  // Private functions
  // ...

  //
  // Callback functions (on click for example)

  private onNewBoulderAddButtonClick() {
    // Get the data from the fields
    let description: string = (<HTMLInputElement>document.getElementById('NewBoulderDescriptionInput')).value;
    let difficulty: string = (<HTMLInputElement>document.getElementById('NewBoulderDifficultyInput')).value;

    if (!description || !difficulty) {
      Tools.displayError('Un champ n\'est pas rempli');
      return;
    }

    let imageData = (<HTMLImageElement>document.getElementById('NewBoulderImage')).src;
    if (!imageData) {
      Tools.displayError('Vous devez ajouter une image du bloc');
      return;
    }

    let token = Tools.getToken();
    // TODO: check token null
    let hall = Tools.getHall();

    // Send post request to upload the image and send the data to the server
    // The picture should be already compressed+reduced enough to be send in one single request
    Tools.post(Tools.SERVER_BASE_URL + 'post/boulder', {
      'imageData': imageData,
      'description': description,
      'difficulty': difficulty,
      'hall_id': hall
    }, function(data) {
      // Success
      let parsed = JSON.parse(data);
      if (parsed.error === 0) {
        // We can move to the previous page
        Loader.getInstance().unload();
      }
    }, function(data) {
      // Errror
      let parsed = JSON.parse(data);
      // TODO: check if it was a token error. If it's the case, we should ask the user to enter its password
      Tools.displayError(parsed.message);
    });
  }

  private onNewBoulderNewImageButtonClick() {
    (<any>navigator).camera.getPicture(function(imageData) {
      // console.log('success');
      // console.log(imageData);

      (<HTMLImageElement>document.getElementById('NewBoulderImage')).src = 'data:image/jpeg;base64,' + imageData;



    }, function(message) {
      console.log('error');
      console.log(message);
    }, {
      // destinationType: Camera.DestinationType.FILE_URI,
      destinationType: Camera.DestinationType.DATA_URL,
      quality: 70,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 1000,
      mediaType: Camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      cameraDirection: Camera.Direction.BACK
    });
  }
}