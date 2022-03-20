import { useState, useEffect } from "react";
import NativeBalance from "../../native-balance";
import {
  Box,
  Button,
  TextField,
  Avatar,
  MenuItem,
  FilledInput,
  Card,
  CardHeader,
  Typography,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { AddressInput } from "../../address-input";
import { AssetSelector } from "./AssetSelector";
import { useMoralis, useWeb3Transfer } from "react-moralis";
import toast from "react-hot-toast";
import Blockie from "../../blockie";
import { Address } from "../../address/Address";
import { CreditCard } from "@mui/icons-material";


export const TokenTransfer = () => {
  const { Moralis } = useMoralis();
  const [receiver, setReceiver] = useState();
  const [asset, setAsset] = useState();
  const [tx, setTx] = useState();
  const [amount, setAmount] = useState();
  const [isPending, setIsPending] = useState(false);
  

  useEffect(() => {
    console.log(asset, amount, receiver);
    asset && amount && receiver ? setTx({ amount, receiver, asset }) : setTx();
  }, [asset, amount, receiver]);

  

  let options = {};
  if (tx) {
    switch (asset.token_address) {
      case "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee":
        options = {
          native: "native",
          amount: Moralis?.Units?.ETH(amount),
          receiver,
          awaitReceipt: false,
        };
        break;
      default:
        options = {
          type: "erc20",
          amount: Moralis?.Units?.Token(amount, asset.decimals),
          receiver,
          contractAddress: asset.token_address,
          awaitReceipt: false,
        };
    }
    
  }
  const { fetch, error, isFetching, data } = useWeb3Transfer(options)
  

  

  return (
    <Card sx={{ alignItems: "center", width: "100%" }}>
      <Card>
        <CardHeader
          sx={{}}
          title={
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Blockie scale={5} avatar currentWallet style />
              <Address size="6" copyable />
              <NativeBalance />
            </Box>
          }
        />
        <Box
          sx={{
            width: "100%",
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              maxWidth: "80px",
              width: "100%",
            }}
          >
            Address:
          </Typography>
          
            <AddressInput autoFocus onChange={setReceiver} />
          
          
        </Box>
        <Box
          sx={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            width: '100%'
          }}
        >
          <Typography
            sx={{
              maxWidth: "80px",
              width: "100%",
            }}
          >
            Amount:
          </Typography>
          <FilledInput
          disableUnderline
            fullWidth
            startAdornment={<CreditCard />}
            onChange={(e) => {
              console.log(`${e.target.value}`);
              setAmount(`${e.target.value}`);
            }}
          />
        </Box>
        <Box
          sx={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              //maxWidth: "80px",
              width: "100%",
            }}
          >
            Asset:
          </Typography>
          <AssetSelector setAsset={setAsset} style={{ width: "100%" }} />
        </Box>
        <Button
          color="primary"
          size="large"
          type="form"
          sx={{
            width: "100%",
            marginTop: "25px",
          }}
          onClick={async() => {
            const transaction = await fetch();
            const result = transaction.wait();
            toast.promise(result, {
                loading: 'Waiting for Transaction',
                success: 'Transaction Complete',
                error: 'Error transferring funds'
            })
          }}
          disabled={!tx}
        >
          Transfer💸
        </Button>
      </Card>
    </Card>
  );
};
