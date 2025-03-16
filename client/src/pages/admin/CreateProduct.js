import React, { useCallback, useState } from "react";
import { Button, InputForm, Select, MarkdownEditor } from "components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { validate } from "utils/helpers";

const CreateProduct = () => {
  const { categories } = useSelector((state) => state.app);
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  const [payload, setPayload] = useState(
    {
      description: ''
    }
  )
  const [invalidFields, setInvalidFields] = useState([])
  
  const changValue = useCallback((e) => {
    setPayload(e)
  }, [payload])
  
  const handleCreateProduct = (data) => {
    const invalid = validate(payload, setInvalidFields)
    if (invalid === 0){
      if (data.category) data.category = categories?.find(el => el._id === data.category)?.title
      const finalPayload = {...data, ...payload}
      const formData = new FormData()
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
    }
  };
  console.log(invalidFields);
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Product</h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg px-4">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputForm
            label={"Name product"}
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Need fill this field",
            }}
            fullWidth
            placeholder="Name of new product"
          />
          <div className="w-full flex gap-4 my-6">
            <InputForm
              label={"Price"}
              register={register}
              errors={errors}
              id="price"
              validate={{
                required: "Need fill this field",
              }}
              styleClass="flex-auto"
              placeholder="Price of new product"
              type="number"
              fullWidth
            />
            <InputForm
              label={"Quantity"}
              register={register}
              errors={errors}
              id="quantity"
              validate={{
                required: "Need fill this field",
              }}
              styleClass="flex-auto"
              placeholder="Quantity of new product"
              type="number"
              fullWidth
            />
            <InputForm
              label={"Color"}
              register={register}
              errors={errors}
              id="color"
              validate={{
                required: "Need fill this field",
              }}
              styleClass="flex-auto"
              placeholder="Color of new product"
            />
          </div>
          <div className="w-full flex gap-4 my-6">
            <Select
              label="Category"
              options={categories?.map((el) => ({
                code: el._id,
                value: el.title,
              }))}
              register={register}
              id="category"
              validate={{
                required: "Need fill this field",
              }}
              errors={errors}
              styleClass="flex-auto"
            />
            <Select
              label="Brand"
              options={categories?.find(
                el => el._id === watch("category"))?.brand?.map((el) => ({
                    code: el,
                    value: el,
                  })
                )
              }
              register={register}
              id="brand"
              validate={{
                required: "Need fill this field",
              }}
              errors={errors}
              styleClass="flex-auto"
            />
          </div>
          <MarkdownEditor 
            name='description'
            changValue={changValue}
            label='Description'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="thumb">Upload thumb</label>
            <input 
              type="file" 
              id="thumb"
              {...register("thumb" , {required: "Need fill this field"})}
            />
            {errors?.["thumb"] && <small className='text-xs text-red-500'>{errors["thumb"]?.message}</small>}
          </div>
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="images">Upload images of product</label>
            <input 
              multiple
              type="file" 
              id="images"
              {...register("images" , {required: "Need fill this field"})}
            />
            {errors?.["images"] && <small className='text-xs text-red-500'>{errors["images"]?.message}</small>}
          </div>
          <div className="mt-8 flex justify-end">
            <Button type="submit">Save product</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;