import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
const defaultToolbarStyles = {
  iconButton: {
  },
};


class CustomToolbar extends React.Component {

    handleClick = () => {
        console.log("Starting download...")
    }

  render() {
    const { classes } = this.props;
    //console.log(this.props.data)
    return (
      <React.Fragment>
        <Tooltip title={"Download CSV Format"}>
            <Link to={this.props.link} target="_blank" download>
                <IconButton className={classes.iconButton}  onClick={this.handleClick}>
                    <CloudDownloadIcon className={classes.deleteIcon} />
                </IconButton>
            </Link>
        </Tooltip>
      </React.Fragment>
    );
  }

}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(CustomToolbar);