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
  }

  //
  // Private functions
  // ...

  //
  // Callback functions (on click for example)
  private onNewBoulderNewImageButtonClick() {
    (<any>navigator).camera.getPicture(function(imageData) {
      console.log('success');
      console.log(imageData);

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