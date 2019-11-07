export class InstantiationParameter {
	subnet_id: string;
	sla_id: string;
	sla_name: string;
	ingresses: Array<{
		location: string;
		nap: string;
	}>;
	egresses: Array<{
		location: string;
		nap: string;
	}>;
	vim_id: string;
	params: object;
}
