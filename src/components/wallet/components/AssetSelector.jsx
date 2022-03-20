import { useState } from "react";
import { useERC20Balance } from "../../../hooks/useERC20Balance";
import { useMoralis, useNativeBalance } from "react-moralis";
import { Avatar, Select, Box, FormControl, InputLabel, MenuItem, TextField} from "@mui/material";
import { useMemo } from "react";
import { any } from "prop-types";

export function AssetSelector({ setAsset, style }) {
  const { Moralis, chainId } = useMoralis();
  const { assets } = useERC20Balance();
  const { data: nativeBalance, nativeToken, isFetching } = useNativeBalance({chain: chainId});
  const [token, setToken] = useState()

  const fullBalance = useMemo(() => {
    //console.log('assets', assets, "balance", nativeBalance.balance, 'deci', nativeToken)
    if (!assets || !nativeBalance) return null;
    return [
      ...assets,
      {
        balance: nativeBalance.balance,
        decimals: nativeToken?.decimals,
        thumbnail: '',
        logo: '',
        name: nativeToken?.name,
        symbol: nativeToken?.symbol,
        token_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
    ];
  }, [assets, nativeBalance, nativeToken]);
  
  function handleChange(value) {
    console.log(value.target.value)
    const token = fullBalance.find((token) => token.token_address === value.target.value);
    console.log(token)
    setAsset(token);
    
  }

 
  return (

    
    <Box sx={{minWidth: 520}} >
      <FormControl fullWidth>
        <InputLabel id="asset-selector-label">Select Asset</InputLabel>
        <Select    
        defaultValue=""
        labelId="asset-selector-label"
        id="asset-selector"
        // value={setAsset}
        label="Assets"
        onChange={handleChange} 
        
        >
         {fullBalance &&
        fullBalance.map((item) => {
          console.log(item);
          if(item.balance === undefined) return
          return (
            
            <MenuItem
            value={item['token_address']}
            
             key={item["token_address"]}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                gap: "8px",
              }}
            >
              <Avatar
                src={
                  item?.logo ||
                  "https://etherscan.io/images/main/empty-token.png"
                }
                alt="nologo"
                sx={{ borderRadius: "15px", width: '24px', height: '24px' }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "90%",
                }}
              >
                <p>{item.symbol}</p>
                <p style={{ alignSelf: "right" }}>
                  (
                  {parseFloat(
                    Moralis?.Units?.FromWei(item.balance, item.decimals),
                  )?.toFixed(6)}
                  )
                  </p>
               </div>
              </div>
            </MenuItem>
        )
                  })}
          </Select>
          </FormControl>
        </Box>
        
  )    
          
}