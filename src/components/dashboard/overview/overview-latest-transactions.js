import { format, subDays, parseJSON } from 'date-fns';
import numeral from 'numeral';
import {
  Box,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Typography,
  IconButton
} from '@mui/material';
import { useMoralis, useNativeTransactions } from "react-moralis";
import { getExplorer } from '../../../helpers/networks';
import { OpenInNew } from '@mui/icons-material';
import { Address } from '../../address/Address';
import { Scrollbar } from '../../scrollbar';
import { SeverityPill } from '../../severity-pill';


// const transactions = [
//   {
//     id: 'd46800328cd510a668253b45',
//     amount: 25000,
//     currency: 'usd',
//     date: new Date(),
//     sender: 'Devias',
//     type: 'receive',
//     status: 'on hold'
//   },
//   {
//     id: 'b4b19b21656e44b487441c50',
//     amount: 6843,
//     currency: 'usd',
//     date: subDays(new Date(), 1),
//     sender: 'Zimbru',
//     type: 'send',
//     status: 'confirmed'
//   },
//   {
//     id: '56c09ad91f6d44cb313397db',
//     amount: 91823,
//     currency: 'usd',
//     date: subDays(new Date(), 1),
//     sender: 'Vertical Jelly',
//     type: 'send',
//     status: 'failed'
//   },
//   {
//     id: 'aaeb96c5a131a55d9623f44d',
//     amount: 49550,
//     currency: 'usd',
//     date: subDays(new Date(), 3),
//     sender: 'Devias',
//     type: 'receive',
//     status: 'confirmed'
//   }
// ];



export const OverviewLatestTransactions = (props) => {
  
  const { getNativeTransactions, data, error, chainId, isLoading, isFetching } =
  useNativeTransactions({limit: 4});
  const { Moralis, account } = useMoralis()
  
  return (
    
  <Card {...props}>
    <CardHeader title="Latest Transactions" />
    <Scrollbar>
      <Table sx={{ minWidth: 600 }}>
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>
              Transaction
            </TableCell>
            <TableCell />
            <TableCell>
              Amount
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.result &&
          data?.result.map((transaction, index) => {
            const date = parseJSON(transaction.block_timestamp)
            return (
            <TableRow
              key={index}
              sx={{
                '&:last-child td': {
                  border: 0
                }
              }}
            >
              <TableCell width={100}>
                <Box
                  sx={{
                    p: 1,
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                      ? 'neutral.800'
                      : 'neutral.200',
                    borderRadius: 2,
                    maxWidth: 'fit-content'
                  }}
                >
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="subtitle2"
                  >
                    {format(date, 'LLL').toUpperCase()}
                  </Typography>
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="h6"
                  >
                    {format(date, 'd')}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <div>
                  <Typography variant="subtitle2">
                    <Address avatar = 'left' 
                    address = {transaction.from_address} 
                     
                    size="6" />
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    Payment Sent
                  </Typography>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <Typography variant="subtitle2">
                    <Address avatar = 'left' 
                    address = {transaction.to_address} 
                     
                    size="6" />
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    Payment Received
                  </Typography>
                </div>
              </TableCell>
              <TableCell>
                <SeverityPill
                  color={(transaction.receipt_status === '1' && 'success')
                  || (transaction.receipt_status === '0' && 'error')
                  || 'warning'}
                >
                  {transaction.receipt_status === '1'
                   ? 'Confirmed'
                   : 'Failure'
                  }
                </SeverityPill>
              </TableCell>
              <TableCell width={180}>
                <Typography
                  color={transaction.to_address === account
                    ? 'success.main'
                    : 'error.main'}
                  variant="subtitle2"
                >
                  {transaction.to_address === account ? '+' : '-'}
                  {' '}
                  {Moralis.Units.FromWei(transaction.value, 18)}
                  {/* {numeral(transaction.value).format('$0,0.00')} */}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                >
                  ETH
                  <IconButton 
                href={`${getExplorer(chainId)}tx/${transaction.hash}`}
                target="_blank"
                rel="noreferrer"
                sx = {{marginLeft: "50px"}}
                >
                  <OpenInNew />
                </IconButton>
                </Typography>
                
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </Scrollbar>
    {/* <div>
      {error && <>{JSON.stringify(error)}</>}
      <button
        onClick={() => useNativeTransations({ params: { chain: "0x1" } })}
      >
        Refetch
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div> */}
  </Card>
)};
