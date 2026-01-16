import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import App from './App.tsx'
import { WSProvider } from "./context/WSContext";
import './index.css';

import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <WSProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WSProvider>
    </Provider>
  </StrictMode>,
)
