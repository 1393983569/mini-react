import React from './react.js'

const ReactDom = {
    createRoot(container) {
        return {
            render(app) {
                React.render(app, container)
            }
        }
    }
}

export default ReactDom