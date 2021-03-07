# Stylo tutorial with Polkadot-js apps

This tutorial will walk you through setting up a Kusama account with the Stylo Android or iOS App and then use this account together with [Polkadot-js apps](https://polkadot.js.org/apps/) to see your balance and transfer funds or perform any extrinsic from this account.

* Notice: The UI maybe variant for different versions, but the functionalities are the same in v4 version.

## Summary
- [1. Get Stylo mobile application](#1-get-stylo-mobile-application)
- [2. Setup or recover an account](#2-setup-or-recover-an-account)
  - [Create an account](#create-an-account)
  - [Recover an account with your recovery phrase](#recover-an-account-with-your-recovery-phrase)
- [3. Add Stylo's account to Polkadot-js apps](#3-add-stylos-account-to-polkadot-js-apps)
- [4. Sign a transaction](#4-sign-a-transaction)


## 1. Get Stylo mobile application

### Device security
Stylo is meant to be used offline. The mobile device used to run Stylo will hold valuable information that needs to be kept securely stored. It is therefore advised to:
- Get a Stylo dedicated mobile device.
- Make a factory reset.
- Enable full-disk encryption on the device, with a reasonable password (might not be on by default, for example for older Android devices).
- Do not use any biometrics such as fingerprint or face recognition for device decryption/unlocking, as those may be less secure than regular passwords.
- Once Stylo has been installed, enable airplane mode and make sure to switch off Wifi, Bluetooth or any connection ability of the device.
- Only charge the phone using a power outlet that is never connected to the internet. Only charge the phone with the manufacturer's charging adapter. Do not charge the phone on public USB chargers.


### Install Stylo mobile application

Install Stylo making sure that it originated from **Stylo app**
- Android: From the [Github releases page](https://github.com/stylo-app/stylo/releases) or [Android play store](https://play.google.com/store/apps/details?id=com.styloapp)
<!-- - [iOS](https://itunes.apple.com/us/app//id1218174838) -->


## 2. Setup or recover an account
When launching the app for the first time, no account is created. At this stage, you will either want to create an account directly from your mobile device or recover an account previously created.
 
### Create an account
 
Tap on the `+` button, and follow along.

In the next step, your recovery phrase will be presented to you. Think of it as a master key. If you lose it, you lose your access to your money.
**Write this recovery phrase down and store it in a safe place**.
If your phone gets stolen/broken/forgotten this will be the only way to [recover your account](#recover-an-account-with-your-recovery-phrase).

You will then be asked to choose a pin code. This pin will be needed later on to unlock your account to manage the account or sign a transaction.


### Recover an account with your recovery phrase

If you already have an account created with either Stylo or any other wallet, you can recover it by doing so:
- Tap on the `+` at the top right corner, and choose ` Recover account`.
- Input the new account name.
- Select the network.
- Type in the recovery phrase, word suggestion helps you prevent any typo.
- Tap `Recover account`.
- Select a PIN number and confirm it by typing it again.


## 3. Add Stylo's account to Polkadot-js apps

To be able to follow this tutorial and interact with the Blockchain from a freshly created account on Stylo, you will need to get some KSMs on this account first. Polkadot-js apps allows you to manage your Stylo account seamlessly.

- Visit [Polkadot-js apps](https://polkadot.js.org/apps/) website.
- Go to `Accounts` from the left sidebar.
- Click on `Add via QR` button in the top right-hand corner.
- It will ask for the webcam permission for you to scan the Stylo's account QR code, accept it.
- On Stylo, choose on the account you want to copy the address of.
- Scan the QR code displayed on your phone with your computer's webcam. Make sure the QR code is fully displayed on your mobile's screen.
- You can now name this account on Polkadot-js apps.

## 4. Sign a transaction

Assuming that your Stylo account now has funds, you will be able to send some funds securely to anyone, without transferring your private key, and without needing any internet connection on your mobile phone.

- On Polkadot-js apps, click on the `send` button next to your account.
- On Polkadot-js apps, enter the address of the account you want to send funds to. Make sure to try with a small amount of money first before sending larger amounts.
- Click on `Make Transfer`
- Review the transaction.
- Click on `Scan via QR Code` when you're done.

You will now be presented with a QR code that represents the transaction. Since this transaction is sending funds from your Stylo mobile app account, only this account (sitting on your phone) can sign and authorize this transaction. This is what we'll do in the next steps:
- From the Stylo account overview, tap the scan button on the top right and scan the QR code presented by the Polkadot-js apps website.
- Review the transaction addresses and the amount to send on your phone. The amount and addresses must match what you've entered in apps. If you got phished, this is where you can realise it and reject the transaction.

Your phone has now *signed the transaction offline* using your Stylo account private key. The QR code that is now displayed on your phone represents a signed transaction that can be broadcasted. We will do this in the next steps:
- On Polkadot-js apps, click on `Scan Signature QR`, this will ask to turn on your webcam again.
- Face your phone's display to your webcam for the website to be able to read the signed transaction.
- Your transaction is sent automatically.
- Congrats you just sent funds from an air-gapped account :)
