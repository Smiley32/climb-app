abstract class Page {
  public abstract getType() : string;

  public abstract create(templateFunction: PageFunction, params: any) : void;
  public abstract destroy() : void;

  public abstract enter() : void;
  public abstract leave() : void;
}