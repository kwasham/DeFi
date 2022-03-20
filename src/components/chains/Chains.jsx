import { useEffect, useState } from "react";
import {
  Menu,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  MenuList,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";
//import { DownOutlined } from "@ant-design/icons";
import { AvaxLogo, PolygonLogo, BSCLogo, ETHLogo } from "./Logos";
import { useChain, useMoralis } from "react-moralis";

const styles = {
  item: {
    display: "flex",
    alignItems: "center",
    height: "42px",
    fontWeight: "500",
    fontFamily: "Roboto, sans-serif",
    fontSize: "14px",
    padding: "0 10px",
  },
  button: {
    border: "2px solid rgb(231, 234, 243)",
    borderRadius: "12px",
  },
};

const options = [
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

// const options = [
//   'Show some love to MUI',
//   'Show all notification content',
//   'Hide sensitive notification content',
//   'Hide all notification content',
// ];

export default function Chains() {
  // const { switchNetwork, chainId, chain } = useChain();
  // const { isAuthenticated } = useMoralis();
  // const [selected, setSelected] = useState({});
  // const [anchorEl, setAnchorEl] = useState(null)
  // const open = Boolean(anchorEl)

  // console.log("chain", chain);

  // useEffect(() => {
  //   if (!chainId) return null;
  //   const newSelected = options.find((item) => item.key === chainId);
  //   setSelected(newSelected);
  //   console.log("current chainId: ", chainId);
  // }, [chainId]);

  // const handleMenuClick = (e) => {
  //   console.log("switch to: ", e.key);
  //   switchNetwork(e.key);
  // };

  // const menu = (
  //   <Menu onClick={handleMenuClick}>
  //     {menuItems.map((item) => (
  //       <Menu.Item key={item.key} icon={item.icon} style={styles.item}>
  //         <span style={{ marginLeft: "5px" }}>{item.value}</span>
  //       </Menu.Item>
  //     ))}
  //   </Menu>
  // );

  // if (!chainId || !isAuthenticated) return null;

  // return (
  //   <div>
  //     <Dropdown overlay={menu} trigger={["click"]}>
  //       <Button
  //         key={selected?.key}
  //         icon={selected?.icon}
  //         sx={{ ...styles.button, ...styles.item }}
  //       >
  //         <span style={{ marginLeft: "5px" }}>{selected?.value}</span>
  //         {/* <DownOutlined /> */}
  //       </Button>
  //     </Dropdown>
  //   </div>
  // );
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <List component="nav" aria-label="Network">
        <ListItemButton
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label={options[0].value}
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickListItem}
        >
          <ListItemText
          primary={options[selectedIndex]}
          />
          </ListItemButton>
      </List>
      <Menu
      id="lock-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'lock-button',
        role: 'listbox'
      }}
      >
        <Paper sx={{ width: 320, maxWidth: "100%" }}>
        <MenuList>
          {options.map((item) => (
            <MenuItem key={item.key}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.value}</ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Paper>
        </Menu>

      
    </div>
  );
}
