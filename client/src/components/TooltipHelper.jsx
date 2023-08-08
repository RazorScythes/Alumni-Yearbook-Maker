import React from 'react'
import { Tooltip, OverlayTrigger  } from 'react-bootstrap';
const TooltipHelper = ({text, align}) => {
    return (
        <OverlayTrigger                                      
            key={align ? align : "bottom"}
            placement={align ? align : "bottom"}
            overlay={
                <Tooltip id={`tooltip-${align ? align : "bottom"}`}>
                    {text}
                </Tooltip>
            }
        >
            <i className="bx bx-question-mark" style={{width: 25, height: 25, borderRadius: "100%", background:"#0275d8", color:"#FFF", textAlign:"center", paddingTop:5, margin: 5, fontWeight:500}}> </i>
        </OverlayTrigger>
    )
}

export default TooltipHelper
