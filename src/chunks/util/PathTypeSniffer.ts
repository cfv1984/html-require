export default class PathTypeSniffer
{
  public static getType(path): string
  {
    let ext = path.split(/\./).pop();
    return ext? ext : 'html';
  }
}
