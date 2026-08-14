import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm'

// Redux
import { store } from '~/redux/store.js'
import { Provider } from 'react-redux'

// React router DOM - BrowserRouter
import { BrowserRouter } from 'react-router-dom'

// Redux Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

// Inject store: kỹ thuật inject store vào file này để có thể sử dụng store ở bên ngoài component
import { injectStore } from '~/utils/authorizeAxios'
injectStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/">
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider
            defaultOptions={{
              allowClose: false,
              dialogProps: { 
                maxWidth: 'xs',
                PaperProps: {
                  sx: {
                    borderRadius: 1 // Sử dụng mặc định theme (4px)
                  }
                }
              },
              buttonOrder: ['cancel', 'confirm'], // Phù hợp chuẩn UX (nút Cancel trước, Confirm sau)
              confirmationButtonProps: {
                color: 'primary',
                variant: 'contained',
                sx: { borderRadius: 1 }
              },
              cancellationButtonProps: { 
                color: 'inherit',
                variant: 'outlined',
                sx: { borderRadius: 1 }
              }
            }}
          >
            <GlobalStyles styles={{
              a: {
                textDecoration: 'none',
                color: 'inherit'
              }
            }} />
            <CssBaseline />
            <App />
            <ToastContainer theme="colored" />
          </ConfirmProvider>
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
