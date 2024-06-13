import { EXAMPLE } from '@/utils'

const initialState = {
    data: false,
    errors: false,
    isLoading: false
}

const exampleReducer = (state = initialState, action) =>
{
    switch(action.type)
    {
        case EXAMPLE.ATTEMPT:
            return {
                ...state,
                data: false,
                errors: false,
                isLoading: action.payload.isLoading
            }
        case EXAMPLE.FAILED:
            return {
                ...state,
                data: false,
                errors: action.payload.errors,
                isLoading: false
            }
        case EXAMPLE.SUCCEED:
            return {
                ...state,
                data: action.payload.data,
                errors: false,
                isLoading: false
            }
        default:
            return state
    }
}

export default exampleReducer