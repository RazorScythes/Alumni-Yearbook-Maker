import React from 'react'
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
const SidebarList = props => {
    const active = props.active ? 'active' : ''
    return (
        <li className={props.logout ? props.logout : props.dropdown} onClick={props.full_expand ? (e) => {props.setExpand(!props.value); e.preventDefault();}: null}>
            <label className={active}>
                <i className={props.icon}></i>
                <span className="links_name">{props.displayName}</span>
                {props.expand && props.value ? <i style={{marginLeft:"auto", marginRight:0}} onClick={(e) => {props.setExpand(!props.value); e.preventDefault();} }><ExpandLessIcon /></i> : null}
                {props.expand && !props.value ? <i style={{marginLeft:"auto", marginRight:0}} onClick={(e) => {e.preventDefault(); props.setExpand(!props.value);} }><ExpandMoreIcon /></i> : null}
            </label>
        </li>
    )
}

export default SidebarList
