----------------------- README - Firebase Fullfillment -----------------------

Testing in the dialogflow console and google assistant results in different JSON requests.
Keep this in mind when testing. Testing from the console uses outputContext[2], whereas
testing uses outputContext[6]. The changes neccessary to switch test env are commented in 
the code.