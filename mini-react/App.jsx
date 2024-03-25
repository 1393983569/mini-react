import React from './core/react.js'

function Counter({num}) {
    return <div>谁完不成就是小狗{num}</div>
}

function CounterContainer() {
    return <Counter num={3}></Counter>
}

const App = (
    <div>
        <div>第三天打卡</div>
        <CounterContainer></CounterContainer>
        <CounterContainer></CounterContainer>
        <div>第三天打卡结束</div>
    </div>
)
console.log('App :>> ', App);
export default App