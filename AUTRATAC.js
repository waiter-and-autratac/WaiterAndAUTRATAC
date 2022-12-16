"use strict";
exports.__esModule = true;
var resolveName = "__res";
var waiterCallName = "__w";
function default_1(babel) {
    var t = babel.types;
    return {
        visitor: {
            CallExpression: {
                enter: function (path, state) {
                    if (!waiterIsAlreadyAdded(t, path) && isInsideAsyncFunction(t, path)) {
                        var addedWaiter = addWaiter(t, path);
                        //@ts-ignore
                        path.replaceWith(addedWaiter);
                    }
                }
            }
        }
    };
}
exports["default"] = default_1;
;
/**
 * checks if the waiter framework is already added
 * @param t typeof types
 * @param path NodePath
 * @returns boolean
 */
function waiterIsAlreadyAdded(t, path) {
    if (path.type === "CallExpression" && path.get('callee') && path.get('callee').node && path.get('callee').node.name === resolveName) { //if it is the "__res"
        return true;
    }
    if (path.type === "CallExpression" && path.get('callee') && path.get('callee').node && path.get('callee').node.name === waiterCallName) { //if it is waiter
        return true;
    }
    if (path.parentPath.type === "AwaitExpression") {
        if (path.parentPath.parentPath && path.parentPath.parentPath.type === "ArrowFunctionExpression" && path.parentPath.parentPath.parentPath && path.parentPath.parentPath.parentPath.type === "CallExpression") {
            //@ts-ignore
            if (path.parentPath.parentPath.parentPath.get('callee').node && path.parentPath.parentPath.parentPath.get('callee').node.name && path.parentPath.parentPath.parentPath.get('callee').node.name === waiterCallName) {
                return true;
            }
        }
    }
    if (path.parentPath.type === "ArrowFunctionExpression") {
        if (path.parentPath.parentPath && path.parentPath.parentPath.type === "CallExpression") {
            //@ts-ignore
            if (path.parentPath.parentPath.get('callee').node && path.parentPath.parentPath.get('callee').node.name && path.parentPath.parentPath.get('callee').node.name === waiterCallName) {
                return true;
            }
        }
    }
    return false;
}
/**
 * adds Waiter to a path
 * @param t typeof types
 * @param path NodePath
 */
function addWaiter(t, path) {
    return t.callExpression(t.identifier(waiterCallName), [
        t.arrowFunctionExpression([], 
        //@ts-ignore
        path.node, true)
    ]);
}
/**
 * Checks if a path is inside an asynchronous function
 * @param t typeof types
 * @param path any
 * @returns boolean
 */
function isInsideAsyncFunction(t, path) {
    if (path != undefined && path != null) {
        if (t.isFunction(path.node)) {
            if (path.node.id != null && path.node.id.name != null) {
            }
            if (!!path.node && !!path.node.async && path.node.async == true) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return isInsideAsyncFunction(t, path.parentPath);
        }
    }
    else {
        return false;
    }
}
