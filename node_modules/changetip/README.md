# ChangeTip API for NodeJS ![CircleCI Build Status](https://circleci.com/gh/changecoin/changetip-javascript.svg?style=shield&circle-token=:circle-token)
Enables easy communication with the ChangeTip API via NodeJS. Allows for sending and retrieving tip information

## Installation
    
    npm install changetip

## Instance Usage
````javascript
	var ChangeTip = require('changetip'),
    	change_tip = new ChangeTip({api_key:{YOUR_KEY_HERE});
    	
    change_tip.send_tip(uniqueId, sender, receiver, channel, meta).then(function(result) {
    	//Results here from transaction
    });
````

## Singleton Usage
````javascript
    var change_tip = require('changetip').getInstance();

    //Only needed once
    change_tip.init({api_key:{YOUR_KEY_HERE});
    
    change_tip.send_tip(uniqueId, sender, receiver, channel, meta).then(function(result) {
    	//Results here from transaction
    });
````

## API Development

1. Clone repo locally

		git clone https://github.com/changecoin/changetip-javascript.git

2. Install Node Modules

		npm install

## Generating Docs
	
	npm run docs

## Running Unit Tests
To run Unit Tests:

    npm run test