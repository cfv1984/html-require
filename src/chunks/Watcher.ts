type LinkList = Array<HTMLLinkElement>;

type XHROptions = {
  json?: boolean;
};

const _ = require('./util/DOM');
const $ = _.DOM.$;

export default class Watcher
{
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
    return $('[data-import]',true).filter(n => !n.hasAttribute('data-import-resolved'));
  }


  private _loadLink(link:HTMLLinkElement){
    const path = link.getAttribute('data-import');
    this.getRemote(path).then(
      ok => {
        var doc = this._getDocumentFor(ok);
        doc["watcher"] = new Watcher(doc);
        doc["watcher"].monitor();
        link["data-imported"] = doc;
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
      var request = new XMLHttpRequest();
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

  private _getDocumentFor(imported): DocumentFragment
  {
    var df = document.createDocumentFragment();
    var parent = document.createElement('import');
    parent["id"] = 'import-' + Date.now()+ Math.ceil(Math.random()*1024)+ Math.ceil(Math.random()*1024)+ Math.ceil(Math.random()*1024);
    df.appendChild(parent);
    parent.innerHTML = imported;
    return df;
  }

  public informLoaded(link){
    var evt = new CustomEvent('importResolved', {
      detail: link
    });
    document.documentElement.dispatchEvent(evt);
  }

  private _onImportResolved = function(evt)
  {
    const imported = evt.detail;
    const DOM      = imported["data-imported"];
    const scripts  = DOM.querySelectorAll('script');
    const styles   = document.querySelector('link[rel="stylesheet"]');
    imported.parentNode.replaceChild(DOM, imported);

    _.toArray(styles).forEach(l=>document.head.appendChild(l));
    _.toArray(scripts).forEach(this._moveScriptTag);
  };

  private _moveScriptTag = (script) =>
  {
    var g  = document.createElement('script');
    var s  = document.getElementsByTagName('script')[0];
    g.text = script.innerHTML;
    s.parentNode.insertBefore(g, s);
  };

}
