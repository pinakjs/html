import PinakHTML from './'

const h = (type: any, props: any, children: any) => ({ type, props, children })
const use = (name: any, value: any, ...rest: any[]) => ({ name, value, rest })

const htm = PinakHTML(h, use)

const fn = () => console.log('fn')
const other = () => console.log('other')

// console.log(htm`<div>Hello World!</div>`)

// console.log(htm`<div>hello World</div> second line here <h1>Heading</h1>`)

// console.log(htm`<div>hello<!-- Hello comment is here --> World</div> second line here`)

console.log(htm`<img
            src=""
            alt=""
            use:${other}
            use:${fn}=${fn}
        >`)