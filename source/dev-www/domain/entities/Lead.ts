class Lead {
	private singleField: string;
	constructor(myField: string) {
		this.singleField = myField;
	}

	validateLength(min: number, max: number) {
		return this.singleField + max;
	}
}

export = Lead;
