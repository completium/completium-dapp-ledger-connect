import React from 'react';
import Button from '@material-ui/core/Button';
import { LedgerSigner, DerivationType } from '@taquito/ledger-signer';
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Ledger from './Ledger.svg'
import { Icon } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

const LedgerIcon = () => (
  <Icon>
    <img src={Ledger} height={50} width={200} />
  </Icon>
)

function LedgerStart(props) {
  const { clickScan, clickManual } = props;

  const handleAutomatic = () => {

  };

  const handleManual = () => {

  };

  return (
    <div>
      <div>Select mode to discover public address</div>
      <div>
        <Button onClick={handleAutomatic}> Automatic </Button >
      </div>
      <div>
        <Button onClick={handleManual}> Manual Connect </Button >
      </div>
      <div>(enter derivation path)</div>
    </div>);
}

function LedgerWait() {

  const handleCancel = () => {

  };

  return (<div>
    <CircularProgress />
    <div>Connecting to Ledger ...</div>
    <div><Button onClick={handleCancel}> Cancel </Button ></div>
  </div>);
}

function LedgerTimeLeft() {

  const handleCancel = () => {

  };

  return (<div>
    <div>Please accept on Ledger to provide public address</div>
    <div>Time left: ...</div>
    <div><Button onClick={handleCancel}> Cancel </Button ></div>
  </div>);
}

function LedgerScan() {
  return (<div>Scan addresses ...</div>);
}

function LedgerError() {
  return (<div>Error</div>);
}

function LedgerManualForm(props) {

  const { handleClickOpen, accountId, setAccountId, changeId, setChangeId, setAddressId, derivationType } = props;

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

  return (
    <div>
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
      <Button onClick={handleClickOpen}> Select address </Button></div>
  );
}

function LedgerContent(props) {
  const { tezos, handleSelected } = props;

  const [scan, setScan] = React.useState(false);
  const [manual, setManual] = React.useState(false);
  const [transport, setTransport] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [accountId, setAccountId] = React.useState("0");
  const [changeId, setChangeId] = React.useState("0");
  const [addressId, setAddressId] = React.useState(null);
  const [derivationType, setDerivationType] = React.useState(DerivationType.ED25519);

  const initTransport = async (b) => {
    try {
      const tr = await TransportU2F.create();
      setTransport(tr);
      setScan(b);
      setManual(!b);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  }

  const clickScan = () => { initTransport(true); }
  const clickManual = () => { initTransport(false); }

  const updateTezos = async (accountId = 0, changeId = 0, addressId, dt = DerivationType.ED25519) => {
    const path = (`44'/1729'/${accountId}'/${changeId}'`) + (addressId === null ? "" : `/${addressId}'`);
    console.log(path);
    const ledgerSigner = new LedgerSigner(transport, path, true, dt);
    tezos.setProvider({ signer: ledgerSigner });
    const publicKeyHash = await tezos.signer.publicKeyHash();

    handleSelected(publicKeyHash);
  }

  const handleClickOpen = () => {
    updateTezos(accountId, changeId, addressId, derivationType);
  }

  return (<LedgerTimeLeft />);
  // ((error !== null) ? (<LedgerError />) :
  //   (manual ? (<LedgerManualForm handleClickOpen={handleClickOpen} accountId={accountId} setAccountId={setAccountId} changeId={changeId} setChangeId={setChangeId} addressId={addressId} setAddressId={setAddressId} derivationType={derivationType} setDerivationType={setDerivationType} />) :
  //     (scan ? (<LedgerScan />) : (<LedgerStart clickManual={clickManual} clickScan={clickScan} />))));
}

export default function LedgerConnect(props) {
  const { tezos, handleSelected } = props;

  return (
    <Container>
      <div><span><LedgerIcon /><span>connect</span></span></div>
      <div><span>by Completium</span></div>
      <LedgerContent tezos={tezos} handleSelected={handleSelected} />
    </Container>);
}
