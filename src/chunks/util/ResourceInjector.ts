var rando = () => Math.ceil(Math.random()*1024);

export default class ResourceInjector
{

  public loadMarkup(loaded, path): Document|DocumentFragment
  {
    var doc = this._getDocumentFor(loaded, path);
    return doc;
  }

  public loadJS(script):HTMLScriptElement
  {
    var g  = document.createElement('script');
    var s  = document.getElementsByTagName('script')[0];
    g.text = script;

    return g;
  }

  public loadCSS(css): HTMLStyleElement
  {
    var style = document.createElement('style');
    style.type = "text/css";
    if (style["styleSheet"]){
      style["styleSheet"]["cssText"] = css;
    }
    else {
      style.appendChild(document.createTextNode(css));
    }

    return style;
  }


  private _getDocumentFor(imported, url?:string): DocumentFragment
  {
    const df     = document.createDocumentFragment();
    const parent = document.createElement('import');
    parent["id"] = 'import-' + Date.now()+ rando() + rando() + rando();
    if(url){
      parent.setAttribute('import-url', url);
    }
    df.appendChild(parent);
    parent.innerHTML = imported;
    return df;
  }


}
