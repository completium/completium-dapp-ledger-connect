import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import LedgerConnect from './LedgerConnect';
import { TezosToolkit } from "@taquito/taquito";

function LedgerDialog(props) {
  const { tezos, onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Ledger</DialogTitle>
      <LedgerConnect tezos={tezos} handleSelected={handleListItemClick}></LedgerConnect>
    </Dialog>
  );
}

LedgerDemo.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function LedgerDemo() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('-');
  const [amountValue, setAmountValue] = React.useState('0');

  const tezos = new TezosToolkit("https://delphinet-tezos.giganode.io");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
    const pk = value;
    tezos.tz.getBalance(pk).then(balance => {
      const amount = balance.toNumber() / 1000000;
      setAmountValue(amount)
      console.log(`The balance of ${pk} is ${amount} ꜩ.\n`)
    });
  };

  return (
    <div>
      <Typography variant="subtitle1">Selected: {selectedValue}</Typography>
      <Typography variant="subtitle1">Amount: {amountValue} ꜩ</Typography>
      <br />
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Connect with ledger
      </Button>
      <LedgerDialog tezos={tezos} selectedValue={selectedValue} open={open} onClose={handleClose} />
    </div>
  );
}
