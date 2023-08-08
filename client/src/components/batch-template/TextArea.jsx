import React, { useState, useEffect } from 'react'
import { useFormikContext, ErrorMessage, useField } from 'formik';
import { FloatingLabel, Form, Col } from 'react-bootstrap';

export const TextArea  = ({ label, onChange, ...props }) => {
    const { values } = useFormikContext();

    const [field] = useField(props);
    const [value, setValue] = useState(0)

    useEffect(() => {
        setValue(values[props.name] ? values[props.name].length : 0);
    }, [values, onChange]);

    return (
        <>
            {/* <FloatingLabel controlId={props.text} label={props.text}> */}
                <Form.Label>{props.text}</Form.Label>
                <Form.Control
                    className="scrollbar"
                    as="textarea"
                    placeholder=""
                    style={{ height: props.height ? props.height : 'auto' }}
                    rows={6}
                    
                    {...field} {...props}
                    
                />
                { props.maxLength && <span style={{color: "gray"}}>{value} / {props.maxLength}</span> }
            {/* </FloatingLabel> */}
            <ErrorMessage style={{color:"red", fontWeight:500}} component="div" name={field.name} className="error" />
        </>
    )
}

export const TextField  = ({ label, ...props }) => {
    const [field] = useField(props);
    return (
        <>
            <FloatingLabel controlId={props.text} label={props.text}>
                <Form.Control
                    placeholder="Leave a comment here"
                    {...field} {...props}
                />
            </FloatingLabel>
            <ErrorMessage style={{color:"red", fontWeight:500}} component="div" name={field.name} className="error" />
        </>
    )
}

export const NormalTextField  = ({ label, ...props }) => {
    const [field] = useField(props);
    return (
        <>
            <Form.Group as={Col} controlId="formGridEmail" style={{margin:"5px 0"}}>
                <Form.Label>{props.text}</Form.Label>
                <Form.Control type="text" placeholder={`Enter ${props.text}`} {...field} {...props}/>
                <ErrorMessage style={{color:"red", fontWeight:500}} component="div" name={field.name} className="error" />
            </Form.Group>
        </>
    )
}

export const NormalTextFieldXLabel  = ({ label, ...props }) => {
    const [field] = useField(props);
    return (
        <>
            <Form.Group as={Col} controlId="formGridEmail" style={{margin:"5px 0"}}>
                <Form.Control type="text" placeholder={`Enter ${props.text}`} {...field} {...props}/>
                <ErrorMessage style={{color:"red", fontWeight:500}} component="div" name={field.name} className="error" />
            </Form.Group>
        </>
    )
}

export const NormalTextFieldEmail  = ({ label, ...props }) => {
    const [field] = useField(props);
    return (
        <>
            <Form.Group as={Col} controlId="formGridEmail" style={{margin:"5px 0"}}>
                <Form.Control type="email" placeholder={`Enter ${props.text}`} {...field} {...props}/>
                <ErrorMessage style={{color:"red", fontWeight:500}} component="div" name={field.name} className="error" />
            </Form.Group>
        </>
    )
}

export const NormalTextFieldPassword  = ({ label, ...props }) => {
    const [field] = useField(props);
    return (
        <>
            <Form.Group as={Col} controlId="formGridEmail" style={{margin:"5px 0"}}>
                <Form.Control type="password" placeholder={`Enter ${props.text}`} {...field} {...props}/>
                <ErrorMessage style={{color:"red", fontWeight:500}} component="div" name={field.name} className="error" />
            </Form.Group>
        </>
    )
}

export const TextAreaS  = ({ label, ...props }) => {
    const [field] = useField(props);
    return (
        <>
            <FloatingLabel controlId={props.text} label={props.text}>
                <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    {...field} {...props}
                />
            </FloatingLabel>
            <ErrorMessage style={{color:"red", fontWeight:500}} component="div" name={field.name} className="error" />
        </>
    )
}
