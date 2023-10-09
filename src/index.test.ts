import PinakHtml from './'
import { expect, test } from 'vitest'

const h = (type: any, props: any, children: any) => ({ type, props, children })
const use = (name: any, value: any, ...rest: any[]) => ({ name, value, rest })

test('Should accept two functional parameter and return a function.', () => {
    const htm = PinakHtml(h, use)

    expect(htm).toBeInstanceOf(Function)
})

test('Should parse HTML.', () => {
    const htm = PinakHtml(h, use)

    expect(htm`<div>hello World</div>`).toStrictEqual({
        type: 'div',
        props: null,
        children: 'hello World'
    })
})

test('Should parse multi root HTML.', () => {
    const htm = PinakHtml(h, use)

    expect(htm`<div>hello World</div> second line here <h1>Heading</h1>`).toStrictEqual([
        {
            type: 'div',
            props: null,
            children: 'hello World'
        },
        " second line here ",
        {
            type: 'h1',
            props: null,
            children: 'Heading'
        }
    ])
})

test('Should parse HTML expect HTML comments.', () => {
    const htm = PinakHtml(h, use)

    expect(htm`<div>hello<!-- Hello comment is here --> World</div> second line here`).toStrictEqual([
        {
            type: 'div',
            props: null,
            children: 'hello World'
        },
        " second line here"
    ])
})

test('Should merge two imediate text nodes if there was a comment between them.', () => {
    const htm = PinakHtml(h, use)

    expect(htm`Hello<!-- This is comment between two text --> World`).toBe('Hello World')
})

test('Should merge text with dynamic param if it not a function.', () => {
    const htm = PinakHtml(h, use)

    expect(htm`Count: ${100}`).toBe('Count: 100')
})


test('Should not merge text with dynamic param if it a function.', () => {
    const htm = PinakHtml(h, use)
    const fn = () => console.log("Hello")

    expect(htm`Count: ${fn}`).toStrictEqual([
        'Count: ',
        fn
    ])
})

test('Should parse nested html elements.', () => {
    const htm = PinakHtml(h, use)
    const fn = () => console.log("Hello")

    expect(htm`Count: ${fn}<div>Hello <h1>This is h1 heading <span></span></h1><span></span></div>`)
        .toStrictEqual([
            'Count: ',
            fn,
            {
                type: 'div',
                props: null,
                children: [
                    'Hello ',
                    {
                        type: 'h1',
                        props: null,
                        children: [
                            'This is h1 heading ',
                            {
                                type: 'span',
                                props: null,
                                children: null
                            }
                        ]
                    },
                    {
                        type: 'span',
                        props: null,
                        children: null
                    }
                ]
            }
        ])
})

test('Should avoid elements if are not a void tag, has no child node and end tag.', () => {
    const htm = PinakHtml(h, use)

    expect(htm`<div>`).toBe(null)
})

test('Should parse Html attributes.', () => {
    const htm = PinakHtml(h, use)
    const fn = () => console.log("Hello")

    expect(htm`<div id="top" name=100 map is=${fn}><//>`).toStrictEqual({
        type: 'div',
        props: {
            id: "top",
            name: "100",
            map: true,
            is: fn
        },
        children: null
    })
})

test('Should construct directives.', () => {
    const htm = PinakHtml(h, use)
    const fn = () => console.log("Hello")

    expect(htm`
        <img
            src=""
            alt=""
            use:input="hello"
            use:go=${100} 
            use:${fn} 
            use:${fn}=${fn} 
            use:name:opt1:opt2
        >`).toStrictEqual({
        type: 'img',
        props: {
            alt: "",
            src: "",
            use: [
                {
                    name: 'input',
                    rest: [],
                    value: "hello"
                },
                {
                    name: 'go',
                    rest: [],
                    value: 100
                },
                {
                    name: fn,
                    rest: [],
                    value: fn
                },
                {
                    name: 'name',
                    rest: ['opt1', 'opt2'],
                    value: true
                }
            ]
        },
        children: null
    })
})