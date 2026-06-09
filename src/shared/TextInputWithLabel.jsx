

function TextInputWithLabel({elementId,labelText,onChange,innerRef,value,}){

return(
    <>
    <label htmlFor={elementId}>{labelText}</label>
    <input
    type="text"
    id={elementId}
    ref={innerRef}
    value={value}
    onChange={onChange}
    />
    </>
);

}
export default TextInputWithLabel;