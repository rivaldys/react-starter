import { useState } from 'react'

const useForm = initialValue =>
{
    const [value, setValue] = useState(initialValue)

    if(typeof initialValue !== 'object') return [value, setValue]

    const onChangeHandler = (formType, formValue) =>
    {
        if(typeof formType === 'string')
        {
            if(formType === 'reset') return setValue(initialValue)
    
            return setValue(previousValue =>
            {
                const keys = formType.split('.')
                const lastKey = keys.pop()

                if(!lastKey) return { ...previousValue, [formType]: formValue }

                let target = previousValue
                for(const key of keys) target = target[key]

                target[lastKey] = formValue
                return { ...previousValue }
            })
        }
        
        return setValue(previousValue => formType(previousValue))
    }

    return [value, onChangeHandler]
}

export default useForm