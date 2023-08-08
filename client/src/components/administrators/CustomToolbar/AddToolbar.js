import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
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
    //console.log(this.props.data)
    return (
      <React.Fragment>
        <Tooltip title={"New Administration"}>
          <IconButton className={classes.iconButton} onClick={this.handleClick}>
            <AddIcon className={classes.deleteIcon} />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  }

}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(CustomToolbar);