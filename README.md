# extjs-template-compiler


Simple console app, that finds all places where you create an Ext.XTemplate or Ext.Template and compiles them.
---
cj-tpl in-file out-file
cj-tpl app.js result.app.js
---

*Your source code:*
```javascript
Ext.define("Class1", {
    config: {
        tpl: Ext.create("Ext.Template", "<div class='example'></div>")
    } 
});
```

*Resulting source code:*
```javascript
Ext.define("Class1", {
    config: {
        tpl: function() {
            var tpl = Ext.create("Ext.Template", "<div class='example'></div>");
            tpl.compiled = function (values){return ['<div class=\'example\'></div>'];};
            return tpl;
        }()
    } 
});
```