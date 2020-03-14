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
   * @return The stored token, null if none.
   */
  public static getToken() : string {
    return localStorage.getItem('token');
  }

  /**
   * Store a hall id in the localStorage.
   * @param hall The value of the hall (its id).
   */
  public static setHall(hall) {
    localStorage.setItem('hall', hall);
  }

  /**
   * Get a hall id from the localStorage.
   * @return The id of the hall, null if none is storred.
   */
  public static getHall() {
    return localStorage.getItem('hall');
  }

  /**
   * Displays an error message on top of the page.
   * @param message The message to display.
   */
  public static displayError(message: string) {
    var html = Loader.getInstance().fctMessageTemplate({
      'type': 'danger',
      'message': message
    });
    document.getElementById('HomeMessageContainer').innerHTML = html;
  }

  /**
   * Convert a grade given by the server to a french/fontainebleau notation
   * (7a+ / 5+ / 6b ...)
   * @param value The converted value
   */
  public static gradeValueToFrench(value: number) : string {
    let grade: string = '';
    if (value <= 25) {
      grade = '4';
      if (value > 15) {
        grade += '+';
      }
    } else if (value <= 45) {
      grade = '5';
      if (value > 35) {
        grade += '+';
      }
    } else if (value <= 105) {
      grade = '6';
      if (value <= 65) {
        grade += 'a';
        if (value > 55) {
          grade += '+';
        }
      } else if (value <= 85) {
        grade += 'b';
        if (value > 75) {
          grade += '+';
        }
      } else {
        grade += 'c';
        if (value > 95) {
          grade += '+';
        }
      }
    } else if (value <= 165) {
      grade = '7';
      if (value <= 125) {
        grade += 'a';
        if (value > 115) {
          grade += '+';
        }
      } else if (value <= 145) {
        grade += 'b';
        if (value > 135) {
          grade += '+';
        }
      } else {
        grade += 'c';
        if (value > 155) {
          grade += '+';
        }
      }
    } else if (value <= 225) {
      grade = '8';
      if (value <= 185) {
        grade += 'a';
        if (value > 175) {
          grade += '+';
        }
      } else if (value <= 205) {
        grade += 'b';
        if (value > 195) {
          grade += '+';
        }
      } else {
        grade += 'c';
        if (value > 215) {
          grade += '+';
        }
      }
    } else {
      grade = '9';
      if (value <= 245) {
        grade += 'a';
        if (value > 235) {
          grade += '+';
        }
      } else if (value <= 265) {
        grade += 'b';
        if (value > 255) {
          grade += '+';
        }
      } else {
        grade += 'c';
        if (value > 275) {
          grade += '+';
        }
      }
    }
    return grade;
  }
}