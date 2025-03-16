import clsx from 'clsx'
import React, { memo } from 'react'

const InputForm = ({label, disabled, register, errors, id, validate, type="text", placeholder, fullWidth, styleClass, defaultValue}) => {
  return (
    <div className={clsx('flex flex-col gap-2', styleClass)}>
        {label && <label htmlFor={id}>{label}</label>}
        <input 
            type={type} 
            id={id} 
            {...register(id, validate)} 
            disabled={disabled} 
            placeholder={placeholder} 
            className={clsx('form-input my-auto', fullWidth && "w-full", styleClass)}
            defaultValue={defaultValue}
        />
        {errors?.[id] && <small className='text-xs text-red-500'>{errors[id]?.message}</small>}
    </div>
  )
}

export default memo(InputForm)