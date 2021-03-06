var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Loader = /** @class */ (function () {
    function Loader() {
        // private
        this._loadedPages = [];
        this._pageFunctions = [];
        this._sidebarjs = null;
        this.fctMessageTemplate = null;
        this.fctNavigationTemplate = null;
        // ...
    }
    // private
    /**
     * Create the correct page object corresponding to the given page string.
     * @param page  The string representing the page. All supported strings are declared in Loader.
     * @returns     An object extended from Page, or null if it failed.
     */
    Loader.prototype._createPageObject = function (page) {
        switch (page) {
            case Loader.PAGE_HOME:
                {
                    return new Home();
                }
                break;
            case Loader.PAGE_HALLS:
                {
                    return new Halls();
                }
                break;
            case Loader.PAGE_BOULDERS:
                {
                    return new Boulders();
                }
                break;
            case Loader.PAGE_NEW_BOULDER:
                {
                    return new NewBoulder();
                }
                break;
            default:
                {
                    return null;
                }
                break;
        }
    };
    // public
    Loader.getInstance = function () {
        if (null === Loader._instance) {
            Loader._instance = new Loader();
        }
        return Loader._instance;
    };
    Loader.prototype.Initialize = function (callback) {
        var that = this;
        var finishedCount = 0;
        finishedCount++;
        Tools.get(Loader.PATH_TEMPLATES + 'message.html', function (text) {
            that.fctMessageTemplate = doT.template(text);
            if (--finishedCount === 0) {
                callback();
            }
        });
        finishedCount++;
        Tools.get(Loader.PATH_TEMPLATES + 'navigation.html', function (text) {
            that.fctNavigationTemplate = doT.template(text);
            if (--finishedCount === 0) {
                callback();
            }
        });
        finishedCount++;
        Tools.get(Loader.PATH_TEMPLATES + Loader.PAGE_HOME, function (text) {
            that._pageFunctions[Loader.PAGE_HOME] = doT.template(text);
            if (--finishedCount === 0) {
                callback();
            }
        });
        finishedCount++;
        Tools.get(Loader.PATH_TEMPLATES + Loader.PAGE_HALLS, function (text) {
            that._pageFunctions[Loader.PAGE_HALLS] = doT.template(text);
            if (--finishedCount === 0) {
                callback();
            }
        });
        finishedCount++;
        Tools.get(Loader.PATH_TEMPLATES + Loader.PAGE_BOULDERS, function (text) {
            that._pageFunctions[Loader.PAGE_BOULDERS] = doT.template(text);
            if (--finishedCount === 0) {
                callback();
            }
        });
        finishedCount++;
        Tools.get(Loader.PATH_TEMPLATES + Loader.PAGE_NEW_BOULDER, function (text) {
            that._pageFunctions[Loader.PAGE_NEW_BOULDER] = doT.template(text);
            if (--finishedCount === 0) {
                callback();
            }
        });
    };
    /**
     * Get the current (displayed) page.
     * @returns An object extened from Page.
     */
    Loader.prototype.getCurrent = function () {
        return this._loadedPages[this._loadedPages.length - 1];
    };
    Loader.prototype.onMenuOpen = function () {
        console.log('Opened...');
    };
    Loader.prototype.onMenuClose = function () {
        console.log('Closed...');
    };
    Loader.prototype.changeNav = function (enableBack, enableMenu, title) {
        if (title === void 0) { title = ''; }
        // We replace the nav by a new nav, updated with the given parameters.
        document.getElementById('IndexNavContainer').innerHTML = this.fctNavigationTemplate({
            'back': enableBack,
            'menu': enableMenu,
            'name': title
        });
        if (enableMenu) {
            this._sidebarjs = new SidebarJS.SidebarElement({
                // component: <HTMLElement>document.getElementById('sidebarjs'),
                documentMinSwipeX: 10,
                documentSwipeRange: 40,
                nativeSwipe: true,
                nativeSwipeOpen: true,
                position: 'left',
                backdropOpacity: 0.3,
                responsive: false,
                onOpen: this.onMenuOpen,
                onClose: this.onMenuClose
            });
            var that_1 = this;
            document.getElementById('NavigationMenuButton').addEventListener('click', function () {
                that_1._sidebarjs.toggle();
            });
        }
    };
    /**
     * Load a page, to replace the current one. The current page isn't destroyed and stays in the stack.
     * @param page    The string representing the page to load (declared in Loader).
     * @param params  Optional parameters to send to the 'create' function of the page.
     */
    Loader.prototype.load = function (page, params) {
        this.changeNav(params['backNavButton'] === true, !(params['menuNavButton'] === false), params['nameNavText'] === undefined ? '' : params['nameNavText']);
        var animationElmt = document.getElementById('animation');
        animationElmt.classList.remove('removed');
        animationElmt.classList.add('show');
        var that = this;
        setTimeout(function () {
            var fct = that._pageFunctions[page];
            if (undefined === fct) {
                console.log('Error: The page "' + page + '" was not found.');
                return;
            }
            var previousPage = that.getCurrent();
            if (previousPage) {
                previousPage.leave();
            }
            var pageObject = that._createPageObject(page);
            if (null === pageObject) {
                console.log('Error: this page isn\'t supported');
                return;
            }
            that._loadedPages.push(pageObject);
            pageObject.create(fct, params);
            animationElmt.classList.remove('show');
            setTimeout(function () {
                animationElmt.classList.add('removed');
                pageObject.enter();
            }, 500);
        }, 500);
    };
    /**
     * Unload the current page, and load the previous page.
     */
    Loader.prototype.unload = function () {
        var previousPage = this._loadedPages.pop();
        previousPage.leave();
        previousPage.destroy();
        var currentPage = this.getCurrent();
        if (currentPage) {
            currentPage.enter();
        }
    };
    Loader._instance = null;
    // public
    Loader.PAGE_HOME = 'home.html';
    Loader.PAGE_HALLS = 'halls.html';
    Loader.PAGE_BOULDERS = 'boulders.html';
    Loader.PAGE_NEW_BOULDER = 'newBoulder.html';
    Loader.PATH_TEMPLATES = 'templates/';
    return Loader;
}());
var Page = /** @class */ (function () {
    function Page() {
    }
    /**
     * Mount the given html in the page (and replace the existing code).
     * @param html The html code that must be included in the page.
     */
    Page.prototype.mount = function (html) {
        document.getElementById('mountpoint').innerHTML = html;
        this.connect();
    };
    return Page;
}());
var Tools = /** @class */ (function () {
    function Tools() {
    }
    /**
     * Send a get request, and get the result as a string in a callback function.
     * @param url       The url/path to get.
     * @param callback  The function to call upon success.
     */
    Tools.get = function (url, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    if (undefined != callback) {
                        callback(this.responseText);
                    }
                }
                else {
                    console.log('Error: unable to GET "' + url + '"');
                }
            }
        };
        xhttp.open('GET', url, true);
        xhttp.send();
    };
    /**
     * Send a post request, and get the result as a string in a callback function.
     * @param url       The url to send to.
     * @param object    A (json) object to send (not a string).
     * @param callback  The function to call upon success.
     */
    Tools.post = function (url, object, callback, errorCallback, authorization) {
        if (errorCallback === void 0) { errorCallback = null; }
        if (authorization === void 0) { authorization = true; }
        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', url, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        if (authorization) {
            var token = Tools.getToken();
            if (null !== token) {
                xhttp.setRequestHeader('Authorization', token);
            }
        }
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    if (null !== callback && undefined !== callback) {
                        callback(this.responseText);
                    }
                }
                else {
                    if (errorCallback) {
                        errorCallback(this.responseText);
                    }
                }
            }
        };
        var data = JSON.stringify(object);
        xhttp.send(data);
    };
    /**
     * Store the given token in the localStorage. If one is already stored, it will be replaced.
     * @param token The token to store.
     */
    Tools.setToken = function (token) {
        localStorage.setItem('token', token);
    };
    /**
     * Get the token stored in the localStorage, if one is here.
     * @return The stored token, null if none.
     */
    Tools.getToken = function () {
        return localStorage.getItem('token');
    };
    /**
     * Store a hall id in the localStorage.
     * @param hall The value of the hall (its id).
     */
    Tools.setHall = function (hall) {
        localStorage.setItem('hall', hall);
    };
    /**
     * Get a hall id from the localStorage.
     * @return The id of the hall, null if none is storred.
     */
    Tools.getHall = function () {
        return localStorage.getItem('hall');
    };
    /**
     * Displays an error message on top of the page.
     * @param message The message to display.
     */
    Tools.displayError = function (message) {
        var html = Loader.getInstance().fctMessageTemplate({
            'type': 'danger',
            'message': message
        });
        document.getElementById('HomeMessageContainer').innerHTML = html;
    };
    /**
     * Convert a grade given by the server to a french/fontainebleau notation
     * (7a+ / 5+ / 6b ...)
     * @param value The converted value
     */
    Tools.gradeValueToFrench = function (value) {
        var grade = '';
        if (value <= 25) {
            grade = '4';
            if (value > 15) {
                grade += '+';
            }
        }
        else if (value <= 45) {
            grade = '5';
            if (value > 35) {
                grade += '+';
            }
        }
        else if (value <= 105) {
            grade = '6';
            if (value <= 65) {
                grade += 'a';
                if (value > 55) {
                    grade += '+';
                }
            }
            else if (value <= 85) {
                grade += 'b';
                if (value > 75) {
                    grade += '+';
                }
            }
            else {
                grade += 'c';
                if (value > 95) {
                    grade += '+';
                }
            }
        }
        else if (value <= 165) {
            grade = '7';
            if (value <= 125) {
                grade += 'a';
                if (value > 115) {
                    grade += '+';
                }
            }
            else if (value <= 145) {
                grade += 'b';
                if (value > 135) {
                    grade += '+';
                }
            }
            else {
                grade += 'c';
                if (value > 155) {
                    grade += '+';
                }
            }
        }
        else if (value <= 225) {
            grade = '8';
            if (value <= 185) {
                grade += 'a';
                if (value > 175) {
                    grade += '+';
                }
            }
            else if (value <= 205) {
                grade += 'b';
                if (value > 195) {
                    grade += '+';
                }
            }
            else {
                grade += 'c';
                if (value > 215) {
                    grade += '+';
                }
            }
        }
        else {
            grade = '9';
            if (value <= 245) {
                grade += 'a';
                if (value > 235) {
                    grade += '+';
                }
            }
            else if (value <= 265) {
                grade += 'b';
                if (value > 255) {
                    grade += '+';
                }
            }
            else {
                grade += 'c';
                if (value > 275) {
                    grade += '+';
                }
            }
        }
        return grade;
    };
    Tools.SERVER_BASE_URL = 'http://192.168.1.96/climb/api/';
    return Tools;
}());
function main() {
    var loader = Loader.getInstance();
    loader.Initialize(function () {
        console.log('Loader initialized!');
        if (null == Tools.getToken()) {
            // The user isn't connected, we ask him
            loader.load(Loader.PAGE_HOME, {
                'nameNavText': 'Login'
            });
        }
        else {
            // The user is already connected, we can skip the first page
            if (null == Tools.getHall()) {
                // If there isn't any hall defined, we load the page to choose one
                Loader.getInstance().load(Loader.PAGE_HALLS, {});
            }
            else {
                // A hall is stored, we can load the boulder page.
                // The user can then choose to change hall
                Loader.getInstance().load(Loader.PAGE_BOULDERS, {});
            }
        }
    });
}
document.addEventListener('deviceready', main);
var Boulders = /** @class */ (function (_super) {
    __extends(Boulders, _super);
    function Boulders() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._fctBoulderCard = null;
        return _this;
    }
    Boulders.prototype.getType = function () {
        return Boulders.TYPE_PAGE_BOULDERS;
    };
    Boulders.prototype.create = function (fct, params) {
        var that = this;
        Tools.get(Loader.PATH_TEMPLATES + 'cardBoulder.html', function (text) {
            that._fctBoulderCard = doT.template(text);
        });
        this.mount(fct(params));
        this.getBoulders();
    };
    Boulders.prototype.destroy = function () {
        // ...
    };
    Boulders.prototype.enter = function () {
        // ...
    };
    Boulders.prototype.leave = function () {
        // ...
    };
    //
    // Connect events
    Boulders.prototype.connect = function () {
        console.log('test');
        console.log(this);
        document.getElementById('BouldersAddButton').addEventListener('click', this.onNewBoulderButtonClick.bind(this));
    };
    //
    // Private functions
    Boulders.prototype.getBoulders = function () {
        var that = this;
        var hallId = Tools.getHall();
        if (null == hallId) {
            console.log('Error, no hall choosen');
            return;
        }
        Tools.get(Tools.SERVER_BASE_URL + 'get/boulder?hall_id=' + hallId + '&search=', function (text) {
            console.log('GET: ' + text);
            var parsed = JSON.parse(text);
            if (!parsed) {
                console.log('Error trying to get boulders from the database');
            }
            else {
                var html = '';
                for (var i = 0; i < parsed.length; i++) {
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
    };
    //
    // Callback functions (on click for example)
    Boulders.prototype.onNewBoulderButtonClick = function () {
        Loader.getInstance().load(Loader.PAGE_NEW_BOULDER, {});
    };
    Boulders.TYPE_PAGE_BOULDERS = 'PAGE_BOULDERS';
    return Boulders;
}(Page));
var Halls = /** @class */ (function (_super) {
    __extends(Halls, _super);
    function Halls() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._fctHallCard = null;
        return _this;
    }
    Halls.prototype.getType = function () {
        return Halls.TYPE_PAGE_HALLS;
    };
    Halls.prototype.create = function (fct, params) {
        console.log(params.test);
        var that = this;
        Tools.get(Loader.PATH_TEMPLATES + 'cardHall.html', function (text) {
            that._fctHallCard = doT.template(text);
        });
        this.mount(fct(params));
    };
    Halls.prototype.destroy = function () {
        // ...
    };
    Halls.prototype.enter = function () {
        // ...
    };
    Halls.prototype.leave = function () {
        // ...
    };
    //
    // Connect events
    Halls.prototype.connect = function () {
        console.log('test');
        console.log(this);
        document.getElementById('HallsSearchButton').addEventListener('click', this.onSearchClick.bind(this));
    };
    //
    // Callback functions (on click for example)
    Halls.prototype.onSearchClick = function () {
        var search = document.getElementById('HallsSearchText').value;
        var that = this;
        Tools.get(Tools.SERVER_BASE_URL + 'get/hall?search=' + search, function (data) {
            console.log(data);
            var parsed = JSON.parse(data);
            if (null !== that._fctHallCard) {
                var html = '';
                for (var i = 0; i < parsed.length; i++) {
                    html += that._fctHallCard({
                        'id': parsed[i]['id'],
                        'name': parsed[i]['name'],
                        'city': parsed[i]['city'],
                        'htmlID': 'CardHall' + parsed[i]['id']
                    });
                }
                document.getElementById('HallsListContainer').innerHTML = html;
                for (var i = 0; i < parsed.length; i++) {
                    var elmt = document.getElementById('CardHall' + parsed[i]['id']);
                    if (elmt) {
                        elmt.addEventListener('click', that.onCardHallClick.bind(that, parsed[i]['id']));
                    }
                    else {
                        console.log('Unable to set an event');
                    }
                }
            }
        });
    };
    Halls.prototype.onCardHallClick = function (id) {
        Tools.setHall(id);
        Loader.getInstance().load(Loader.PAGE_BOULDERS, {});
    };
    Halls.TYPE_PAGE_HALLS = 'PAGE_HALLS';
    return Halls;
}(Page));
var Home = /** @class */ (function (_super) {
    __extends(Home, _super);
    function Home() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Home.prototype.getType = function () {
        return Home.TYPE_PAGE_HOME;
    };
    Home.prototype.create = function (fct, params) {
        console.log(params.test);
        this.mount(fct(params));
    };
    Home.prototype.destroy = function () {
        // ...
    };
    Home.prototype.enter = function () {
        // ...
    };
    Home.prototype.leave = function () {
        console.log('Left Home');
    };
    //
    // Connect events
    Home.prototype.connect = function () {
        console.log(this);
        document.getElementById('HomeConnectButton').addEventListener('click', this.onConnectClick.bind(this));
        document.getElementById('HomeIgnoreButton').addEventListener('click', this.onIgnoreClick.bind(this));
    };
    //
    // Callback functions (on click for example)
    Home.prototype.onConnectClick = function () {
        console.log('Try to connect');
        //
        // Get value from the fields
        var pseudo = document.getElementById("HomePseudoInput").value;
        var password = document.getElementById("HomePasswordInput").value;
        if (pseudo.length < 1 || password.length < 1) {
            Tools.displayError('Les champs ne sont pas remplis');
            return;
        }
        //
        // Send a request to the server
        var that = this;
        Tools.post(Tools.SERVER_BASE_URL + 'post/login', {
            'pseudo': pseudo,
            'password': password
        }, function (data) {
            console.log(data);
            var parsed = JSON.parse(data);
            if (parsed.error === 0) {
                // Success
                // We can store the token
                Tools.setToken(parsed.token);
                // We can load the next page.
                if (null == Tools.getHall()) {
                    // If there isn't any hall defined, we load the page to choose one
                    Loader.getInstance().load(Loader.PAGE_HALLS, {});
                }
                else {
                    // A hall is stored, we can load the boulder page.
                    // The user can then choose to change hall
                    Loader.getInstance().load(Loader.PAGE_BOULDERS, {});
                }
            }
        }, function (data) {
            // An error occurred.
            var parsed = JSON.parse(data);
            console.log(parsed.message);
            Tools.displayError(parsed.message);
        });
    };
    Home.prototype.onIgnoreClick = function () {
        console.log('Ignore connection');
        Loader.getInstance().load(Loader.PAGE_HALLS, {});
    };
    Home.TYPE_PAGE_HOME = 'PAGE_HOME';
    return Home;
}(Page));
var NewBoulder = /** @class */ (function (_super) {
    __extends(NewBoulder, _super);
    function NewBoulder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewBoulder.prototype.getType = function () {
        return NewBoulder.TYPE_PAGE_NEW_BOULDER;
    };
    NewBoulder.prototype.create = function (fct, params) {
        console.log(params.test);
        this.mount(fct(params));
    };
    NewBoulder.prototype.destroy = function () {
        // ...
    };
    NewBoulder.prototype.enter = function () {
        // ...
    };
    NewBoulder.prototype.leave = function () {
        // ...
    };
    //
    // Connect events
    NewBoulder.prototype.connect = function () {
        console.log('test');
        console.log(this);
        document.getElementById('NewBoulderNewImageButton').addEventListener('click', this.onNewBoulderNewImageButtonClick.bind(this));
        document.getElementById('NewBoulderAddButton').addEventListener('click', this.onNewBoulderAddButtonClick.bind(this));
    };
    //
    // Private functions
    // ...
    //
    // Callback functions (on click for example)
    NewBoulder.prototype.onNewBoulderAddButtonClick = function () {
        // Get the data from the fields
        var description = document.getElementById('NewBoulderDescriptionInput').value;
        var difficulty = document.getElementById('NewBoulderDifficultyInput').value;
        if (!description || !difficulty) {
            Tools.displayError('Un champ n\'est pas rempli');
            return;
        }
        var imageData = document.getElementById('NewBoulderImage').src;
        if (!imageData) {
            Tools.displayError('Vous devez ajouter une image du bloc');
            return;
        }
        var token = Tools.getToken();
        // TODO: check token null
        var hall = Tools.getHall();
        // Send post request to upload the image and send the data to the server
        // The picture should be already compressed+reduced enough to be send in one single request
        Tools.post(Tools.SERVER_BASE_URL + 'post/boulder', {
            'imageData': imageData,
            'description': description,
            'difficulty': difficulty,
            'hall_id': hall
        }, function (data) {
            // Success
            var parsed = JSON.parse(data);
            if (parsed.error === 0) {
                // We can move to the previous page
                Loader.getInstance().unload();
            }
        }, function (data) {
            // Errror
            var parsed = JSON.parse(data);
            // TODO: check if it was a token error. If it's the case, we should ask the user to enter its password
            Tools.displayError(parsed.message);
        });
    };
    NewBoulder.prototype.onNewBoulderNewImageButtonClick = function () {
        navigator.camera.getPicture(function (imageData) {
            // console.log('success');
            // console.log(imageData);
            document.getElementById('NewBoulderImage').src = 'data:image/jpeg;base64,' + imageData;
        }, function (message) {
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
    };
    NewBoulder.TYPE_PAGE_NEW_BOULDER = 'PAGE_NEW_BOULDER';
    return NewBoulder;
}(Page));
