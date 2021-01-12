import React from 'react';
import Button from '@material-ui/core/Button';
import { LedgerSigner, DerivationType } from '@taquito/ledger-signer';
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TextField from '@material-ui/core/TextField';

export default function LedgerConnect(props) {
  const { tezos, handleSelected } = props;

  const [connected, setConnected] = React.useState(false);
  const [transport, setTransport] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [accountId, setAccountId] = React.useState("0");
  const [changeId, setChangeId] = React.useState("0");


  const initTransport = async () => {
    try {
      const tr = await TransportU2F.create();
      setTransport(tr);
      setConnected(true);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  }

  const updateTezos = async (accountId = 0, changeId = 0, dt = DerivationType.ED25519) => {
    const ledgerSigner = new LedgerSigner(transport, `44'/1729'/${accountId}'/${changeId}'`, true, dt);
    tezos.setProvider({ signer: ledgerSigner });
    const publicKeyHash = await tezos.signer.publicKeyHash();

    handleSelected(publicKeyHash);
  }

  const handletextfield = (event) => {
    var value = event.target.value;
    switch (event.target.id) {
      case 'accountId'         : setAccountId(value); break;
      case 'changeId'          : setChangeId(value); break;
      default : {}
    }
  };

  const handleClickOpen = () => {
    updateTezos(accountId, changeId);
  }

  return (
    (connected ? (<div>
      <form noValidate autoComplete="off">
        <span>44'/1729'/</span>
        <TextField id="accountId" label="accountId" defaultValue="0"  onChange={handletextfield} />
        <span>/</span>
        <TextField id="changeId" label="changeId" defaultValue="0"  onChange={handletextfield} />
      </form>
      <Button onClick={handleClickOpen}> Select address </Button></div>) : (<Button onClick={initTransport}> Connect ledger </Button>))
  );
}
