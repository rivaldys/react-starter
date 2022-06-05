import axios from 'axios'
import { LOGIN, setLoading, setSuccess, setFail } from '../../../../utils'

const loginAction = (req) =>
{
    return dispatch =>
    {
        dispatch(setLoading(LOGIN.ATTEMPT))

        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API_URL}/auth/login`,
            data: req
        })
        .then(result =>
        {
            dispatch(setSuccess(LOGIN.SUCCEED, result))
        })
        .catch(error =>
        {
            dispatch(setFail(LOGIN.FAILED, error))
        })
    }
}

export default loginAction