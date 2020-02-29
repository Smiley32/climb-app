type CallbackText = (text: string) => void;

class Tools {
  /**
   * Send a get request, and get the result as a string in a callback function.
   * @param url       The url/path to get.
   * @param callback  The function to call upon success.
   */
  public static get(url: string, callback: CallbackText) : void {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) 
      {
        if (this.status === 200) {
          if (undefined != callback) {
            callback(this.responseText);
          }
        } else {
          console.log('Error: unable to GET "' + url + '"');
        }
      }
    }
    xhttp.open('GET', url, true);
    xhttp.send();
  }

  /**
   * Send a post request, and get the result as a string in a callback function.
   * @param url       The url to send to.
   * @param object    A (json) object to send (not a string).
   * @param callback  The function to call upon success.
   */
  public static post(url: string, object: any, callback: CallbackText) {
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = function() {
      if(this.readyState == 4) {
        if (this.status == 200) {
          if(null != callback && undefined != callback) {
            callback(this.responseText);
          }
        } else {
          console.log('Error: unable to POST "' + url + '"');
        }
      }
    };

    let data: string = JSON.stringify(object);
    xhttp.send(data);
  }
}