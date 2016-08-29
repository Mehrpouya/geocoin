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
  - There is a config.ini file that has the authentication parameters in it, because of security purposes, I have copied a this on project external hard drive.
- bitcoin python "payto.py" file. This will take care of wallet transactions.
  - There is a shell script repeatFetch.sh, which will run the payto.py code indefinitely.

#### payto.py
payto script deals with transactions. This script will look at geocoin mysql database and based on the active transactions in there it will make bitcoin transactions using electrum python script.
I used "watch" command to run the python code every 10 seconds, however It may be a better idea to run this every 20 or XX seconds as electrum network speed tents to fluctuate.

## Moving to another server:
In case you want to move this application to a new server, these are the steps you need to follow:

1. All wallets need to be restored by either using the electrum GUI or terminal.
2. If you don't have the geocoin database, run the following scripts in the same order as below in your mysql query interface:
  1. [Geocoin database & table creation script]("https://github.com/Mehrpouya/geocoin/blob/master/serverside/geocoin_app%20Create%20database%20structure%20script.sql")
  2. [Wallets table data]("https://github.com/Mehrpouya/geocoin/blob/master/serverside/geocoin_app%20data%20for%20wallets.sql")
3. From ["serverside folder"]("("https://github.com/Mehrpouya/geocoin/blob/master/serverside/") upload all php files including the dbconfig to the public_html or www folder of your new server.
  - Make sure you update the dbconfig.ini to have correct authentication information.
4. Depending on which project you decide to migrate to a new server:
  - Copy all the files and folder of one of the three into your new server
      - [Basic Geocoin](##Links "Basic geocoin")
      - [Marriage web app](##Links "Marriage web app")
      - [Charity web app](##Links "Charity web app")

###1.Example command and how to restore wallets
####Through terminal
electrum restore --wallet ~/.electrum/wallets/negativeWallet_3 "Replace this with the seed for the wallet you are restoring"
and then you need to provide a password for it. Doesn't have to be the same as before.

####Through Electrum GUI





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
