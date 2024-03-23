// 静态 => 动态 => 封装render => 封装ReactDom
/**
  静态 阶段
  const text = document.createTextNode('嘻嘻')
  const node = document.createElement('div')
  document.querySelector('#root').append(node)
  node.append(text)
  执行后页面成功渲染了‘嘻嘻’
  
  写到这你肯定会说：你写的好傻哦，我自己写肯定会定义个类似虚拟dom的结构去完成。
  这位同学你说的没错，那我们现在来实现一下
    const vNode = {
        type: 'div',
        props: {
            id: 'app',
            children: [{
                type: 'text',
                props: {
                    nodeValue: '嘻嘻',
                    children: []
                } 
            }]
        }
    }
    这时候问题又来了如何实现动态改变‘嘻嘻’这个文字呢总不能天天写一个这样的结构吧？
    动态 阶段

    这个时候我们可以提出text 封装一个方法
    创建非文本的也可以一并提出来
    // 文本
    function createTextNode(nodeValue) {
        return {
            type: 'text',
            props: {
                nodeValue,
                children: []
            } 
        }
    }
    // dom
    function createElement (type, props, ...children) {
        return {
            type,
            props: {
                ...props,
                // 需要判断是不是文本
                children: children.map(child => {
                    // 如果是文本那就调用createTextNode生成文本解构 
                    return  typeof child === 'string' ? createTextNode(child) : child
                })
            }
        }
    }
    const textEl = createTextNode('嘻嘻, 谁完不成就是小狗')
    const app = createElement('div', {id: 'app'}, textEl)
    const textNode = document.createTextNode(textEl.props.nodeValue)
    const dom = document.createElement(app.type)
    dom.id = app.props.id
    document.querySelector('#root').append(dom)
    dom.append(textNode)
    执行后页面成功渲染了‘嘻嘻, 谁完不成就是小狗’
    现在聪明的你们肯定能发现创建div和text应该是可以封装成一个函数，因为可以用type去判断
    封装render 阶段
    function render (el, container) {
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
    const App = createElement('div', {id: 'app'}, '嘻嘻，', '谁完不成就是小狗')
    const root = document.querySelector('#root')
    render(App, root)
    执行后页面成功渲染了‘嘻嘻, 谁完不成就是小狗’

    这时候你突然想起来咱不是写mini-react吗？你这看着也不像啊...这315刚过就飘了？还搞起来假react了，大胆！
    我：害，你别急同学咱代码还没写完呢！
    封装ReactDom
    const ReactDom = {
        createRoot(container) {
            return {
                render(app) {
                    console.log('container, app :>> ', container, app);
                    render(app, container)
                }
            }
        }
    }
    const App = createElement('div', {id: 'app'}, '嘻嘻，', '谁完不成就是小狗')
    ReactDom.createRoot(document.querySelector('#root')).render(App)
    执行后页面成功渲染了‘嘻嘻, 谁完不成就是小狗’
    嗯很像了有点意思，就是有点过于简单了只是实现了渲染dom，其他功能呢？
    我: 同学你预算5毛钱能看就不错了，别得寸进尺啊！
    你这啥态度我要投诉，5毛也不给你！！
    我: 老板别别别，我写！我写还不行吗。不过后续步骤还没看呢要等等了。
    行记得完成哦！完不成是小狗。
 * */

import ReactDom from './core/reactDom.js'
import App from './App.js'

ReactDom.createRoot(document.querySelector('#root')).render(App)

