import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { Box, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Popover, Typography } from '@mui/material';
import { useChain, useMoralis } from "react-moralis";
import { AvaxLogo, PolygonLogo, BSCLogo, ETHLogo } from "../chains/Logos";

const networks = [
    {
      key: "0x1",
      value: "Ethereum",
      icon: <ETHLogo />,
    },
    {
      key: "0x539",
      value: "Local Chain",
      icon: <ETHLogo />,
    },
    {
      key: "0x3",
      value: "Ropsten Testnet",
      icon: <ETHLogo />,
    },
    {
      key: "0x4",
      value: "Rinkeby Testnet",
      icon: <ETHLogo />,
    },
    {
      key: "0x2a",
      value: "Kovan Testnet",
      icon: <ETHLogo />,
    },
    {
      key: "0x5",
      value: "Goerli Testnet",
      icon: <ETHLogo />,
    },
    {
      key: "0x38",
      value: "Binance",
      icon: <BSCLogo />,
    },
    {
      key: "0x61",
      value: "Smart Chain Testnet",
      icon: <BSCLogo />,
    },
    {
      key: "0x89",
      value: "Polygon",
      icon: <PolygonLogo />,
    },
    {
      key: "0x13881",
      value: "Mumbai",
      icon: <PolygonLogo />,
    },
    {
      key: "0xa86a",
      value: "Avalanche",
      icon: <AvaxLogo />,
    },
    {
      key: "0xa869",
      value: "Avalanche Testnet",
      icon: <AvaxLogo />,
    },
  ];

  export const NetworkPopover = (props) => {
    const [selected, setSelected] = useState({})
    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const open = Boolean(anchorEl)
    const { onClose, ...other } = props;
    const { switchNetwork, chainId } = useChain();
    const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading, provider } =
    useMoralis();
  

  

  useEffect(() => {
      
    if (!chainId) return null;
    const newSelected = networks.find((item) => item.key === chainId);
    setSelected(newSelected);
    console.log("current chainId: ", chainId);
  }, [chainId]);


  if (!chainId || !isAuthenticated) return null;

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget)
  }
  
    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index)
      setAnchorEl(null)
      console.log('provider', provider)
      console.log("switch to: ", event.value);
      
      toast.promise(switchNetwork(event.key), {
        loading: 'Switching Networks...',
        success: `Switched to ${event.value}`,
        error: 'Error when switching networks'
      })  
      
    };

    const handleClose = () => {
      setAnchorEl(null)
    }
  
    return (
      <div>
        <List
          component="nav"
          aria-label='Networks'
          sx={{
            bgColor: 'background.paper'
          }}
        >
          <ListItem
            button
            id='network-button'
            aria-haspopup='listbox'
            aria-controls='network-menu'
            aria-expanded={open ? 'true' : null}
            onClick={handleClickListItem}
          >
            <ListItemIcon>
              {selected.icon}
            </ListItemIcon>
            <ListItemText 
              primary={selected.value}
            />
          </ListItem>
        </List>
        <Menu
          id='network-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'network-button',
            role: 'listbox'
          }}
        >
          {networks.map((network, index) => (
            <MenuItem
              key={network.key}
              selected={index === selectedIndex}
              onClick={() => handleMenuItemClick(network)}
            >
              <ListItemIcon>
                {network.icon}
              </ListItemIcon>
              <ListItemText>
                {network.value}
              </ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </div>

      // <Popover
      //   anchorEl={anchorEl}
      //   anchorOrigin={{
      //     horizontal: 'center',
      //     vertical: 'bottom'
      //   }}
      //   keepMounted
      //   onClose={onClose}
      //   open={open}
      //   PaperProps={{ sx: { width: 240 } }}
      //   transitionDuration={0}
      //   {...other}>
      //   {networks.map((network) => (
      //     <MenuItem
      //       onClick={() => handleChange(network)}
      //       key={network.key}
      //     >
      //       <ListItemIcon>
      //         <Box
      //           sx={{
      //             display: 'flex',
      //             height: 20,
      //             width: 20,
      //             '& img': {
      //               width: '100%'
      //             }
      //           }}
      //         >
      //           <img
      //             alt={network.value}
      //             src={network.icon}
      //           />
      //         </Box>
      //         {network.icon}
              
      //       </ListItemIcon>
      //       <ListItemText
      //         primary={(
      //           <Typography variant="subtitle2">
      //             {network.value}
      //           </Typography>
      //         )}
      //       />
      //     </MenuItem>
      //   ))}
      // </Popover>
    );
  };
  
  NetworkPopover.propTypes = {
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
  };