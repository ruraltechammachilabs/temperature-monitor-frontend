import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import "./services/i18n/i18n";
import GlobalDataProvider from './Providers/GlobalDataProvider';
import { store } from './store/store';
import { Provider } from 'react-redux';
// import AuthProvider from './Providers/AuthDataProvider';
// import { I18nextProvider } from "react-i18next";
// import i18next from "i18next";

import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <I18nextProvider i18n={i18next}>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense>
          {/* <AuthProvider> */}
            <GlobalDataProvider>
              <Provider store={store}>
                <App />
              </Provider>
            </GlobalDataProvider>
          {/* </AuthProvider> */}
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  // </I18nextProvider>
);
