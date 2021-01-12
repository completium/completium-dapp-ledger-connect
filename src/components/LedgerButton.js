import React from 'react';
import '../index.css';
import Button from '@material-ui/core/Button';

const LedgerButton = (props) => {
  return (
    <Button variant="contained" color="primary"
        disableElevation
        size="small"
        style={{ position: 'absolute', left: '5px', top: '3px' }}
        onClick={props.handleConnect}>
        connect to ledger
            </Button>
  )
}
export default LedgerButton
