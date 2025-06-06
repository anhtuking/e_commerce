import React, { memo } from "react";
import { Editor } from "@tinymce/tinymce-react";

const MarkdownEditor = ({
  label,
  value,
  changValue,
  name,
  invalidFields,
  setInvalidFields,
  setIsFocusDescription
}) => {
  return (
    <div className="flex flex-col">
      <span>{label}</span>
      <Editor
        apiKey={process.env.REACT_APP_TINYMCE}
        initialValue={value}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        onEditorChange={(content) => changValue(content)} 
        onFocus={() => {
          setInvalidFields && setInvalidFields([]);
          setIsFocusDescription && setIsFocusDescription(true);
        }}
        onBlur={() => setIsFocusDescription && setIsFocusDescription(false)}
      />
      {invalidFields?.some((el) => el.name === name) && (
        <small className="text-main text-sm">
          {invalidFields.find((el) => el.name === name)?.mes}
        </small>
      )}
    </div>
  );
};

export default memo(MarkdownEditor);
