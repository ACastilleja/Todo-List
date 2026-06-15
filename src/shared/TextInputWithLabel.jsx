

function TextInputWithLabel({elementId,labelText,onChange,innerRef,value,maxLength}){

return(
    <>
    <label htmlFor={elementId}>{labelText}</label>
    <input
    type="text"
    id={elementId}
    ref={innerRef}
    value={value}
    onChange={onChange}
    maxLength={maxLength}
    />
    </>
);

}
export default TextInputWithLabel;