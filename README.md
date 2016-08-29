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
- bitcoin python payto file. This will take care of wallet transactions.






## Moving to another server:
All wallets need to be restored by either using the electrum GUI or terminal.

##example command
electrum restore --wallet ~/.electrum/wallets/negativeWallet_3 "alone rest of the wallet seed"
and then you need to provide a password.

There is a payto script that I wrote that deals with transactions. This script will look at geocoin mysql database and based on that make bitcoin transactions using electrum python script. I used "watch" command to run the python code every 10 seconds, however It may be a better idea to run this every 20 seconds as electrum network's speed tents to fluctuate or this maybe caused by server processing power or internet speed.
example of a command for running the python payto file :

watch -n 10 python payto.py

-n XX means, run this every XX seconds. so for 20 seconds it will be
watch -n 20 python payto.py

Make sure to run this from the folder the script is located at otherwise include the file path in the command above.




#Database
Here is the database EER Diagram
Please note in the current version of the software the foreign keys are not in place. This won't affect the application, but as a good practice, next developer may want to add them.
![EER Diagram](https://github.com/Mehrpouya/geocoin/blob/master/marriage%20database%20model.png)




##Links:
- [Basic geocoin](https://github.com/Mehrpouya/geocoin/tree/master/basicGeocoin "Basic geocoin")

- [Marriage web app](https://github.com/Mehrpouya/geocoin/tree/master/marriage "Marriage web app")
- [Charity web app](https://github.com/Mehrpouya/geocoin/tree/master/charity "Charity web app")
