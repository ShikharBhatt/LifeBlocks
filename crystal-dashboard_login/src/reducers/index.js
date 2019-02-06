import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import ThemeOptions from "./ThemeOptions";
import Layout from "./Layout";
import Auth from "./Auth";

const  l={
  Auth,
  ThemeOptions,
  Layout,
  form: formReducer
};
export default l;