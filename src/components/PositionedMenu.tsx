/**
 * https://mui.com/material-ui/react-menu/#system-PositionedMenu.js
 * added MoreHorizonSharpIcon in place of Button
 */
import { useState } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizSharpIcon from '@mui/icons-material/MoreHorizSharp';
import { MenuItemValue, PositionMenuProp } from "../interfaces/types";

export default function PositionedMenu({menuValues}:PositionMenuProp) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: { currentTarget: any; }) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (menuFunction: Function) => {
    setAnchorEl(null);
    if(typeof menuFunction === 'function'){
        menuFunction();
    }
  };

  return (
    <div>
      <MoreHorizSharpIcon
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Dashboard
      </MoreHorizSharpIcon>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {
            menuValues.map((mitem:MenuItemValue) =>(
                <MenuItem key={mitem.text} onClick={() => handleClose(mitem.func)}>{mitem.text}</MenuItem>
            ) )
        }
      </Menu>
    </div>
  );
}