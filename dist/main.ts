import path from "path";
import express, { Express, NextFuction, Request, Response } from "express";
import { serverInfo } from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./Contacts";
import { IContact } from "./Contacts";

const app: Express = express();

app.use(express.json()); // allows us to parse the json file as a middleware

app.use("/", express.static(path.join(__dirname, "../../client/dist")));

app.use(
		function( inRequest: Request, inResponse: Response, inNext: NextFunction ){
				// allow the functionality fo CORS
				inResponse.header("Access-Control-Allow-Origin", "*");  // allow all origen domains
				inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS"); // allow these methods 
				inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept"); // type of http heade accepted
				inNext(); // when doing middleware we call the inNext fucntion so that the next midlle ware on the chain can be run
		}
);


// API Endpoint: List MailBoxes
app.get("/mailboxes",  
		async (inRequest: Request, inResponse: Response) => {
				try{ 
						// make new IMAP worker wit serverinfo
						const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo); 
						// make the imapworker list the boxes, 
						const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
						// send mailboxes as a json
						inResponse.json(mailboxes);
				}catch(inError){
						inResponse.send("error");
				}
		}
);

// API Endpoint: List Messages
app.get("/mailboxes/:mailbox", 
		async ( inRequest: Request, inResponse: Response) => {
				try{
						const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
						const messages: IMAP.IMessage[] = await imapWorker.listMessages({ mailbox: inRequest.params.mailbox });
						inResponse.json(messages);
				}catch(inError){
						inResponse.send("error");
				}
		}
);

// API Endpoint: get a message
app.get("/messages/:mailbox/:id", 
		async ( inReuqest: Request, inResponse: Response ) => {
				try{
						// initialiaze and new imapworker with the sever info
						const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
						// pass the mailbox and the message id to the imapworker to fetch the masseage
						const messageBody: string = await imapWorker.getMessageBody({
								mailbox: inRequest.params.mailbox,
								id: parseInt(inRequest.params.id, 10)
						});
						// send the message 
						inResponse.send(messageBody);
				}catch( inError ){  
						inResponse.send("error");
				}
		}
);

