export const setLoading = (actionType) =>
{
    return {
        type: actionType,
        payload: { isLoading: true }
    }
}

export const setSuccess = (actionType, data) =>
{
    return {
        type: actionType,
        payload: { data }
    }
}

export const setFail = (actionType, errorMessage) =>
{
    return {
        type: actionType,
        payload: { errorMessage }
    }
}