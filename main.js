var esprima = require("esprima"),
    estraverse = require("estraverse"),
    escodegen = require("escodegen"),
    waterfall = require("async-waterfall"),
    fs = require("fs");

require("node-extjs4");
require("./extjs");

var Application = {
    init: function(content) {
        this.ast = esprima.parse(content, {
            loc: true
        });
    },

    run: function() {
        var ast = this.getAst();

        // collect private methods
        estraverse.traverse(ast, {
            enter: this.onNodeEnter.bind(this)
        });
    },

    isProcessable: function(node) {
        if(node.type == "CallExpression") {
            if(node.arguments.length > 0) {
                if(["Ext.XTemplate"/*, "Ext.Template"*/].indexOf(node.arguments[0].value) > -1) {
                    return true;
                }
            }
        }
    },

    onNodeEnter: function(node, parent) {
        if(! this.isProcessable(node))
            return ;

        var args,
            tpl;

        args = node.arguments.map(function(item) {
            if(item.type == "Literal")
                return item.value;

            return eval("var a = " + escodegen.generate(item));
        });

        // args.shift();
        // args.unshift("Ext.XTemplate");
        tpl = Ext.create.apply(Ext, args);
        tpl.realCompile();

        var value = [
            '(function() {',
            'var tpl = ' + escodegen.generate(node) +';',
            'tpl.fn = ' + tpl.fn.toString() + ';',
            'return tpl',
            '})()'
        ].join("");

        parent.value = esprima.parse(value).body[0].expression;
    },

    replaceMethods: function(node, parent) {
        if(node.type != "MemberExpression")
            return ;

        if(! this.methods[node.property.name])
            return ;

        var objectName = node.object.name,
            property = node.property.name;

        if(node.object.type == "ThisExpression")
            objectName = "this";

        if(["this", "_this", "me"].indexOf(objectName) == -1) {
            var message = sprintf("Line %4s - %s couldn't be replaced because of unknown scope.",
                node.loc.start.line,
                escodegen.generate(node)
            );

            console.log(message);

            return ;
        }

        this.methods[property].used = true;
        node.property.name = this.methods[property].name;
    },

    getAst: function() {
        return this.ast;
    }
}

waterfall([
    function(callback) {
        fs.readFile("examples/app.js", "utf-8", function(err, content) {
            Application.init(content);
            Application.run();

            callback();
        });
    },

    function(callback) {
        var data = escodegen.generate(Application.getAst());
        fs.writeFile("examples/app.min.js", data, function(err) {
            callback();
        });
    },

    function(callback) {
        console.log("done");
        callback();
    } 
]);