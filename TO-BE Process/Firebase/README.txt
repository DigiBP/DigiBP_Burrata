----------------------- README - Firebase Fullfillment -----------------------

The fullfillment in dialogflow is done via firebase fullfillment in the google cloud.

A description as business process model of how the code works can be found under:
https://github.com/DigiBP/DigiBP_Burrata/wiki/Technical-Documentation#process-preparation-in-dialogflow


** Important for testing 
Testing in the dialogflow console and google assistant results in different JSON requests.
Keep this in mind when testing. Testing from the console uses outputContext[2], whereas
testing uses outputContext[6]. The changes neccessary to switch test env are commented in 
the code.
