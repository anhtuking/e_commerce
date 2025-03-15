import React, {memo} from 'react'

const InputSelect = ({value, changeValue, options}) => {
  return (
    <select className='form-select text-sm border-item mt-2 w-[200px]' value={value} onChange={e => changeValue(e.target.value)}>
        <option value="">Default</option>
        {options?.map(el => (
            <option key={el.id} value={el.value}>
                {el.text}
            </option>
        ))}
    </select>
  )
}

export default memo(InputSelect)