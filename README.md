# HTML require

A little library to let you require markup, styles and scripts from the browser,
with the least possible cognitive load

## Usage

Grab ``dist/html-require.min.js`` and put it on a page. Once loaded, it will find
any nodes with a ``[data-import]`` attribute and try to load the markup they
represent in the place their 'includer' was.

## Building

Clone this, run ``npm install`` or ``yarn``, then ``npm run build`` or ``yarn build``.

Any help is most appreciated!
