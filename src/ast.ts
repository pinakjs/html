import { isArray, isVoidTag } from "./utils"

export type HTMLAst = [
    children: (HTMLAst | string)[],
    value?: string,
    props?: Record<string, string | boolean>,
    parent?: HTMLAst
]

export const generateAst = (strings: string): (string | HTMLAst)[] => {
    let code: HTMLAst = [[]], lastSign: number, props = false
    let offset = 0, REGX1 = /[^\t\r\n\f\s]/, REGX2 = /[\t\r\n\f\s>=]/

    const indexOf = (str: string, position = 0) => {
        const index = strings.indexOf(str, position + offset)
        return index == -1 ? strings.length : index
    }

    const substring = (start: number, end: number) => {
        return strings.substring(offset + start, end)
    }

    const nextEmptyOrNonEmpty = (empty = true) => {
        const regex = empty ? REGX1 : REGX2
        let index = offset;

        while (strings[index]) {
            if (regex.test(strings[index++])) {
                break
            }
        }

        return index - 1
    }

    while (strings[offset]) {
        if (props) {
            offset = nextEmptyOrNonEmpty()

            if (strings[offset] == '>') {
                if (isVoidTag.has(code[1] as string)) {
                    code = code[3] as HTMLAst
                }

                offset++
                props = false
            }

            else if (strings[offset] == '/') {
                offset += 2
                props = false
            }

            else {
                let prop: string, value: string | boolean = true
                let hasQuates: boolean, firstChar: string

                prop = substring(0, nextEmptyOrNonEmpty(false))
                offset += prop.length;

                offset = nextEmptyOrNonEmpty()
                if (strings[offset] == '=') {
                    offset++

                    offset = nextEmptyOrNonEmpty()
                    firstChar = strings[offset]

                    lastSign = (hasQuates = firstChar == '"' || firstChar == "'")
                        ? indexOf(firstChar, 1)
                        : nextEmptyOrNonEmpty(false)

                    value = substring(hasQuates ? 1 : 0, lastSign)
                    offset = lastSign + (hasQuates ? 1 : 0)
                }

                (code[2] as Record<string, string | boolean>)[prop] = value
            }
        }

        else if (strings[offset] == '<') {

            if (strings[offset + 1] == '!') {
                offset = indexOf('-->', 4) + 3
            }

            else if (strings[offset + 1] == '/') {
                lastSign = indexOf('>', 2)
                if (code[3]) {
                    code = code[3]
                }

                offset = lastSign + 1
            }

            else {
                const tag = substring(1, nextEmptyOrNonEmpty(false))
                offset += tag.length + 1

                props = true
                code[0].push([[], tag, {}, code])
                code = code[0].slice(-1)[0] as HTMLAst
            }
        }

        else {
            lastSign = indexOf('<')
            const text = substring(0, lastSign),
                length = code[0].length

            if (length && !isArray(code[0][length - 1])) {
                code[0][length - 1] += text
            }

            else {
                code[0].push(text)
            }

            offset = lastSign
        }
    }

    return code[0]
}