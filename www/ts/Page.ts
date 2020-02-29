abstract class Page {
  /**
   * Mount the given html in the page (and replace the existing code).
   * @param html The html code that must be included in the page.
   */
  protected mount(html: string) {
    document.getElementById('mountpoint').innerHTML = html;
  }

  public abstract getType() : string;

  public abstract create(templateFunction: PageFunction, params: any) : void;
  public abstract destroy() : void;

  public abstract enter() : void;
  public abstract leave() : void;
}