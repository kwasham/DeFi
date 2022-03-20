import { useState, useEffect } from "react";
import { getEllipsisTxt } from '../../../helpers/formatters'
import { format } from "date-fns";
import { Box, Card, CardHeader, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Chart } from "../../chart";
import { Scrollbar } from "../../scrollbar";
import { useNativeTransactions } from "react-moralis";

const data1 = {
  series: [
    { data: [12, 24, 36, 48, 60, 72, 84] },
    { data: [12, 24, 36, 48, 60, 72, 84] },
    { data: [12, 24, 36, 48, 60, 72, 84] },
  ],
  categories: [
    "Capital One",
    "Ally Bank",
    "ING",
    "Ridgewood",
    "BT Transilvania",
    "CEC",
    "CBC",
  ],
};

export const OverviewTotalTransactions = (props) => {
  const theme = useTheme();
  const [categories, setCategories] = useState([])
  const { getNativeTransations, data, chainId, error, isLoading, isFetching } =
    useNativeTransactions({ limit: 7 });

    useEffect(() => {
      const array = []
      const init = async() => {
        data?.result.map((transaction) => {
          const short = getEllipsisTxt(transaction.to_address, 6)
          array.push(short)
          
        })
      }
    setCategories(array)
      init()
    }, [data])
    

    

  const chartOptions = {
    chart: {
      background: "transparent",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ["#6E7AD8", "#4655CE", "#2F3EB1"],
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
    },
    grid: {
      borderColor: theme.palette.divider,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    states: {
      active: {
        filter: {
          type: "none",
        },
      },
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: false,
    },
    stroke: {
      colors: ["transparent"],
      show: true,
      width: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      categories: categories,
      labels: {
        style: {
          colors: "#A3A3A3",
        },
      },
    },
    yaxis: {
      labels: {
        offsetX: -12,
        style: {
          colors: "#A3A3A3",
        },
      },
    },
  };

  const chartSeries = data1.series;
  
if(!categories) return
  return (
  
    <Card {...props}>
      <CardHeader
        subheader={format(new Date(), "MMM yyyy")}
        title="Total Transactions"
      />
      <Divider />
      <Scrollbar>
        <Box
          sx={{
            height: 336,
            minWidth: 500,
            px: 2,
          }}
        >
          
            <Chart
                  
                  height={300}
                  options={chartOptions}
                  series={chartSeries}
                  type="bar"
                />
        </Box>
      </Scrollbar>
      {/* <div>
        {error && <>{JSON.stringify(error)}</>}
        <button
          onClick={() => getNativeTransations({ params: { chain: "0x1" } })}
        >
          Refetch
        </button>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div> */}
    </Card>
  );
};
