import os;
import subprocess;
import httplib, json;
import xmlrpclib

import threading


#base address where all the wallets are located.
walletBaseAddress = "~/.electrum/wallets/";
walletName = "userWallet_1";
walletsList = {"wallet_name":["password","address"],
"wallet_name":["password","address"]
}

userWallets = {"userId":"walletName",
			   "userId":"walletName"}

payToWho="wallet_2";
# code to get list of transactions
#go through the list, change the walletName to the wallet to transfer from and payTo
#variable to the receiver address.

#add a function to calculate transaction fee.

# for x in range(0, 1):

#this function loads the userWallets with values from database table wallets.
	#get list of wallets and their user from wallets table
	#fill the userWallets object

#this is how we calculate the minimum amount
#to pay for each transactions
def calculateTransFee(_amount):
	fee=0.0001;
	return fee;

def payTo(_wallet,_to,_amount):
	paymentReq = generatePayScript(_wallet,_to,_amount);
	appendLog(paymentReq);
	rawData = subprocess.check_output(paymentReq, shell=True);
	rawData=rawData.replace("u'","'");
	data=json.loads(rawData);
	tranHex = data["hex"];
	broadcastScript = generateBroadcastScript(tranHex);
	finalRes = subprocess.check_output(broadcastScript, shell=True);
	print finalRes;
	print "--------------------------";


def generatePayScript(_wallet,_to,_amount):
	tranFee = calculateTransFee(_amount);
	# print "~/Desktop/Electrum-2.6.4/electrum payto " + walletsList.get(_to)[1]
	script = "electrum payto " + str(walletsList.get(_to)[1]) + " " + str(_amount) + " --wallet " + walletBaseAddress + _wallet + " --fee 0.0001 --password " + str(walletsList.get(_wallet)[0]);
	return script;

def generateBroadcastScript(_hex):
	brScript = "electrum broadcast " + _hex;
	appendLog(brScript);
	return brScript;

def appendLog(_logMessage):
	print _logMessage;

def getBalance(_wallet):
	bal=[0,0];
	balanceScript = generateBalanceScript(_wallet);
	rawData = subprocess.check_output(balanceScript, shell=True);
	rawData=rawData.replace("u'","'");
	data=json.loads(rawData);
	if "confirmed" in data:
		bal[0] = float(data["confirmed"]);
	if "unconfirmed" in data:
		bal[1] = float(data["unconfirmed"]);
	return bal;


def generateBalanceScript(_wallet):
	script = "electrum getbalance --wallet " + walletBaseAddress + _wallet
	return script;


def updateUsersBalance():
	url= "geocoin.eca.ed.ac.uk"
	headers = { "charset" : "utf-8", "Content-Type": "application/json" }
	conn = httplib.HTTPSConnection(url)
	confirmed =0
	unconfirmed=0
	balance = 0
	for key in userWallets:
		balance = getBalance(userWallets[key])
		confirmed = balance[0]
		unconfirmed= balance[1]
		conn = httplib.HTTPSConnection(url)
		sample = "userId=" + str(key) +"&confirmed="+str(confirmed)+"&unconfirmed="+str(unconfirmed)
		#print key, sample;
		print key,balance
		# Send the JSON data as-is -- we don't need to URL Encode this
		conn.request("GET", "/updateUsersBalance.php?" + sample,"",headers)
		response = conn.getresponse().read()
		#print(response)

		conn.close()
def checkMarriages():
	print "checking whether a marriage is expired."

def makeMarriageTransactions():
	print "I will add a record to the transactions table based on how much money m1 got"


def getTransactions():
	url= "geocoin.eca.ed.ac.uk"
	headers = { "charset" : "utf-8", "Content-Type": "application/json" }
	conn = httplib.HTTPSConnection(url)
	# sample = { "temp_value" : 123 }
	# sampleJson = json.dumps(sample, ensure_ascii = 'False')
	# Send the JSON data as-is -- we don't need to URL Encode this
	conn.request("GET", "/getTransactions.php", "", headers)
	response = conn.getresponse().read()
	print(response)
	data=json.loads(response)
	updatedTrans_ids=""
	inProgressIds=""
	seperator = ","
	for i in range(len(data)):
		val = float(data[i].get("value"))/1000.0

		tId = data[i].get("id")
		toWallet = data[i].get("to")
		fromWallet=data[i].get("from")
		if(toWallet is not None and fromWallet is not None):
			try:
				if(abs(val)==float(999)/1000.0):
					bal = getBalance(fromWallet)
					val = bal[0]-0.0001
				if(val>0):
					payTo(fromWallet,toWallet,abs(val))
				elif(val<0):
					payTo(toWallet,fromWallet,abs(val))
			except Exception as e:
				inProgressIds+=tId+seperator
			else:
				updatedTrans_ids+=tId+seperator
			# if val>0.0:
			# else:
				# payTo(userWallets.get(userId),data[i].get("walletId"),abs(val));
	conn.close()
	if len(updatedTrans_ids)>0:
		updatedTrans_ids = updatedTrans_ids[:-1]
		conn = httplib.HTTPConnection(url)
		sample = "ids=" + updatedTrans_ids
		# Send the JSON data as-is -- we don't need to URL Encode this
		conn.request("POST", "/updateTransactions.php?" + sample,"",headers)
		conn.close()
	if len(inProgressIds)>0:
		inProgressIds = inProgressIds[:-1]
		conn = httplib.HTTPConnection(url)
		sample = "ids=" + inProgressIds
		# Send the JSON data as-is -- we don't need to URL Encode this
		conn.request("POST", "/updateInprogress.php?" + sample,"",headers)
		conn.close()
	updateUsersBalance();

#def getAllBalance(_wallet):


#print getBalance(walletName);
# payTo("default_wallet","positiveWallet_3",0.030);



getTransactions();

#UPDATE `point_zones` SET `walletId` = 'default_wallet' WHERE `zoneType` = 'oneoff'
