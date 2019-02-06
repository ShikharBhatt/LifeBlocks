import React, { Component } from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import { HashRouter, BrowserRouter } from "react-router-dom";
import "./assets/styles/base.scss";
import "sweetalert/dist/sweetalert.css";
import Main from "./pages/Main";
import { store, persistor } from "./config/configureStore";
import { Provider } from "react-redux";
import LoginForm from "./components/Login";
import { persistStore } from "redux-persist";
import App from "./App";
import { loadState, saveState } from "./localStorage";
//import { AsyncStorage } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import { withRouter, Switch } from "react-router-dom";

import Dashboard from "pages/Dashboard";
import Components from "pages/Components";
import UserProfile from "pages/UserProfile";
import MapsPage from "pages/MapsPage";
import Forms from "pages/Forms";
import Charts from "pages/Charts";
import Calendar from "pages/Calendar";
import Tables from "pages/Tables";
import Mypage from "pages/Mypage";
import UserInfo from "pages/UserProfile/UserInfo";
import { Router, Route, browserHistory } from "react-router";
//import UserProfile from "../UserProfile";
//import { loadState, saveState } from "../../localStorage";
//import renderApp from "../../index";
//import Signout from "../../components/Signout";
//import LoginForm from "../../components/Login";

//const persistedState = loadState();

//const store = store;
const rootElement = document.getElementById("root");

// store.subscribe(() => {
//   saveState(store.getState());
// });

const renderApp = Component => {
  alert("Index.js");
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <Component />

          {/* <Switch>
          <Route path="/login" component={Component} />
          <Route path="/mypage" component={Mypage} default />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/components" component={Components} />
          <Route path="/profile" component={UserProfile} />
          <Route path="/forms" component={Forms} />
          <Route path="/tables" component={Tables} />
          <Route path="/maps" component={MapsPage} />
          <Route path="/charts" component={Charts} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/userInfo" component={UserInfo} />

        </Switch> */}
        </BrowserRouter>
      </PersistGate>
    </Provider>,
    rootElement
  );
};

// class renderApp extends Component {
//   state = {
//     isReady: false
//   };
//   componentDidMount() {
//     persistStore(
//       store,
//       {
//         storage: AsyncStorage
//       },
//       () => {
//         this.setState({ isReady: true });
//       }
//     );
//   }
//   render() {
//     return (
//       (
//         <Provider store={store}>
//           <PersistGate persistor={persistor}>
//             <BrowserRouter>
//               <Switch>
//                 <Route path="/login" component={App} default />
//                 <Route path="/mypage" component={Mypage} />
//                 <Route path="/dashboard" component={Dashboard} />
//                 <Route path="/components" component={Components} />
//                 <Route path="/profile" component={UserProfile} />
//                 <Route path="/forms" component={Forms} />
//                 <Route path="/tables" component={Tables} />
//                 <Route path="/maps" component={MapsPage} />
//                 <Route path="/charts" component={Charts} />
//                 <Route path="/calendar" component={Calendar} />
//                 <Route path="/userInfo" component={UserInfo} />
//               </Switch>
//             </BrowserRouter>
//           </PersistGate>
//         </Provider>
//       ),
//       rootElement
//     );
//   }
// }

//console.log(store);

export default renderApp;
renderApp(App);

if (module.hot) {
  //resolve this to convert into class
  //speeds up dev -retain app state -updates only what is changed
  module.hot.accept("./pages/Main", () => {
    const NextApp = require("./pages/Main").default;
    console.log("Bye", NextApp);
    renderApp(NextApp);
  });
}

registerServiceWorker();
