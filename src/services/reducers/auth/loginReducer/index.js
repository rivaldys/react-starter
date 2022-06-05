import { LOGIN } from '../../../../utils/actionType'

const initialState = {
    isLoading: false,
    data: false,
    errorMessage: false
}

const loginReducer = (state = initialState, action) =>
{
    switch(action.type)
    {
        case LOGIN.ATTEMPT:
            return {
                ...state,
                isLoading: action.payload.isLoading
            }
        case LOGIN.SUCCEED:
            return {
                ...state,
                data: action.payload.data
            }
        case LOGIN.FAILED:
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        default:
            return state
    }
}

export default loginReducer