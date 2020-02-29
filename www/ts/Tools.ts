type CallbackText = (text: string) => void;

class Tools {
  /**
   * Do a get request, and get the result as a string in a callback function.
   * @param url       The url/path to get.
   * @param callback  The function to call upon success.
   */
  public static get(url: string, callback: CallbackText) : void {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) 
      {
        if (this.status === 200) {
          callback(this.responseText);
        } else {
          console.log('Error: unable to GET "' + url + '"');
        }
      }
    }
    xhttp.open('GET', url, true);
    xhttp.send();
  }
}