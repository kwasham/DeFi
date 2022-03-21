import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Container,
  Divider,
  CardHeader,
} from "@mui/material";
import { TokenTransfer } from "../../components/wallet/components/TokenTransfer";
import { NFTTransfer } from "../../components/wallet/components/NFTTransfer";
import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { gtm } from "../../lib/gtm";

const tabs = [
  { label: "Token", value: "token" },
  { label: "NFT", value: "nft" },
];

const Wallet = () => {
  const [currentTab, setCurrentTab] = useState("token");

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      <Card
        component="main"
        sx={{
          flexGrow: 0,
          py: 2,
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "1rem",
          width: "550px",
          fontSize: "16px",
          fontWeight: "500",
          mx: "auto",
          my: "auto",
        }}
      >
        <Container maxWidth="md">
          <Tabs
            indicatorColor="primary"
            onChange={handleTabsChange}
            scrollButtons="auto"
            textColor="primary"
            value={currentTab}
            variant="fullWidth"
            centered
            sx={{ mt: 1 }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                sx={{ fontSize: "18px" }}
              />
            ))}
          </Tabs>
          <Divider />
          {currentTab === "token" && <TokenTransfer />}
          {currentTab === "nft" && <NFTTransfer />}
        </Container>
      </Card>
    </>
  );
};

Wallet.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default Wallet;
