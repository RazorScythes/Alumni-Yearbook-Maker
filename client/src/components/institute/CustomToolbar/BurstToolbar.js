import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import BurstModeIcon from '@material-ui/icons/BurstMode';
import { withStyles } from "@material-ui/core/styles";

const defaultToolbarStyles = {
  iconButton: {
  },
};

class CustomToolbar extends React.Component {
  
  handleClick = () => {
    this.props.bool(1)
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Tooltip title={"Bulk Image"}>
          <IconButton className={classes.iconButton} onClick={this.handleClick}>
            <BurstModeIcon className={classes.deleteIcon} />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  }

}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(CustomToolbar);