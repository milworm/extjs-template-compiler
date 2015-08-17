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

Ext.define("B", {
    config: {
        tpl: Ext.create("Ext.XTemplate", 
            "<h1 class='hello'></h1>",
            "<div class='{[ this.getClass() ]}'></div>", {
                compiled: true,
                getClass: function() {
                    return "it works";
                }
            }
        )
    }
});