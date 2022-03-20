import { Box } from "@mui/system";
import React, { useState, useEffect, useMemo } from "react";
import { useMoralis, useTokenPrice } from "react-moralis";
import useInchDex from "../../hooks/useInchDex";
import SimpleDialog from "../../components/dex/components/simpleDialog";
import InchModal from "../../components/dex/components/InchModal";
import {
  Button,
  Card,
  FormControlUnstyledContext,
  Image,
  Dialog,
  Icon,
  Input,
  Modal,
  Typography,
  ImageList,
  ImageListItem,
  CardMedia,
} from "@mui/material";
import { ArrowDownwardOutlined } from "@mui/icons-material";
import { tokenValue } from "../../helpers/formatters";
import { getWrappedNative } from "../../helpers/networks";
import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";

const nativeAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

const chainIds = {
  "0x1": "eth",
  "0x38": "bsc",
  "0x89": "polygon",
};

const getChainIdByName = (chainName) => {
  for (let chainId in chainIds) {
    if (chainIds[chainId] === chainName) return chainId;
  }
};

const IsNative = (address) =>
  address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

const Dex = ({ chain = "eth", customTokens = {} }) => {
  const { trySwap, tokenList, getQuote } = useInchDex("eth");
  const { Moralis, isInitialized, chainId } = useMoralis();
  const [isFromModalActive, setFromModalActive] = useState(false);
  const [isToModalActive, setToModalActive] = useState(false);
  const [fromToken, setFromToken] = useState();
  const [toToken, setToToken] = useState();
  const [fromAmount, setFromAmount] = useState();
  const [quote, setQuote] = useState();
  const [currentTrade, setCurrentTrade] = useState();
  const { fetchTokenPrice } = useTokenPrice();
  const [tokenPricesUSD, setTokenPricesUSD] = useState({});

  const tokens = useMemo(() => {
    return { ...customTokens, ...tokenList };
  }, [customTokens, tokenList]);

  const fromTokenPriceUsd = useMemo(
    () =>
      tokenPricesUSD?.[fromToken?.["address"]]
        ? tokenPricesUSD[fromToken?.["address"]]
        : null,
    [tokenPricesUSD, fromToken],
  );

  const toTokenPriceUsd = useMemo(
    () =>
      tokenPricesUSD?.[toToken?.["address"]]
        ? tokenPricesUSD[toToken?.["address"]]
        : null,
    [tokenPricesUSD, toToken],
  );

  const fromTokenAmountUsd = useMemo(() => {
    if (!fromTokenPriceUsd || !fromAmount) return null;
    console.log("fromAmount", fromAmount);
    const price = (fromAmount * fromTokenPriceUsd).toFixed(4);
    console.log("price", price);
    return `~$ ${(fromAmount * fromTokenPriceUsd).toFixed(4)}`;
  }, [fromTokenPriceUsd, fromAmount]);

  const toTokenAmountUsd = useMemo(() => {
    if (!toTokenPriceUsd || !quote) return null;
    return `~$ ${(
      Moralis?.Units?.FromWei(quote?.toTokenAmount, quote?.toToken?.decimals) *
      toTokenPriceUsd
    ).toFixed(4)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toTokenPriceUsd, quote]);

  useEffect(() => {
    console.log(fromToken);
    console.log(toToken);
  }, [fromToken, toToken]);

  // tokenPrices
  useEffect(() => {
    if (!isInitialized || !fromToken || !chain) return null;

    const validatedChain = chain ? getChainIdByName(chain) : chainId;
    const tokenAddress = IsNative(fromToken["address"])
      ? getWrappedNative(validatedChain)
      : fromToken["address"];
    console.log(validatedChain, tokenAddress);
    fetchTokenPrice({
      params: { chain: validatedChain, address: tokenAddress },
      onSuccess: (price) =>
        setTokenPricesUSD(
          {
            ...tokenPricesUSD,
            [fromToken["address"]]: price["usdPrice"],
          },
          console.log(price),
        ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, isInitialized, fromToken]);

  useEffect(() => {
    if (!isInitialized || !toToken || !chain) return null;
    const validatedChain = chain ? getChainIdByName(chain) : chainId;
    const tokenAddress = IsNative(toToken["address"])
      ? getWrappedNative(validatedChain)
      : toToken["address"];
    fetchTokenPrice({
      params: { chain: validatedChain, address: tokenAddress },
      onSuccess: (price) =>
        setTokenPricesUSD({
          ...tokenPricesUSD,
          [toToken["address"]]: price["usdPrice"],
        }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, isInitialized, toToken]);

  useEffect(() => {
    if (!tokens || fromToken) return null;
    console.log(tokens[nativeAddress], fromToken);
    setFromToken(tokens[nativeAddress]);
    console.log("from token", fromToken);
  }, [tokens, fromToken]);

  const ButtonState = useMemo(() => {
    if (chainIds?.[chainId] !== chain)
      return { isActive: false, text: `Switch to ${chain}` };

    if (!fromAmount) return { isActive: false, text: "Enter an amount" };
    if (fromAmount && currentTrade) return { isActive: true, text: "Swap" };
    return { isActive: false, text: "Select tokens" };
  }, [fromAmount, currentTrade, chainId, chain]);

  useEffect(() => {
    if (fromToken && toToken && fromAmount)
      setCurrentTrade({ fromToken, toToken, fromAmount, chain });
  }, [toToken, fromToken, fromAmount, chain]);

  useEffect(() => {
    if (currentTrade) getQuote(currentTrade).then((quote) => setQuote(quote));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrade]);

  const PriceSwap = () => {
    const Quote = quote;
    if (!Quote || !tokenPricesUSD?.[toToken?.["address"]]) return null;
    if (Quote?.statusCode === 400) return <>{Quote.message}</>;
    console.log(Quote);
    const { fromTokenAmount, toTokenAmount } = Quote;
    const { symbol: fromSymbol } = fromToken;
    const { symbol: toSymbol } = toToken;
    const pricePerToken = parseFloat(
      tokenValue(fromTokenAmount, fromToken["decimals"]) /
        tokenValue(toTokenAmount, toToken["decimals"]),
    ).toFixed(6);
    return (
      <Typography
        sx={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "15px",
          color: "neutral.400",
          marginTop: "8px",
          padding: "0 10px",
        }}
      >
        Price:{" "}
        <Typography>{`1 ${toSymbol} = ${pricePerToken} ${fromSymbol} ($${tokenPricesUSD[
          [toToken["address"]]
        ].toFixed(6)})`}</Typography>
      </Typography>
    );
  };

  return (
    <>
      <Card
        sx={{
          margin: "auto",
          width: "430px",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "1rem",
          fontSize: "16px",
          fontWeight: "500",
          padding: "18px",
        }}
      >
        <Card sx={{ borderRadius: "1rem", padding: "0.8rem" }}>
          <Box
            sx={{ marginBottom: "5px", fontSize: "14px", color: "neutral.400" }}
          >
            From
          </Box>
          <Box
            sx={{
              display: "flex",
              flexFlow: "row nowrap",
            }}
          >
            <Box>
              <Input
                placeholder="0.00"
                sx={{
                  padding: "0",

                  fontWeight: "500",
                  fontSize: "23px",
                  display: "block",
                  width: "100%",
                }}
                onChange={(e) => {
                  const amount = e.target.value;
                  setFromAmount(amount);
                }}
                value={fromAmount}
              />
              <Typography
                sx={{
                  fontWeight: "600",
                  color: "neutral.400",
                  paddingTop: "5px",
                }}
              >
                {fromTokenAmountUsd}
              </Typography>
            </Box>
            <Button
              sx={{
                height: "fit-content",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "0.6rem",
                padding: "5px 10px",
                paddingRight: "40px",
                fontWeight: "500",
                fontSize: "17px",
                gap: "7px",
                border: "none",
              }}
              endIcon={<Arrow />}
              onClick={() => setFromModalActive(true)}
            >
              {fromToken ? (
                <CardMedia
                  component="img"
                  src={
                    fromToken?.logoURI ||
                    "https://etherscan.io/images/main/empty-token.png"
                  }
                  alt="nologo"
                  height="40"
                  sx={{ borderRadius: "15px" }}
                />
              ) : (
                <span>Select a token</span>
              )}
              <span>{fromToken?.symbol}</span>
            </Button>
          </Box>
        </Card>
        <Box
          sx={{ display: "flex", justifyContent: "center", padding: "10px" }}
        >
          <ArrowDownwardOutlined />
        </Box>
        <Card sx={{ borderRadius: "1rem", padding: "0.8rem" }}>
          <Box
            sx={{ marginBottom: "5px", fontSize: "14px", color: "neutral.400" }}
          >
            To
          </Box>
          <Box style={{ display: "flex", flexRow: "row nowrap" }}>
            <Box>
              <Input
                placeholder="0.00"
                sx={{
                  padding: "0",
                  fontWeight: "500",
                  fontSize: "23px",
                  display: "block",
                  width: "100%",
                }}
                readOnly
                value={
                  quote
                    ? parseFloat(
                        Moralis?.Units?.FromWei(
                          quote?.toTokenAmount,
                          quote?.toToken?.decimals,
                        ),
                      ).toFixed(6)
                    : ""
                }
              />
              <Typography
                sx={{
                  fontWeight: "600",
                  color: "neutral.400",
                  paddingTop: "5px",
                }}
              >
                {toTokenAmountUsd}
              </Typography>
            </Box>
            <Button
              sx={{
                height: "fit-content",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "0.6rem",
                padding: "5px 10px",
                paddingRight: "40px",
                fontWeight: "500",
                fontSize: "17px",
                gap: "7px",
                border: "none",
              }}
              endIcon={<Arrow />}
              onClick={() => setToModalActive(true)}
              type={toToken ? "default" : "Primary"}
            >
              {toToken ? (
                <CardMedia
                  component="img"
                  src={
                    toToken?.logoURI ||
                    "https://etherscan.io/images/main/empty-token.png"
                  }
                  alt="nologo"
                  height="40"
                  preview={false}
                  style={{ borderRadius: "15px" }}
                />
              ) : (
                <span>Select a token</span>
              )}
              <span>{toToken?.symbol}</span>
            </Button>
          </Box>
        </Card>
        {quote && (
          <Box>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "15px",
                color: "neutral.400",
                marginTop: "8px",
                padding: "0 10px",
              }}
            >
              Estimated Gas: <Typography>{quote?.estimatedGas}</Typography>
            </Typography>
            <PriceSwap />
          </Box>
        )}
        <Button
          type="primary"
          size="large"
          sx={{
            width: "100%",
            marginTop: "15px",
            borderRadius: "0.6rem",
            height: "50px",
          }}
          onClick={() => trySwap(currentTrade)}
          disabled={!ButtonState.isActive}
          variant="contained"
        >
          {ButtonState.text}
        </Button>
      </Card>

      <Dialog
        title="Select a token"
        open={isFromModalActive}
        onClose={() => setFromModalActive(false)}
        sx={{ padding: 0, width: "450px", margin: "auto" }}
      >
        <InchModal
          open={isFromModalActive}
          onClose={() => setFromModalActive(false)}
          setToken={setFromToken}
          tokenList={tokens}
        />
      </Dialog>
      <Dialog
        title="Select a token"
        open={isToModalActive}
        onClose={() => setToModalActive(false)}
        sx={{ padding: 0, width: "450px", margin: "auto" }}
      >
        <InchModal
          open={isToModalActive}
          onClose={() => setToModalActive(false)}
          setToken={setToToken}
          tokenList={tokens}
        />
      </Dialog>
    </>
  );
};

Dex.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default Dex;

const Arrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
