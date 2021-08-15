const path = require("path");
const fs = require("fs");


export interface IServerInfo{
	smtp: {
		host: string, 
		port: number,
		auth: { 
			user: string, 
			pass: string,
			},
	}, 
	imap: {
		host: string, 
		port: number, 
		auth:{ 
			user: string, 
			pass: string
		}
	}
}

export let serverInfo: IServerInfo;

// read te infromation from the serverInfo json 
const rawInfo: string = fs.readFileSync(path.join(__dirname, "../severInfo.json"));
// parse the raw txt read whit fs from serverInfo.json
serverInfo = JSON.parser(rawInfo);


