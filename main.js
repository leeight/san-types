/**
 * @file main.js
 * @author leeight
 */

const babylon = require('babylon');
const traverse = require('babel-traverse');
const T = require('babel-types');
const doctrine = require('doctrine');
const generate = require('babel-generator');

const _traverse = traverse.default;
const _generate = generate.default;

function getMetaInfo(leadingComments) {
    if (!leadingComments || leadingComments.length <= 0) {
        return {};
    }

    let desc = [];
    let defaultValue;
    let bindx;
    leadingComments.forEach(c => {
        const ast = doctrine.parse('/**\n' + c.value + '\n*/', {unwrap: true});
        if (ast && ast.description) {
            desc.push(ast.description);
        }
        if (ast && ast.tags && ast.tags.length) {
            ast.tags.forEach(t => {
                if (t.title === 'default') {
                    defaultValue = t.description;
                }
                else if (t.title === 'bindx') {
                    bindx = true;
                }
            });
        }
    });

    return {
        desc: desc.join('\n'),
        bindx,
        defaultValue
    };
}

function getTypes(properties) {
    const types = [];

    properties.forEach(p => {
        const {key, value, leadingComments} = p;
        const {defaultValue, bindx, desc} = getMetaInfo(leadingComments);
        let type = null;
        let required = false;
        const {object, property} = value;
        if (object && property) {
            if (object.type === 'Identifier' && object.name === 'DataTypes' && property.type === 'Identifier') {
                // <name>: DataTypes.<type>
                type = property.name;
            }
            else if (property.type === 'Identifier' && property.name === 'isRequired') {
                // <name>: DataTypes.<type>.isRequired
                const o = object.object;
                const p = object.property;
                if (o.type === 'Identifier' && o.name === 'DataTypes' && p.type === 'Identifier') {
                    type = p.name;
                    required = true;
                }
            }
        }
        else {
            type = _generate(value).code;
        }

        const def = {
            name: key.name,
            type
        };
        if (required) {
            def.required = true;
        }
        if (bindx != null) {
            def.bindx = true;
        }
        if (desc != null) {
            def.desc = desc;
        }
        if (defaultValue != null) {
            def.defaultValue = defaultValue;
        }
        types.push(def);
    });

    return types;
}

exports.parse = function parse(code) {
    const ast = babylon.parse(code, {sourceType: 'module'});
    let result;
    _traverse(ast, {
        enter(path) {
            if (T.isIdentifier(path.node, {name: 'dataTypes'})) {
                result = getTypes(path.parentPath.node.value.properties);
            }
        }
    });
    return result;
}

