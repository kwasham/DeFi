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
import { any } from "prop-types";

export function AssetSelector({ setAsset, style }) {
  const { Moralis, chainId } = useMoralis();
  const { assets } = useERC20Balance();
  const {
    data: nativeBalance,
    nativeToken,
    isFetching,
  } = useNativeBalance({ chain: chainId });

  
  
  

  const fullBalance = useMemo(() => {
    console.log('assets', assets, "balance", nativeBalance.balance, 'deci', nativeToken)
    if (!assets || !nativeBalance) return null;
    return [
      ...assets,
      {
        balance: nativeBalance.balance,
        decimals: nativeToken?.decimals,
        thumbnail: "",
        logo: "",
        name: nativeToken?.name,
        symbol: nativeToken?.symbol,
        token_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
    ];
  }, [assets, nativeBalance, nativeToken]);

  function handleChange(value) {
    console.log(value.target.value);
    const token = fullBalance.find(
      (token) => token.token_address === value.target.value,
    );
    console.log(token);
    setAsset(token);
  }

  return (
    <Box sx={{ width: "100%"}}>
      <FormControl fullWidth variant="filled">
        <InputLabel id="asset-selector-label">Select Asset</InputLabel>
        <Select
          disableUnderline
          //defaultValue=''
          labelId="asset-selector-label"
          id="asset-selector"
          //value={}
          label="Assets"
          onChange={handleChange}
          sx={{borderRadius: 1}}
        >
          {fullBalance &&
            fullBalance.map((item) => {
              console.log(item);
              if (item.balance === undefined) return;
              return (
                <MenuList
                  
                  value={item["token_address"]}
                  key={item["token_address"]}
                  sx={{mx: 2}}
                >
                  <MenuItem sx={{}}>
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
                    <ListItemText sx={{marginLeft: -4}}>{item.symbol}</ListItemText>
                    <Typography variant="body2" color="text.secondary" sx={{marginRight: -2}}>
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
