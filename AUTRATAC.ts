import { BabelType } from "babel-plugin-tester";
import * as types from '@babel/types';

const resolveName = "__res";
const waiterCallName = "__w";

export default function (babel: BabelType) {
    const t: typeof types = babel.types;
    return {
        visitor: {
            CallExpression: {
                enter(path: types.CallExpression, state: any) {
                    if (!waiterIsAlreadyAdded(t, path) && isInsideAsyncFunction(t,path)) {
                        
                        const addedWaiter = addWaiter(t, path);
                        //@ts-ignore
                        path.replaceWith(addedWaiter)
                    }
                }
            },

        }
    };
};

/**
 * checks if the waiter framework is already added
 * @param t typeof types
 * @param path NodePath
 * @returns boolean
 */
function waiterIsAlreadyAdded(t: typeof types, path: any): boolean {
    if (path.type === "CallExpression" && path.get('callee') && path.get('callee').node && path.get('callee').node.name === resolveName) {//if it is the "__res"
        return true;
    }

    if (path.type === "CallExpression" && path.get('callee') && path.get('callee').node && path.get('callee').node.name === waiterCallName) { //if it is waiter
        return true;
    }
    if (path.parentPath.type === "AwaitExpression") {
        if (path.parentPath.parentPath && path.parentPath.parentPath.type === "ArrowFunctionExpression" && path.parentPath.parentPath.parentPath && path.parentPath.parentPath.parentPath.type === "CallExpression") {
            //@ts-ignore
            if (path.parentPath.parentPath.parentPath.get('callee').node && path.parentPath.parentPath.parentPath.get('callee').node.name && path.parentPath.parentPath.parentPath.get('callee').node.name === waiterCallName) {
     return true
            }
        }
    }
    if (path.parentPath.type === "ArrowFunctionExpression") {
        if (path.parentPath.parentPath && path.parentPath.parentPath.type === "CallExpression") {
            //@ts-ignore
            if (path.parentPath.parentPath.get('callee').node && path.parentPath.parentPath.get('callee').node.name && path.parentPath.parentPath.get('callee').node.name === waiterCallName) {
            return true
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
function addWaiter(t: typeof types, path: types.CallExpression): any {
    return t.callExpression(
        t.identifier(waiterCallName),
        [
            t.arrowFunctionExpression(
                [],
                //@ts-ignore
                path.node,
                true
            )
        ]
    )
}

/**
 * Checks if a path is inside an asynchronous function
 * @param t typeof types
 * @param path any
 * @returns boolean
 */
function isInsideAsyncFunction(t: typeof types, path: any):boolean{
    if(path!=undefined && path!=null ){
        if( t.isFunction(path.node)){
            if(path.node.id!=null&& path.node.id.name!=null){
            }
            if(!!path.node&&!!path.node.async&&path.node.async==true){
                return true;
            }else{
                return false;
            }
        }else{
            return  isInsideAsyncFunction(t,path.parentPath);
        }
    }else{
        return false;
    }
}