import { generateAst } from "./ast";
import { DirectiveBuilder, NodeBuilder, generateCode, NodeChild } from "./code";
import { DELIMETER } from "./utils";

export type {
    NodeBuilder,
    DirectiveBuilder,
    NodeChild
}

export default (node: NodeBuilder, use: DirectiveBuilder) => {
    const map = new WeakMap<TemplateStringsArray, any>()

    return (strings: TemplateStringsArray, ...params: any[]) => {
        const oldParsedString = map.get(strings)
        if (oldParsedString) {
            return oldParsedString
        }

        let index = 0;
        const ast = generateAst(strings.join(DELIMETER).trim())
        const code = generateCode(ast, node, use, (add = 1) => {
            index += add
            return params[index - add]
        })
        map.set(strings, code)

        return code
    }
}