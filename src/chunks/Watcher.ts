import PathTypeSniffer  from "./util/PathTypeSniffer";
import ResourceInjector from "./util/ResourceInjector";

type LinkList = Array<HTMLLinkElement>;
type XHROptions = { json?: boolean };
type FunctionBag = {[name:string]: (...args:any[]) => any};

var slice = [].slice;

export default class Watcher
{
  static fn: FunctionBag = {
    ["responseLoader"]:  null
  };

  private _injector = new ResourceInjector();

  constructor(public root:Node, private _resolved:LinkList = [])
  {
    if(!document.documentElement["import-listener"]){
      document.documentElement["import-listener"] = this._onImportResolved;
      document.documentElement.addEventListener('importResolved', document.documentElement["import-listener"]);
    }
  }

  public monitor = () =>
  {
    this._getUnresolvedLinks().forEach(n => this._loadLink(n));
    requestAnimationFrame(this.monitor);
  };

  private _getUnresolvedLinks(){
    return slice.call(document.querySelectorAll('[data-import]')).filter(n => !n.hasAttribute('data-import-resolved'));
  }

  private _loadLink(link:HTMLLinkElement){
    const path = link.getAttribute('data-import');
    this.getRemote(path).then(
      ok => {
        let fn = this._loadResponse;
        if(Watcher.fn["responseLoader"]){
          fn = Watcher.fn["responseLoader"];
        }

        link["data-imported"] = fn.call(this, path, ok);

        this.informLoaded(link);
      },
      error => {
        console.error("XHR failed.", error)
      }
    )
    this._markLoaded(link); //mark it loaded inmediately, load it asynchronously
  }

  private _markLoaded(link: HTMLLinkElement)
  {
    link.setAttribute('data-import-resolved','data-import-resolved');
  }

  private getRemote(url, options?: XHROptions): Promise<string|Object>
  {
    options = options || {};
    return new Promise<string|Object>((ok:GenericPromiseHandler, fail:GenericPromiseHandler) =>
    {
      let request = new XMLHttpRequest();
      request.open('GET', url, true);

      request.onreadystatechange = function()
      {
        if (this.readyState === 4)
        {
          if (this.status >= 200 && this.status < 400)
          {
            data = this.responseText;
            if(options.json){ var data = JSON.parse(this.responseText) }
            ok(data);
          }
          else { fail(this) }
        }
      };

      request.send();
      request = null;
    });
  }

  public informLoaded(link){
    const evt = new CustomEvent('importResolved', {
      detail: link
    });
    document.documentElement.dispatchEvent(evt);
  }

  private _onImportResolved = (evt) =>
  {
    const imported = evt.detail;
    const DOM      = imported["data-imported"];
    const scripts  = DOM.querySelectorAll('script');
    const styles   = document.querySelector('link[rel="stylesheet"], style');
    imported.parentNode.replaceChild(DOM, imported);

    slice.call(styles).forEach(l=>document.head.appendChild(l));
    [].slice.call(scripts).forEach(this._moveScriptTag);
  };

  private _loadResponse(path, response)
  {
    const type = PathTypeSniffer.getType(path);
    if(type === 'html'){
      return this._injector.loadMarkup(response);
    }
    if(type === 'js'){
      return this._injector.loadJS(response);
    }
    if(type === 'css'){
      return this._injector.loadCSS(response);
    }
  }

  private _moveScriptTag = (script) =>
  {
    var g  = document.createElement('script');
    var s  = document.getElementsByTagName('script')[0];
    g.text = script.innerHTML;
    s.parentNode.insertBefore(g, s);
    script.parentNode && script.parentNode.removeChild(script);
  };

}
