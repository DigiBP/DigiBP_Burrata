// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const https = require('https');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {var body=JSON.stringify(request.body);
    console.log(body);
    let obj = JSON.parse(body);
    let dateTime=obj.queryResult.queryText;
    let data = '';
    let url = encodeURI(`https://hook.integromat.com/vqxboiqh8flb8mv1c5ityfg7f8i8pg4l?` + dateTime);
    console.log(url);
	return new Promise((resolve, reject) => {  
        const request = https.get(url, (res) => {
        res.on('data', (d) => {
                data += d;
        var answer=JSON.stringify(data);
        	if (answer.includes('false')){
           	 	agent.add(`Please propose another date.`);
        	}else{
            	agent.add(`An appoint has bee scheduled for you. Please check your emails for further information.`);
          		agent.add(`I hope I could help. Get well soon and until next time. Bye.`);
          	}
        });
        res.on('end', resolve);
        });
        request.on('error', reject);
    });
  }
  
   function symptoms(agent) {
    var body=JSON.stringify(request.body);
    console.log(body);
    var obj = JSON.parse(body);
    let symptoms=obj.queryResult.queryText;
    let insuranceNumber=obj.queryResult.outputContexts[1].parameters.Insurance_Number;
    console.log(insuranceNumber);
    console.log(symptoms);
    let data = '';
    let url = encodeURI(`https://hook.integromat.com/avnuxe3kkygvng5g6c2f8f4eq2sjilss?Symptoms=` + symptoms);
	return new Promise((resolve, reject) => {  
        const request = https.get(url, (res) => {
        res.on('data', (d) => {
                data += d;
        console.log(JSON.stringify(data));
        var answer=JSON.stringify(data);
        if (answer.includes('no diagnosis')){
             agent.add(`Please propose a date when you have time to see a doctor.`);
        }else{
          	agent.add(`Thank you, please check your e-mail to see which further actions are required`);
    		agent.add(`I hope I could help. Get well soon and until next time. Bye.`);
          	return new Promise((resolve, reject) => {
              	console.log(`Start process`)
              	let url = encodeURI(`https://hook.integromat.com/uil8k1wk4scl9f8vbmdf0nkjf7q8ived?InsuranceNumber=`+ insuranceNumber  + `&Symptoms=` + symptoms);
        		const request = https.get(url, (res) => {
        			res.on('data', (d) => {
                		data += d;
                      console.log(`Request sent`);
        			});
        			res.on('end', resolve);
        			});
        			request.on('error', reject);
    				});
        }
        });
        res.on('end', resolve);
        });
        request.on('error', reject);
    });
  }
  
  function date(agent) {
    
    agent.add(`Thanks`);
  }
  
  function name(agent){
    var body=JSON.stringify(request.body);
    console.log(body);
    var obj = JSON.parse(body);
    let insuranceNumber=obj.queryResult.outputContexts[2].parameters.Insurance_Number;
    console.log(insuranceNumber);
    let surname=obj.queryResult.parameters.givenname;
    let lastname=obj.queryResult.parameters.lastname;
    let mail=obj.queryResult.parameters.email;
    let birthDate=obj.queryResult.parameters.dateOfBirth;   
    let params='InsuranceNumber='+ insuranceNumber + '&Surname=' + surname + '&Lastname=' + lastname + '&Mail=' + mail + '&dataOfBirth=' + birthDate;
	let data = '';
    let url = encodeURI(`https://hook.integromat.com/zbeedk5u73hmh2jpay5w835anxq4x4kx?` + params);
    console.log(url);
	return new Promise((resolve, reject) => {  
        const request = https.get(url, (res) => {
        res.on('data', (d) => {
                data += d;
        agent.add(`Thanks`);
    	agent.add(`Now tell me about your symptoms.`);
        });
        res.on('end', resolve);
        });
        request.on('error', reject);
    });
  }
  
  function identification(agent){
    var body=JSON.stringify(request.body);
    console.log(body);
    var obj = JSON.parse(body);
    let bodyTemp=obj.queryResult.parameters.number2;
    let fracture=obj.queryResult.parameters.Fracture;
    let precon=obj.queryResult.parameters.Precondition;
    let headInj=obj.queryResult.parameters.Head_Injury;  
    console.log(fracture);
    let insuranceNumber=obj.queryResult.parameters.Insurance_Number;
    console.log(insuranceNumber);
	let data = '';
    let url = `https://hook.integromat.com/q93g5xzffvnuyoevnptsxeptgrv7caa3?InsuranceNumber=` + insuranceNumber;
	return new Promise((resolve, reject) => {  
        const request = https.get(url, (res) => {
        res.on('data', (d) => {
                data += d;
         	console.log(JSON.stringify(data));   
      		var name=JSON.stringify(data);
          	name = name.substr(13);
          	name = name.replace(/[^a-zA-Z ]/g, "");
          	if (name === ''){
            	agent.add(`Looks like we have never met before. Please tell me your full name.`);
            }else{
          		if (bodyTemp > 39 || fracture === 'yes' || precon === 'yes' || headInj === 'yes'){
              		agent.add(`Hi ` + name + `, please propose a date when you have time to see a doctor.`);
           		}else{
      				agent.add(`Hi ` + name + `, please tell me your symptoms.`);
            	}
            }
        });
        res.on('end', resolve);
        });
        request.on('error', reject);
    });
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Identification', identification);
  intentMap.set('Symptoms', symptoms);
  intentMap.set('Date', date);
  intentMap.set('Name', name);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
