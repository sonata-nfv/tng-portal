export class InstantiationParameter {
	subnetID: string;
	nsID: string;
	nsName: string;
	slaID: string;
	slaName: string;
	ingresses: Array<{
		location: string;
		nap: string;
	}>;
	egresses: Array<{
		location: string;
		nap: string;
	}>;
	vimID: string;
	params: object;
}
