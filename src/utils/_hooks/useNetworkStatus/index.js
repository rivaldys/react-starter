import { useEffect, useState } from 'react'

const useNetworkStatus = () =>
{
    const [status, setStatus] = useState(window.navigator.onLine ? 'online' : 'offline')

    useEffect(() =>
    {
        const handleOnline = () => setStatus('online')
        const handleOffline = () => setStatus('offline')

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () =>
        {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    return status
}

export default useNetworkStatus