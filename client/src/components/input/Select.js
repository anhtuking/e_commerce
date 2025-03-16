import clsx from 'clsx'
import React, { memo } from 'react'

const Select = ({label, options = [], register, errors, id, validate, style, fullWidth, styleClass, defaultValue}) => {
  return (
    <div className={clsx('flex flex-col gap-2', styleClass)}>
      {label && <label htmlFor={id}>{label}</label>}
      <select className={clsx('form-select max-h-[42px]', fullWidth && 'w-full', styleClass)} id={id} {...register(id, validate)} defaultValue={defaultValue}>
        <option value=''>Choose</option>
        {options?.map(el => (
          <option value={el.code}>{el.value}</option>
        ))}
      </select>
      {errors?.[id] && <small className='text-xs text-red-500'>{errors[id]?.message}</small>}
    </div>
  )
}

export default memo(Select)