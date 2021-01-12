import React from 'react';
import Button from '@material-ui/core/Button';
import { LedgerSigner, DerivationType } from '@taquito/ledger-signer';
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

export default function LedgerConnect(props) {
  const { tezos, handleSelected } = props;

  const [connected, setConnected] = React.useState(false);
  const [transport, setTransport] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [accountId, setAccountId] = React.useState("0");
  const [changeId, setChangeId] = React.useState("0");
  const [addressId, setAddressId] = React.useState(null);
  const [derivationType, setDerivationType] = React.useState(DerivationType.ED25519);



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

  const updateTezos = async (accountId = 0, changeId = 0, addressId, dt = DerivationType.ED25519) => {
    const path = (`44'/1729'/${accountId}'/${changeId}'`) + (addressId === null ? "" : `/${addressId}'`);
    console.log(path);
    const ledgerSigner = new LedgerSigner(transport, path, true, dt);
    tezos.setProvider({ signer: ledgerSigner });
    const publicKeyHash = await tezos.signer.publicKeyHash();

    handleSelected(publicKeyHash);
  }

  const handletextfield = (event) => {
    var value = event.target.value;
    switch (event.target.id) {
      case 'accountId': setAccountId(value); break;
      case 'changeId': setChangeId(value); break;
      case 'addressId': setAddressId(value); break;
      // case 'derivationType': setDerivationType(value); break;
      default: { }
    }
  };

  const handleClickOpen = () => {
    updateTezos(accountId, changeId, addressId, derivationType);
  }

  return (
    (connected ? (<div>
      <form noValidate autoComplete="off">
        <span>44'/1729'/</span>
        <TextField id="accountId" label="accountId" defaultValue={accountId} onChange={handletextfield} />
        <span>/</span>
        <TextField id="changeId" label="changeId" defaultValue={changeId} onChange={handletextfield} />
        <span>/</span>
        <TextField id="addressId" label="addressId" onChange={handletextfield} />
        <div>
          <InputLabel id="labelDerivationType" >Derivation Type</InputLabel>
          <Select labelId="labelDerivationType" id="derivationType" value={derivationType}>
            <MenuItem value={DerivationType.ED25519}>ED25519</MenuItem>
            <MenuItem value={DerivationType.SECP256K1}>SECP256K1</MenuItem>
            <MenuItem value={DerivationType.P256}>P256</MenuItem>
          </Select>
        </div>
      </form>
      <Button onClick={handleClickOpen}> Select address </Button></div>) : (<Button onClick={initTransport}> Connect ledger </Button>))
  );
}
