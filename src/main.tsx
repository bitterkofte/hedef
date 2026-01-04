import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './global.css'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts' 
import { Toaster } from 'sonner'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Toaster position='top-center' offset={12}  richColors/>
    <App />
  </Provider>
)
