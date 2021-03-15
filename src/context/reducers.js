// Reducer
const firebaseReducer = (state, action) => {
  switch (action.type) {
    case "LOGGED_IN_USER":
      return { ...state, user: action.payload };
    case "NOTIFY":
      return { ...state, notify: action.payload };
    default:
      return state;
  }
};

export default firebaseReducer;
