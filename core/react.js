function createTextNode(nodeValue) {
    return {
        type: 'text',
        props: {
            nodeValue,
            children: []
        }
    }
}

function createElement(type, props, ...children) {
    const child = children.map(child => {
        return typeof child === 'string' ? createTextNode(child) : child
    })
    return {
        type,
        props: {
            ...props,
            children: [...child]
        }
    }
}

function render(el, container) {
    // 处理type
    const dom = el.type === 'text' ? document.createTextNode(el.props.nodeValue) : document.createElement(el.type)
    // 处理props
    for (let key in el.props) {
        if (key !== 'children') {
            dom[key] = el.props[key]
        }
    }
    // 处理children
    const children = el.props.children
    children.forEach(element => {
        render(element, dom)
    });
    // 放入dom
    container.append(dom)
}

const React = {
    render,
    createElement
}

export default React