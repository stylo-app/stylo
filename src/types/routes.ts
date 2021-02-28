export type RootStackParamList = {
	About: undefined;
	AccountDetails: undefined;
	AccountEdit: undefined;
	AccountPin: { isNew: boolean } | undefined;
	AccountNew: undefined;
	Main: { isNew: boolean } | undefined;
	AccountUnlockAndSign: { next: string };
	AccountUnlock: { next: string; onDelete: () => any };
	IdentityBackup: { isNew: true } | { isNew: false; seedPhrase: string };
	// IdentityManagement: undefined;
	RecoverAccount: { isRecover: boolean } | undefined;
	MessageDetails: undefined;
	Loading: undefined;
	Mnemonic:
		| {
				isNew: boolean;
		  }
		| undefined;
	AccountList: undefined;
	NetworkList: undefined;
	NetworkDetails: { pathId: string };
	NetworkSettings: undefined;
	PathsList: { networkKey: string };
	PinNew: { resolve: (pin: string) => void };
	PrivacyPolicy: undefined;
	QrScanner:
		| undefined
		| {
				isScanningNetworkSpec: true;
		  };
	Security: undefined;
	SignedMessage: undefined;
	SignedTx: undefined;
	TermsAndConditions: undefined;
	TxDetails: undefined;
};
