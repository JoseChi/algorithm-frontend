import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Importaciones de Redux
import { Provider } from 'react-redux'
import { store } from './redux/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* <--- AQUÍ ENVOLVEMOS LA APP */}
      <App />
    </Provider>
  </React.StrictMode>,
)