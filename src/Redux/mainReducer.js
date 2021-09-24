import actionTypeMaker from "../helpers/actionTypeMaker";

const intialState = JSON.parse(localStorage.getItem('userInfo')) || {
    name: '' , 
    id: ''
}

export default function mainReducer(state = intialState , action) {
    switch (action.type) {
        case actionTypeMaker.enterName():
            return {...state , name: action.payload.name , id: action.payload.id}
        default:
            return state
    }
}