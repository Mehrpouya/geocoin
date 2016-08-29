# Geocoin Documentation
Prototype as part of After Money project based at University of Edinburgh. Experimenting with digital currencies. **GPS based bitcoin transactions using electrum.**


##How different parts of the software work
there are three applications, [Basic Geocoin](##Links "Basic geocoin"), [Marriage web app](##Links "Marriage web app") and [Charity web app](##Links "Charity web app").

Due to back-end and database changes the [Basic Geocoin](##Links "Basic geocoin") and [Charity web app](##Links "Charity web app") needs to be updated to work with the current back-end.

###How these apps function:

####Different part of the apps:
each app consists of:
- front-end (js,html,css) files.
- back-end php files to communication with Mysql database
  - There is a [dbconfig.ini](##Links "dbconfig.ini") file that has the authentication parameters in it, because of security purposes, I emptied the authentication details, when migrating to new servers either put them in by hand or copy them from project external hard drive.
- bitcoin python "payto.py" file. This will take care of wallet transactions.
  - Make sure to put in all the details of each wallet as show in the example inside this file.
  - There is a shell script repeatFetch.sh, which will run the payto.py code indefinitely.

So you need to update the section below inside the payto.py with list of all wallets.
```
walletsList = {"wallet_name_1":["password1","address1"],
               "wallet_name_2":["password2","address2"],
               "rest of the wallets" : ["passwordX","AddressX"]}

userWallets = {"userId":"walletName",
               "userId":"walletName"}
```
#### payto.py
payto script deals with transactions. This script will look at geocoin mysql database and based on the active transactions in there it will make bitcoin transactions using electrum python script.
I used "watch" command to run the python code every 10 seconds, however It may be a better idea to run this every 20 or XX seconds as electrum network speed tents to fluctuate.

## Moving to another server:
In case you want to move this application to a new server, these are the steps you need to follow:

1. Server requirements:
  - PHP and MySQL installed
  - Electrum installed
  - Have user rights to be able to copy files into server
  - Rights run shell scrips
  - admin rights on MySQL to create database, table and procedures.
2. All wallets need to be restored by either using the electrum GUI or terminal.
3. If you don't have the geocoin database, run the following scripts in the same order as below in your mysql query interface:
  1. [Geocoin database & table creation script]("https://github.com/Mehrpouya/geocoin/blob/master/serverside/geocoin_app%20Create%20database%20structure%20script.sql")
  2. [Wallets table data]("https://github.com/Mehrpouya/geocoin/blob/master/serverside/geocoin_app%20data%20for%20wallets.sql")
4. From ["serverside folder"]("("https://github.com/Mehrpouya/geocoin/blob/master/serverside/") upload all php files including the dbconfig to the public_html or www folder of your new server.
  - Make sure you update the dbconfig.ini to have correct authentication information.
5. Depending on which project you decide to migrate to a new server:
  - Copy all the files and folder of one of the three into your new server
      - [Basic Geocoin](##Links "Basic geocoin")
      - [Marriage web app](##Links "Marriage web app")
      - [Charity web app](##Links "Charity web app")
6. Run the python payto.py file on the new server



###2.Example command and how to restore wallets
####Through terminal
electrum restore --wallet ~/.electrum/wallets/negativeWallet_3 "Replace this with the seed for the wallet you are restoring"
and then you need to provide a password for it. Doesn't have to be the same as before.

####Through Electrum GUI
1. Open electrum GUI
2. Either press Ctrl + N or go to "File" => new/restore
3. Choose a name for the wallet you want to restore
4. Choose restore wallet or import keys like the image below
  ![Choose restore wallet or import keys like the image below](https://github.com/Mehrpouya/geocoin/blob/master/restoreWallet.png)
5. Type in or copy and paste the seed for the wallet you are restoring.
  ![seed](https://github.com/Mehrpouya/geocoin/blob/master/restoreWallet2.png)
6. Next and done...

###6. Running the payto.py
####example of a command for running the python payto file:

**watch** -n 10 python payto.py

**-n XX** means, run this command every **XX** seconds. so for 20 seconds it will be
watch -n **20** python payto.py

Make sure to run this from the folder the script is located at, or make sure to include the file path in the command above.





#Database
Here is the database EER Diagram
Please note in the current version of the software the foreign keys are not in place. This won't affect the application, but as a good practice, next developer may want to add them.
![EER Diagram](https://github.com/Mehrpouya/geocoin/blob/master/marriage%20database%20model.png)

And scripts for restoring the databese on a new server:

1. [Geocoin database & table creation script](##Links "Geocoin database & table creation script")

2. [Wallets table data](##Links "Wallets table data")



##Links:
- [Basic geocoin](https://github.com/Mehrpouya/geocoin/tree/master/basicGeocoin "Basic geocoin")

- [Marriage web app](https://github.com/Mehrpouya/geocoin/tree/master/marriage "Marriage web app")
- [Charity web app](https://github.com/Mehrpouya/geocoin/tree/master/charity "Charity web app")
- [EER Diagram](https://github.com/Mehrpouya/geocoin/blob/master/marriage%20database%20model.png)
- [Geocoin database & table creation script]("https://github.com/Mehrpouya/geocoin/blob/master/serverside/geocoin_app%20Create%20database%20structure%20script.sql")
- [Wallets table data]("https://github.com/Mehrpouya/geocoin/blob/master/serverside/geocoin_app%20data%20for%20wallets.sql")
- [dbconfig.ini]("https://github.com/Mehrpouya/geocoin/blob/master/dbconfig.ini")
