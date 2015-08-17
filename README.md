# extjs-template-compiler


Simple console app, that finds all places where you create an Ext.XTemplate or Ext.Template and compiles them.
---
cj-tpl in-file out-file
cj-tpl app.js result.app.js
---

*Your source code:*
```javascript
Ext.define("A", {
    config: {
        tpl: Ext.create("Ext.XTemplate", 
            "<h1 class='a'></h1>",
            "<div class='{[ this.getClass() ]}'></div>", {
                getClass: function() {
                    return "hello";
                }
            }
        )
    }
});
```

*Resulting source code:*
```javascript
Ext.define('A', {
    config: {
        tpl: function () {
            var tpl = Ext.create('Ext.XTemplate', '<h1 class=\'a\'></h1>', '<div class=\'{[ this.getClass() ]}\'></div>', {
                getClass: function () {
                    return 'hello';
                }
            });
            tpl.fn = function (out, values, parent, xindex, xcount) {
                var c0 = values, a0 = Array.isArray(c0), p0 = parent, n0 = xcount, i0 = xindex, v;
                out.push('<h1 class=\'a\'></h1><div class=\'');
                v = this.getClass();
                if (v !== undefined && v !== null)
                    out.push(v + '');
                out.push('\'></div>');
            };
            return tpl;
        }()
    }
});
```