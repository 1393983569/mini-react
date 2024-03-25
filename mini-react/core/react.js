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
        const isText = typeof child === 'string' || typeof child === 'number'
        return isText ? createTextNode(child) : child
    })
    return {
        type,
        props: {
            ...props,
            children: [...child]
        }
    }
}

let root = null
let nextWorkUnit = null
function render(el, container) {
    nextWorkUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
    root = nextWorkUnit
}

function workLoop(deadline) {
    let temp = true
    while (temp && nextWorkUnit) {
        nextWorkUnit = performWorkOfUnit(nextWorkUnit)
        temp = deadline.timeRemaining() > 0 
    }
    if (!nextWorkUnit && root) {
        commitRoot(root)
    }
    requestIdleCallback(workLoop)
}

// 实现统一提交
function commitRoot(root) {
    commitWork(root.child)
    root = null
}

function commitWork(fiber) {
    if (!fiber) return
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }
    if (fiber.dom) fiberParent.dom.append(fiber.dom)
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}


// 链式解构渲染节点
function performWorkOfUnit(work) {
    const isFn = typeof work.type === 'function'
    if (!work.dom && !isFn) {
        // 处理dom
        const dom = (work.dom = work.type === 'text' ? document.createTextNode(work.props.nodeValue) : document.createElement(work.type))
        // 处理props
        for (let key in work.props) {
            if (key !== 'children') {
                dom[key] = work.props[key]
            }
        }
    }
    const children = isFn ? [work.type(work.props)] : work.props.children
    initChildren(work, children)
    if (work.child) {
        return work.child
    }
    let nextWork = work
    while (nextWork) {
        if (nextWork.sibling) return nextWork.sibling
        nextWork = nextWork.parent
    }
    return nextWork
}

function initChildren(work, children) {
    let prevChild = null
    children.forEach((child, index) => {
        // 为了不改变原本dom结构所以新建一个对象来保存
        const newWork = {
            type: child.type,
            props: child.props,
            child: null,
            parent: work,
            sibling: null,
            dom: null
        }
        if (index === 0) {
            work.child = newWork
        } else {
            prevChild.sibling = newWork
        }
        prevChild = newWork
    })
}

requestIdleCallback(workLoop)

const React = {
    render,
    createElement
}

export default React