import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

const TextAreaAutosizeRef = React.forwardRef(
  ({ handleChange, post, doTextAreaFocus, setDoTextAreaFocus }, ref) => {
    const [textAreaClick, setTextAreaClick] = useState(false);

    useEffect(() => {
      const currentRef = ref.current;
      //   if (textAreaClick) {
      //     currentRef.focus();
      // } else

      if (doTextAreaFocus) {
        currentRef.focus();
      } else if (!doTextAreaFocus) {
        currentRef.blur();
      }

      return () => {
        currentRef.blur();
      };
    }, [doTextAreaFocus]);

    const handleTextAreaClick = () => {
      //   setTextAreaClick(true);
      //   ref.current.focus();
      console.log("click");
    };
    const handleBlur = () => {
      console.log("blur");
    };
    return (
      <TextareaAutosize
        ref={ref}
        className="comment-textarea"
        onChange={(e) => handleChange(e)}
        onClick={handleTextAreaClick}
        onBlur={handleBlur}
        value={post.comments.textField}
        placeholder="Write a comment..."
      />
    );
  }
);

export default TextAreaAutosizeRef;
