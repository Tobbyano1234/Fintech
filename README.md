# FINTECH.CO Challenge

# Problem Statement

The program you are supposed to developed should have the following range of functions:

- FINTECH CO. celebrates its company anniversary and wants to invite all customers (in customers.txt) located within a 100km radius. In order to be able to plan the event, we need the customer IDs of the customers that should be invited.
- The coordinates of FINTECH CO. are: 52.493256, 13.446082
- The formula which calculates the distance between two coordinates is called Great-Circle
  Distance.
- Customer data were exported from the CRM system (customers.txt). Each customer
  corresponds to one row. For each customer, the customer ID and the coordinates of the
  company address were exported.
- If there is too little or invalid data for some clients, a warning should be given. The process
  should not be terminated by that.
- Please publish out all customer IDs of customers that should be invited in alphabetical
  order(ascending) to a message broker (e.g. RabbitMQ) and set up a simple client that reads the messages from the broker and prints them to the console.

How To Install And Run The App
clone the repo from the develop branch and run the following commands \*[x] Note: clone from develop branch for testing purpose

install all dependencies
npm
compile all typescript before running the program
npm run compile
npm run start:publisher to send the datas to the client for publishing
npm run start:client to print the datas on the console
