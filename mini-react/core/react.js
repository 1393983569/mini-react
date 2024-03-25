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
    fiber.parent.dom.append(fiber.dom)
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}


// 链式解构渲染节点
function performWorkOfUnit(work) {
    if (!work.dom) {
        // 处理dom
        const dom = (work.dom = work.type === 'text' ? document.createTextNode(work.props.nodeValue) : document.createElement(work.type))
        // 处理props
        for (let key in work.props) {
            if (key !== 'children') {
                dom[key] = work.props[key]
            }
        }
        console.log('work :>> ', work);
        // work.parent.dom.append(dom)
    }
    // 处理关联关系
    const children = work.props.children
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

    if (work.child) {
        return work.child
    }
    if (work.sibling) {
        return work.sibling
    }
    return work.parent?.sibling
}

requestIdleCallback(workLoop)

const React = {
    render,
    createElement
}

export default React