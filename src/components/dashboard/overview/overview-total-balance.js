import numeral from "numeral";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  
} from "@mui/material";
import { Scrollbar } from "../../scrollbar";
import { ArrowRight as ArrowRightIcon } from "../../../icons/arrow-right";
import { useMoralis, useNativeBalance, useERC20Balances } from "react-moralis";


const currencies = [
  {
    amount: 21500,
    color: "#2F3EB1",
    name: "US Dollars",
  },
  {
    amount: 15300,
    color: "#0C7CD5",
    name: "Bitcoin",
  },
  {
    amount: 1076.81,
    color: "#7BC67E",
    name: "XRP Ripple",
  },
];

export const OverviewTotalBalance = (props) => {
  const { Moralis, chainId } = useMoralis();

  const {
    getBalance,
    data: balance,
    nativeToken,
    error,
    isLoading,
  } = useNativeBalance({ chain: chainId  });

  const { fetchERC20Balances, data, isFetching } =
  useERC20Balances();

  console.log(data)

  return (
    <Card {...props}>
      <CardContent>
        <Typography color="textSecondary" variant="overline">
          Total balance
        </Typography>
        <Typography variant="h4">
          {balance.formatted}
          {/* {numeral(balance.).format("$0,0.00")} */}
        </Typography>

        <Divider sx={{ my: 2 }} />
        <Typography color="textSecondary" variant="overline">
          Available currency
        </Typography>
        <Scrollbar sx={{maxHeight: 150}}>
        <List 
        disablePadding 
        sx={{ 
          pt: 2,
         }} >
          {data?.map((currency, index) => (
            
            <ListItem
              
              disableGutters
              key={index}
              sx={{
                pb: 2,
                pt: 0,
                
              }}
              
            > 
            
              <ListItemText
                disableTypography
                primary={

                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "space-between",
                      
                    }}
                  >

                    
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Box
                        sx={{
                          border: 3,
                          borderColor: "white",
                          borderRadius: "50%",
                          height: 16,
                          mr: 1,
                          width: 16,
                        }}
                      />
                      <Typography variant="subtitle2">
                        {currency.name}
                      </Typography>
                    </Box>
                    <Typography color="textSecondary" variant="subtitle2">
                      {/* {numeral(currency.amount).format("$0,0.00")} */}
                      {Moralis.Units.FromWei(currency.balance)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
        </Scrollbar>
        
        <Divider />
        <Box
          sx={{
            alignItems: "flex-start",
            display: "flex",
            flexDirection: "column",
            pt: 2,
          }}
        >
          <Button endIcon={<ArrowRightIcon fontSize="small" />}>
            Add money
          </Button>
          <Button endIcon={<ArrowRightIcon fontSize="small" />} sx={{ mt: 2 }}>
            Withdraw funds
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
