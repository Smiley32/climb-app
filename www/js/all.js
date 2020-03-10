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
        this.fctMessageTemplate = null;
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
    /**
     * Load a page, to replace the current one. The current page isn't destroyed and stays in the stack.
     * @param page    The string representing the page to load (declared in Loader).
     * @param params  Optional parameters to send to the 'create' function of the page.
     */
    Loader.prototype.load = function (page, params) {
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
    Tools.post = function (url, object, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', url, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    if (null != callback && undefined != callback) {
                        callback(this.responseText);
                    }
                }
                else {
                    console.log('Error: unable to POST "' + url + '"');
                }
            }
        };
        var data = JSON.stringify(object);
        xhttp.send(data);
    };
    Tools.SERVER_BASE_URL = 'http://192.168.1.96/climb/api/';
    return Tools;
}());
function main() {
    var loader = Loader.getInstance();
    loader.Initialize(function () {
        console.log('Loader initialized!');
        loader.load(Loader.PAGE_HOME, {
            test: 'Smiley32'
        });
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
        console.log(params.test);
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
        Tools.get(Tools.SERVER_BASE_URL + 'get/boulder?hall_id=1&search=', function (text) {
            console.log('GET: ' + text);
            var parsed = JSON.parse(text);
            if (!parsed) {
                console.log('Error trying to get boulders from the database');
            }
            else {
                var html = '';
                for (var i = 0; i < parsed.length; i++) {
                    html += that._fctBoulderCard({
                        'description': parsed[i]['description'],
                        'difficulty': parsed[i]['difficulty'],
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
                        elmt.addEventListener('click', that.onCardHallClick.bind(that, parsed['id']));
                    }
                    else {
                        console.log('Unable to set an event');
                    }
                }
            }
        });
    };
    Halls.prototype.onCardHallClick = function (id) {
        Loader.getInstance().load(Loader.PAGE_BOULDERS, {
            'hall_id': id
        });
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
        var html = Loader.getInstance().fctMessageTemplate({
            'type': 'danger',
            'message': 'Un premier test d\'erreur'
        });
        document.getElementById('HomeMessageContainer').innerHTML = html;
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
    };
    //
    // Private functions
    // ...
    //
    // Callback functions (on click for example)
    NewBoulder.prototype.onNewBoulderNewImageButtonClick = function () {
        navigator.camera.getPicture(function (imageData) {
            console.log('success');
            console.log(imageData);
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
