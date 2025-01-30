# Can I add a special font for a language?

Some languages require custom fonts to be displayed correctly.  To have those fonts displayed correctly, you need to install the font, and add some custom CSS to ensure that the font is used for the language that needs it.

## 1. Download and install the font needed.

Install them as you would normally do.

## 2. Get the id of the language that will use the font.

Go to Settings > Languages, and click on the language.  The language ID will be at the end of the URL, e.g. `localhost:5001/language/edit/2`

## 3. Add a custom style to tell the language to use the font.

In Settings > Settings > Custom Styles, paste the following, changing the language id and the name of the font:

```
span.textitem[data-lang-id="X"]{ font-family:"X"; }
```

For example:

```
span.textitem[data-lang-id="46"]{ font-family:"Mongolian Writing Regular"; }
```

With this, the font will only by applied to that particular language.

You may also want to change the size of the font:

```
span.textitem[data-lang-id="46"]{ font-size: 25px; }
```