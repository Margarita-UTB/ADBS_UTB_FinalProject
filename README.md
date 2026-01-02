# ADBS_UTB_FinalProject
Final project made in the subject Advance Database Systems at TBU

General description:

Develop two software applications: an API (backend) and a client app (web, mobile, console, etc).
You can choose any technology/language of your preference for the backend and the client app.
The client app displays information from a MongoDB collection using an API as facilitator.
It is also possible to add, edit, or delete records in the client application.
MongoDB collection specification:

Create two collections 
Each collection is described by at least 3 fields 
Each collection contains at least 5 documents.
There must be a common field between both collections (typically, an ID).
One of the collections must define a text (search) index.
API Project specification:

The API must expose at least 7 endpoints:
Get all documents from one collection
Get one document by id (two endpoints, one for each collection)
Get all documents by search (use the text index here)
Add a document (in one collection)
Edit a document (in one collection)
Delete a document (in one collection)
Client app specification:

There are two screens (Home and Details) at least:
Home screen 
It presents all documents from one collection by default.
It is possible to filter documents (by using the search endpoint)
When one document is selected, it navigates to the Details screen
It also includes a button (New). When it is pressed, it navigates to the Details screen.
Details screen
It presents the information of the selected document from Home
By using the common field between the two collections, the details of a specific document is presented too (for example, if you have Employees and Departments, you can see the selected Employee Details along wit the Department Name to which it belongs).
There are three buttons:
Edit (it updates the document) 
Delete (it removes the document)
New (only available if the user clicked the button from Home, it adds a new document)
After pressing any of the buttons and performing the respective task, navigate back to Home and refresh the view to present the latest available data.
