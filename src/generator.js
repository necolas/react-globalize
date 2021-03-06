import React from "react";
import Globalize from "globalize";

var commonProps = ["elements", "locale"];

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function omit(set) {
    return function(element) {
        return set.indexOf(element) === -1;
    };
}

function generator(fn, argArray, options) {
    var Fn = capitalizeFirstLetter(fn);
    options = options || {};
    var beforeFormat = options.beforeFormat || function() {};
    var afterFormat = options.afterFormat || function(formattedValue) {
        return formattedValue;
    };
    return {
        displayName: Fn,
        format: function() {
            return this.instance[fn].apply(this.instance, this.args);
        },
        render: function() {
            var props = this.props;
            this.instance = Globalize;
            this.args = argArray.map(function(element) {
                return props[element];
            });

            // otherProps = this.props - argArray - commonProps.
            var otherProps = Object.keys(props).filter(omit(argArray)).filter(omit(commonProps)).reduce(function(memo, propKey) {
                memo[propKey] = props[propKey];
                return memo;
            }, {});

            // Get value from this.props.children.
            this.args[0] = props.children;

            if (props.locale) {
                this.instance = Globalize(props.locale);
            }

            beforeFormat.call(this);
            return React.DOM.span(otherProps, afterFormat.call(this, this.format()));
        }
    };
}

export default generator;
