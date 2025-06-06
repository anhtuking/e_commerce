import React, { memo } from "react";
import clsx from "clsx";

const InputField = ({
  value,
  setValue,
  nameKey,
  type,
  invalidFields,
  setInvalidFields,
  styleClass,
  fullWidth,
  placeholder,
  isShowLabel
}) => {
  return (
    <div className={clsx(" flex flex-col mb-2 relative font-main2", fullWidth && 'w-full')}>
      {
        value?.trim() !== "" && <label
        className="text-[12px] animate-slide-top-sm absolute top-0 left-[10px] block bg-white px-1"
        htmlFor={nameKey}
      >
        {nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
      </label>
      }
      <input
        type={type || "text"}
        className={clsx("px-4 py-2 rounded-sm w-full border my-2 placeholder:text-sm placeholder:italic outline-none", styleClass)}
        placeholder={placeholder || nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
        value={value}
        onChange={(e) =>
          setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))
        }
        onFocus={() => setInvalidFields && setInvalidFields([])}
      />
      {invalidFields?.some(el => el.name === nameKey) && <small className="font=[10px] italic font-main2 text-main pl-1 mb-2">
        {invalidFields.find(el => el.name === nameKey)?.mes}
        </small>}
    </div>
  );
};

export default memo(InputField);
