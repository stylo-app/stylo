<p align="center" style="margin-bottom: 0px !important;">
    <img src="./res/stylo-logos/stylo_logo-black-blue.png" alt="stylo app logo offline signer"/>
</p>
<div align="center">

[![Github release](./res/github-badge.png)](https://github.com/stylo-app/stylo/releases)
[![Github release](./res/google-play-badge.png)](https://play.google.com/store/apps/details?id=com.styloapp)

</div>

<!--[<img src="./res/app-store-badge.png" width="250"/>]() -->

# Stylo - A wallet to keep you crypto funds offline

Stylo is a mobile application that turns any smartphone into an air-gapped crypto wallet. This is a fork of [Parity Signer](https://github.com/paritytech/parity-signer) and will work anywhere Signer works.

You can create an account for Polkadot, Kusama or any substrate based chain as well as Ethereum. You can sign transactions and messages, transfer funds to and from these accounts without any sort of connectivity enabled on the device.

You must turn off or even physically remove the smartphone's wifi, mobile network, and bluetooth to ensure that the mobile phone containing these accounts will not be exposed to any online threat.

**Disabling the mobile phone's networking abilities is a requirement for the app to be used as intended, visit our [wiki](./docs/wiki/Security-And-Privacy.md) for more details.**

Have a look at the tutorial to learn how to use [Stylo together with Polkadot-js apps](./docs/tutorials/Kusama-tutorial.md),  or [MyCrypto app](./docs/tutorials/MyCrypto-tutorial.md).

Any data transfer from or to the app happens using QR code. By doing so, the most sensitive piece of information, the private keys, will never leave the phone. The Stylo mobile app can be used to store any Polkadot or Ethereum account, this includes KSM, ETH, ETC.. It also supports various testnets (Westend, Kovan, Görli...).

<p align="center">
    <img src="./docs/screens.jpg" alt="stylo app screenshots"/>
</p>

## Getting Start

### Tutorials

- [Signing with Pokadot.js apps or extension](./docs/tutorials/Kusama-tutorial.md)
- [Recover Account from Polkadot.js Apps](./docs/tutorials/Recover-Account-Polkadotjs.md)
- [Manage Accounts on Stylo](./docs/tutorials/Hierarchical-Deterministic-Key-Derivation.md)
- [Signing with MyCrypto](./docs/tutorials/MyCrypto-tutorial.md)
<!-- - [Update New Network](./docs/tutorials/New-Network.md)-->

### Wiki

- [Security and Privacy](./docs/wiki/Security-And-Privacy.md)
- [Development](./docs/wiki/Development.md)
- [Building and Publishing](./docs/wiki/Building-And-Publishing.md)
- [Testing](./docs/wiki/Test.md)
- [Troubleshooting](./docs/wiki/Troubleshooting.md)
- [QA Check List](./docs/wiki/QA.md)

## License

Stylo is [GPL 3.0 licensed](LICENSE).
