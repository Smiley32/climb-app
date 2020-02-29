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
        Tools.get(Loader.PATH_TEMPLATES + Loader.PAGE_HOME, function (text) {
            that._pageFunctions[Loader.PAGE_HOME] = doT.template(text);
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
        var fct = this._pageFunctions[page];
        if (undefined === fct) {
            console.log('Error: The page "' + page + ' was not found."');
            return;
        }
        var previousPage = this.getCurrent();
        if (previousPage) {
            previousPage.leave();
        }
        var pageObject = this._createPageObject(page);
        if (null === pageObject) {
            console.log('Error: this page isn\'t supported');
            return;
        }
        this._loadedPages.push(pageObject);
        pageObject.create(fct, params);
        pageObject.enter();
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
    Loader.PATH_TEMPLATES = 'templates/';
    return Loader;
}());
var Page = /** @class */ (function () {
    function Page() {
    }
    return Page;
}());
var Tools = /** @class */ (function () {
    function Tools() {
    }
    /**
     * Do a get request, and get the result as a string in a callback function.
     * @param url       The url/path to get.
     * @param callback  The function to call upon success.
     */
    Tools.get = function (url, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    callback(this.responseText);
                }
                else {
                    console.log('Error: unable to GET "' + url + '"');
                }
            }
        };
        xhttp.open('GET', url, true);
        xhttp.send();
    };
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
        console.log(fct(params));
    };
    Home.prototype.destroy = function () {
        // ...
    };
    Home.prototype.enter = function () {
        // ...
    };
    Home.prototype.leave = function () {
        // ...
    };
    Home.TYPE_PAGE_HOME = 'PAGE_HOME';
    return Home;
}(Page));
