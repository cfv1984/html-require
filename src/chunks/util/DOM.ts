export = {
  $: findBySelector
};

function findBySelector(sel:string, all?:boolean){
  var d = document;
  if(!all){
    return d.querySelector(sel);
  }
  return [].slice.call(d.querySelectorAll(sel))
}
