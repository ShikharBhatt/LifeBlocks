import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import createLogger from "redux-logger";
import thunk from "redux-thunk";
import reducers from "../reducers";

import React, { Component } from "react";
import { persistStore, persistReducer, AsyncStorage } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react-native
import sessionStorage from "redux-persist/es/storage/session"; // defaults to localStorage for web and AsyncStorage for react-native

const persistConfig = {
  key: "root",
  storage: sessionStorage
  //whitelist:['reducer']
};
console.log("REACT VERSION", React.version);
const rootReducer = combineReducers({ ...reducers });
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(
  persistedReducer,
  {},
  applyMiddleware(thunk, createLogger)
);

export const persistor = persistStore(store);
