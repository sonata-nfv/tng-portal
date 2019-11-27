export class Project {
	name = 'example-service';
	uuid = 'defaultUuid';
	author = 'eu.tango';
	vendor = 'eu.tango';
	description = 'Example description';
	numVnfs = 1;
	fileNames = [];
	fileUrls = [];

	// all fields are optional
	constructor(name?: string, author?: string, vendor?: string, description?: string, numVnfs?: number, uuid?: string,
				fileUrls?: Array<string>) {
		if (name != null) {
			this.name = name;
		}
		if (author != null) {
			this.author = author;
		}
		if (vendor != null) {
			this.vendor = vendor;
		}
		if (description != null) {
			this.description = description;
		}
		if (numVnfs != null) {
			this.numVnfs = numVnfs;
		}
		if (uuid != null) {
			this.uuid = uuid;
		}
		if (fileUrls != null) {
			this.fileUrls = fileUrls;
			this.fileNames = Project.getFileNames(this.fileUrls);
		}
	}

	// based on the file URLs, retrieve the file names, ie, endings
	static getFileNames(urls: Array<string>): Array<string> {
		const fileNames = [];
		for (const url of urls) {
			const startIdx = url.lastIndexOf('/') + 1;
			fileNames.push(url.slice(startIdx));
		}
		return fileNames;
	}

	// loadFileContents(): void {
	// 	this.fileContents = { };
	// 	for (const url of this.fileUrls) {
	// 		this.http.get(url, { responseType: 'text'}).subscribe(
	// 			(content: string) => this.fileContents[url] = content
	// 		);
	// 	}
	// }
}
