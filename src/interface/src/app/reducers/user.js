const initialState = {
  username: null,
  token: null,
  firstname: null,
  lastname: null
};

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case 'LOGIN':
      return {
        ...state,
        username: action.data.username,
        token: action.data.token,
        firstname: action.data.firstname,
        lastname: action.data.lastname
      }
    default:
      return state;
  }
};
