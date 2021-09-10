# Testing

### Test Signing

For a super quick test and to avoid the hurdle of creating an account, sending funds to it and finally create a transaction as described in the [tutorial using MyCrypto](./docs/tutorials/MyCrypto-tutorial.md), you can use a pre-funded account on Kovan Network and the following workflow. To get access to this account, you need to:

- Recover an account
- Select `Kovan` network and choose a name
- Use the secret phrase: `this is sparta` you'll get the account address: `006E27B6A72E1f34C626762F3C4761547Aff1421`
- Validate and accept the warning message
- Chose a pin code
- Scan this QR code to sign a transaction sending some Kovan Eth to the same account.

![Sample QR Code](https://raw.githubusercontent.com/paritytech/parity-signer/master/docs/tx_qr.png)

Corresponding data:

```json
{
    "action": "signTransaction",
    "data": {
        "account": "006e27b6a72e1f34c626762f3c4761547aff1421",
        "rlp": "ea1584ee6b280082520894006e27b6a72e1f34c626762f3c4761547aff1421872386f26fc10000802a8080"
    }
}
```

### Unit Test

If dependencies are not installed please first run `yarn install:ios` or `yarn install` for android.

Run `yarn unit` for all the units test.

If debugging is needed:

1. Insert `debugger;` in the code where you think it fails.
2. Run `yarn unit:debug`
3. Open a new tab in Chrome and go to `chrome://inspect`
4. Click the `inspect` button of target under `Remote Target`
5. Back to the terminal, choose one of the node watch commands to run the tests again.
