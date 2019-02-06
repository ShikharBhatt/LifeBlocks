import action from "../actions";
let defaultUserInfo = {
  name: undefined,
  image:
    "http://demos.creative-tim.com/light-bootstrap-dashboard-pro/assets/img/default-avatar.png"
};

export default function reducer(state = defaultUserInfo, action) {
  console.log("kaksad", state.name);
  switch (action.type) {
    case "LOGOUT":
      console.log("LOGOUT");
      return {
        //...state
        name: undefined,
        image: state.image
      };
    case "EXAMPLE_TWO":
      console.log("LOGIN");
      return {
        name: action.payload,
        image: state.image
        //...state,
        //name: action.payload
      };

    default:
      return state;
  }
}
