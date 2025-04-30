import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme'
// MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm'

import { ToastContainer } from 'react-toastify'

// Redux
import { store } from '~/redux/store.js'
import { Provider } from 'react-redux'

// React router DOM - BrowserRouter
import { BrowserRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <Provider store={store}>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider
            defaultOptions={{
              allowClose: false,
              dialogProps: { maxWidth: 'xs' },
              confirmationButtonProps: {
                color: 'secondary',
                variant: 'outlined'
              },
              cancellationButtonProps: { color: 'inherit' }
            }}
          >
            <CssBaseline />
            <App />
            <ToastContainer theme="colored" />
          </ConfirmProvider>
        </CssVarsProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)
