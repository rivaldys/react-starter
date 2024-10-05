import { useEffect, useRef } from 'react'

const useEventListener = (eventName, handler, element) =>
{
    const savedHandler = useRef()

    useEffect(() =>
    {
        savedHandler.current = handler
    }, [handler])

    useEffect(() =>
    {
        const isSupported = element && element.addEventListener
        if(!isSupported) return

        const eventListener = event =>
        {
            if(savedHandler.current) savedHandler.current(event)
        }

        element.addEventListener(eventName, eventListener)

        return () =>
        {
            element.removeEventListener(eventName, eventListener)
        }
    }, [eventName, element])
}

export default useEventListener