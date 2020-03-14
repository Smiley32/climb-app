type CallbackText = (text: string) => void;

class Tools {
  static SERVER_BASE_URL = 'http://192.168.1.96/climb/api/';

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
  public static post(url: string, object: any, callback: CallbackText, errorCallback: CallbackText = null) {
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
          if (errorCallback) {
            errorCallback(this.responseText);
          }
        }
      }
    };

    let data: string = JSON.stringify(object);
    xhttp.send(data);
  }

  /**
   * Store the given token in the localStorage. If one is already stored, it will be replaced.
   * @param token The token to store.
   */
  public static setToken(token: string) {
    localStorage.setItem('token', token);
  }

  /**
   * Get the token stored in the localStorage, if one is here.
   * @return The stored token, null if none
   */
  public static getToken() : string {
    return localStorage.getItem('token');
  }

  /**
   * Displays an error message on top of the page.
   * @param message The message to display
   */
  public static displayError(message: string) {
    var html = Loader.getInstance().fctMessageTemplate({
      'type': 'danger',
      'message': message
    });
    document.getElementById('HomeMessageContainer').innerHTML = html;
  }
}