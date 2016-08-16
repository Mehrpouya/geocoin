# geocoin
Prototype as part of After Money project based at University of Edinburgh. Experimenting with digital currencies. **GPS based bitcoin transactions using electrum.**


# Moving to another server:
All wallets need to be restored by either using the electrum GUI or terminal.

#example command
electrum restore --wallet ~/.electrum/wallets/negativeWallet_3 "alone rest of the wallet seed"
and then you need to provide a password.

There is a payto script that I wrote that deals with transactions. This script will look at geocoin mysql database and based on that make bitcoin transactions using electrum python script. I used "watch" command to run the python code every 10 seconds, however It may be a better idea to run this every 20 seconds as electrum network's speed tents to fluctuate or this maybe caused by server processing power or internet speed.
example of a command for running the python payto file :

watch -n 10 python payto.py

-n XX means, run this every XX seconds. so for 20 seconds it will be
watch -n 20 python payto.py

Make sure to run this from the folder the script is located at otherwise include the file path in the command above.

- All files have been moved to DI amazon server.
- 45 user wallets, 5 positive and 5 negative wallets.
- Details of wallets been given to Dave and Bettina.


#database
Here is database EER Diagram

![EER Diagram](https://github.com/Mehrpouya/geocoin/blob/master/marriage%20database%20model.png)
