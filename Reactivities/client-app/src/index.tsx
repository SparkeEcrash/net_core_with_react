import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './app/layout/styles.css';
import App from './app/layout/App';
import * as serviceWorker from './serviceWorker';
import ScrollToTop from './app/layout/ScrollToTop';

import 'mobx-react-lite/batchingForReactDom';
// https://github.com/mobxjs/mobx-react-lite/#observer-batching

ReactDOM.render(
	<BrowserRouter>
		<ScrollToTop>
			<App />
		</ScrollToTop>
	</BrowserRouter>,
  document.getElementById('root')
);


// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
