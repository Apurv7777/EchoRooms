import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import App from './App.tsx'
import { WSProvider } from "./context/WSContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <WSProvider>
        <App />
      </WSProvider>
    </Provider>
  </StrictMode>,
)
