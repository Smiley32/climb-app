declare var doT: any;
declare var Camera: any;
declare var SidebarJS: any;

type PageFunction = (struct: any) => string;

class Loader {
// private
  _loadedPages: Page[] = [];
  _pageFunctions: PageFunction[] = [];
  _sidebarjs = null;

  constructor() {
    // ...
  }

  static _instance: Loader = null;

// public
  static PAGE_HOME: string = 'home.html';
  static PAGE_HALLS: string = 'halls.html';
  static PAGE_BOULDERS: string = 'boulders.html';
  static PAGE_NEW_BOULDER: string = 'newBoulder.html';

  static PATH_TEMPLATES: string = 'templates/';

  fctMessageTemplate = null;
  fctNavigationTemplate = null;


// private
  /**
   * Create the correct page object corresponding to the given page string.
   * @param page  The string representing the page. All supported strings are declared in Loader.
   * @returns     An object extended from Page, or null if it failed.
   */
  private _createPageObject(page: string) : Page {
    switch(page) {
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
  }

// public

  public static getInstance() : Loader {
    if (null === Loader._instance) {
      Loader._instance = new Loader();
    }
    return Loader._instance;
  }

  public Initialize(callback: Function) {
    let that: Loader = this;
    let finishedCount: number = 0;

    finishedCount++;
    Tools.get(Loader.PATH_TEMPLATES + 'message.html', function(text) {
      that.fctMessageTemplate = doT.template(text);

      if (--finishedCount === 0) {
        callback();
      }
    });

    finishedCount++;
    Tools.get(Loader.PATH_TEMPLATES + 'navigation.html', function(text) {
      that.fctNavigationTemplate = doT.template(text);

      if (--finishedCount === 0) {
        callback();
      }
    });
    
    finishedCount++;
    Tools.get(Loader.PATH_TEMPLATES + Loader.PAGE_HOME, function(text) {
      that._pageFunctions[Loader.PAGE_HOME] = doT.template(text);

      if (--finishedCount === 0) {
        callback();
      }
    });

    finishedCount++;
    Tools.get(Loader.PATH_TEMPLATES + Loader.PAGE_HALLS, function(text) {
      that._pageFunctions[Loader.PAGE_HALLS] = doT.template(text);

      if (--finishedCount === 0) {
        callback();
      }
    });

    finishedCount++;
    Tools.get(Loader.PATH_TEMPLATES + Loader.PAGE_BOULDERS, function(text) {
      that._pageFunctions[Loader.PAGE_BOULDERS] = doT.template(text);

      if (--finishedCount === 0) {
        callback();
      }
    });

    finishedCount++;
    Tools.get(Loader.PATH_TEMPLATES + Loader.PAGE_NEW_BOULDER, function(text) {
      that._pageFunctions[Loader.PAGE_NEW_BOULDER] = doT.template(text);

      if (--finishedCount === 0) {
        callback();
      }
    });
  }

  /**
   * Get the current (displayed) page.
   * @returns An object extened from Page.
   */
  public getCurrent() : Page {
    return this._loadedPages[this._loadedPages.length - 1];
  }

  private onMenuOpen() {
    console.log('Opened...');
  }

  private onMenuClose() {
    console.log('Closed...');
  }

  public changeNav(enableBack: boolean, enableMenu: boolean, title: string = '') {
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

      let that = this;
      document.getElementById('NavigationMenuButton').addEventListener('click', function() {
        that._sidebarjs.toggle();
      });
    }
  }

  /**
   * Load a page, to replace the current one. The current page isn't destroyed and stays in the stack.
   * @param page    The string representing the page to load (declared in Loader).
   * @param params  Optional parameters to send to the 'create' function of the page.
   */
  public load(page: string, params: any) {
    this.changeNav(params['backNavButton'] === true, !(params['menuNavButton'] === false), params['nameNavText'] === undefined ? '' : params['nameNavText']);

    let animationElmt = document.getElementById('animation');
    animationElmt.classList.remove('removed');
    animationElmt.classList.add('show');
    let that = this;

    setTimeout(function () {
      let fct: PageFunction = that._pageFunctions[page];
      if (undefined === fct) {
        console.log('Error: The page "' + page + '" was not found.');
        return;
      }

      let previousPage: Page = that.getCurrent();
      if (previousPage) {
        previousPage.leave();
      }

      let pageObject = that._createPageObject(page);
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

  }

  /**
   * Unload the current page, and load the previous page.
   */
  public unload() {
    let previousPage: Page = this._loadedPages.pop();
    previousPage.leave();
    previousPage.destroy();

    let currentPage = this.getCurrent();
    if (currentPage) {
      currentPage.enter();
    }
  }
}