import type { HTMLAst } from "./ast";
import { DELIMETER, isArray, isFunction, splitString } from "./utils";

export type NodeBuilder = (
    name: string | Function,
    props: object | null | undefined,
    children: NodeChild | NodeChild[]
) => object

export type DirectiveBuilder = (
    name: Function | string,
    value: any,
    ...rest: any[]
) => object

export type NodeChild = object | string | Function | null

export const generateCodeForProps = (
    props: Record<string, string | boolean | object[]>,
    use: DirectiveBuilder,
    params: Function
) => {
    let directive: object[] = [], temp: string[]

    for (const key in props) {
        if (key.startsWith('use:')) {
            temp = splitString(key, ':')

            directive.push(use(
                temp[1] == DELIMETER ? params() : temp[1],
                props[key] == DELIMETER ? params() : props[key],
                ...temp.slice(2)
            ))
            delete props[key]
        }

        else if (props[key] === DELIMETER) {
            props[key] = params()
        }
    }

    if (directive.length) {
        props.use = directive
    }
    return Object.keys(props).length ? props : null
}

export const generateCode = (
    ast: (string | HTMLAst)[],
    node: NodeBuilder,
    use: DirectiveBuilder,
    params: Function
): NodeChild | NodeChild[] => {
    const vnode: (object | string | Function)[] = []

    for (const curr of ast) {

        if (isArray(curr)) {
            const type = curr[1] == DELIMETER ? params() : curr[1]
            const props = generateCodeForProps(curr[2] as Record<string, string | boolean>, use, params)
            const children = generateCode(curr[0], node, use, params)

            vnode.push(node(type, props, children))
        }

        else {
            const expr = splitString(curr as string, DELIMETER)

            expr.forEach((curr, indx) => {
                const canInsert = expr.length - 1 != indx && (indx || expr.length > 1);
                const isFn = isFunction(params(0))
                curr = curr + (canInsert && !isFn ? params() : '')

                if (curr.trim()) {
                    vnode.push(curr)
                }

                if (canInsert && isFn) {
                    vnode.push(params())
                }
            })
        }
    }

    if (!vnode.length) {
        return null
    }

    if (vnode.length == 1) {
        return vnode[0]
    }

    return vnode
}