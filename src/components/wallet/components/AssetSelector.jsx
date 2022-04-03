import { useEffect } from "react";
import { useERC20Balance } from "../../../hooks/useERC20Balance";
import { useMoralis, useNativeBalance } from "react-moralis";
import {
  Avatar,
  Select,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  MenuList,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useMemo } from "react";


export function AssetSelector({ setAsset, asset }) {
  const { Moralis } = useMoralis();
  const { assets } = useERC20Balance();
  const {
    data: nativeBalance,
    nativeToken,
    isFetching,
  } = useNativeBalance();

  
  console.log("render")

  const fullBalance = useMemo(() => {
    console.log("assets",assets,"balance",nativeBalance.balance,"native Token",nativeToken);
    if (!assets || !nativeBalance ) return null;
    console.log("After If")
    return [
      {
        balance: nativeBalance.balance,
        decimals: nativeToken?.decimals,
        thumbnail: "",
        logo: "",
        name: nativeToken?.name,
        symbol: nativeToken?.symbol,
        token_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
      ...assets,
    ];
  }, [assets, nativeBalance, nativeToken]);

  

  function handleChange(value) {
    console.log(value.target.value);
    const token = fullBalance.find(
      (token) => token.token_address === value.target.value,
    );
    console.log("handle Change", token);
    setAsset(token);
  }
  
  return (
    
    <Box sx={{ width: "100%" }}>
      <FormControl fullWidth variant="filled">
        <InputLabel id="asset-selector-label">Select Asset</InputLabel>
        <Select
          disableUnderline
          
          labelId="asset-selector-label"
          id="asset-selector"
          value={ asset.token_address }
          label="Assets"
          onChange={handleChange}
          sx={{ borderRadius: 1, display: "flex", flexDirection: "row" }}
        >
          
            {fullBalance &&
              fullBalance.map((item) => {
                
                if (item.balance === undefined) return;
                return (
                  <MenuList 
                  value={item["token_address"]}
                  key={item['token_address']}
                  sx={{mx: 2}}
                  >
                  <MenuItem >
                    <ListItemIcon sx={{}}>
                      <Avatar
                        src={
                          item?.logo ||
                          "https://etherscan.io/images/main/empty-token.png"
                        }
                        alt="nologo"
                        sx={{
                          marginLeft: -2,
                          width: "24px",
                          height: "24px",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText sx={{ marginLeft: -4 }}>
                      {item.symbol}
                    </ListItemText>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginRight: -2 }}
                    >
                      (
                      {parseFloat(
                        Moralis?.Units?.FromWei(item.balance, item.decimals),
                      )?.toFixed(6)}
                      )
                    </Typography>
                  </MenuItem>
                </MenuList>
                );
              })}
          
        </Select>
      </FormControl>
    </Box>
  );
}
