# UPDATE CONTACT
**Built by Dianne De Jesus; No current reviewers**
  
## Description
Create a unique link for a client list which will permit them to update their contact information.

## Functional Description
The application connects to an outlook exchange account and imports the contact list, timestamping the import with the current date. The list is filtered by job title. Then a unique access link is generated for each contact. This link is used as an identifer for the contact across the different databases. Then a separate database will be filled for the user application. It contains only name and link/identifier from the original import for security purposes; it also will be the location for tracking data asociated with the contact.

- the import will be timestamped the day of import [ would like to have the last modified date but it doesn't seem that the last modified date is available on exchange]
- filtering by job title since that is the field we use to identify the type of contact.
- connection by outlook exchange since that is what the company uses, through the soap protocal and EWS
- the number of contacts will be less then 200 so the access link can be unique but managable as a manual entry
- the data will be used to fill a separate database, the user data entry has no need to access all the contact information so that will be kept seperate with other none sensitive information.

The user application will consist of a form where they will be able to enter and submit their contact information. If they use a unique link then their name will be auto filled. Clear instruction will be placed onscreen and warnings will show up to explain the importance of updating their data.

- The instruction will state that in order to erase information and not replace it, they will need to call or email us.
- if the unique link is not used then the linkid will be left empty and a match will be found during the submission process. 


When the form is submitted it is be added to a submit database with a timestamp where it can be reviewed before updating the outlook database. The user will recieve a visual confirmation of the submitted data and if an email was provided then we will send a confirmation by email. If no email was provide the application will verify it an email is present for the user (only if link was used to enter data), if none is found a message will be presented to the user.

- form can be submitted partially filled but needs at least the full name
- the person will be informed of importance of updating all information, especially email if partially full.
- repeated data will just be stored in database, this is not an issue due to the small scale use of the application.
- The visual confirmation is a thanks page with the information displayed with time and date for printing and we will indicate that an email was sent (if no error occurred and if an email is on file).


The application will also track the click through information of the links. How many times the link was accessed and if information was submitted.

- This will be stored in the names database since it has a simple reference to each contact and ideally not have any repeated info like the submitted databse.
- as soon as the link is accessed the access count is incremented. If possible a measure can be implemented to avoid multiple counts for same session but should not be an issue if this is not possible.
- maybe count failed submits and why they failed

In the comparison and verification process the historical data will be displayed along side the submitted data. It will visualize what has changed from the historical data. The user will be able to select which fields they wish to include in the update. When submited it will add the information to the verified database and the date of the verification of the data will be added to the submit database. When accessing the compare page again this data will be disabled since it was already modified and the verified data will be displayed.


### Databases
* historic data/initial import
    - name
    - phones
    - postal address
    - email
    - link
    - timestamp
    - disabled
* name reference (reference for main access aka not through unique link)
    - name
    - link
    - access count
    - submitted count
* submitted information (may have repeats)
    - name
    - phones
    - postal address
    - email
    - email use
    - link
    - timestamp
    - verified
* verified information
    - name
    - phones
    - postal address
    - email
    - email use
    - link
    - timestamp
    - synced



<!-- Functional Descrition
 With this section, you’re trying to answer a simple question: What does the software do? Of course, to answer this question thoroughly, you’ll need to dig a little deeper. In your functional description, you should cover error handling, one-time startup procedures, user limitations, and other similar details.  -->

## User/Client Interface
### Login Page
![login page](https://github.com/diannedejesus/update_contacts/blob/main/login-signup.PNG?raw=true "Login Page")
***
### Signup Page
![signup page](https://github.com/diannedejesus/update_contacts/blob/main/signup-login.PNG?raw=true "Signup Page")
***
### Dashboard
![dashboard](https://github.com/diannedejesus/update_contacts/blob/main/dashboard.PNG?raw=true "Dashboard")
***
### Configure Page
![configure page](https://github.com/diannedejesus/update_contacts/blob/main/configure.PNG?raw=true "Configure Page")
***
### Submit Page
![submit page](https://github.com/diannedejesus/update_contacts/blob/main/submit-verification.PNG?raw=true "Submit Page")
***
### Compare Page
![compare page](https://github.com/diannedejesus/update_contacts/blob/main/compare.PNG?raw=true "Compare Page")
***
### Compare Page [verified data]
![compare page with verified data](https://github.com/diannedejesus/update_contacts/blob/main/compare2.PNG?raw=true "Compare Page [verified data]")

<!-- User Interfase
There’s a good chance your coding project is going to be an application, which means it will have a user interface. (If your project is a library or something similar, there won’t be an interface.) As clients, UX designers, and programmers discuss and plan the user interface, it’s easy for the lines to get crossed. If the client doesn’t adequately communicate their vision, your teams might build out the user interface only to have the design shot down.  

Here’s the good news: These mishaps are, for the most part, entirely avoidable. You just need to discuss a few questions with the client before you start developing. Do certain elements of the interface change (animations)? Which elements are buttons? How many unique screens can the user navigate to? And, of course, what does all of this actually look like?

And there’s more good news: Wireframe diagrams can help you answer all of these questions! As your client shares their vision for the user interface (perhaps sending rough sketches), your teams should build out wireframe diagrams.

Once these wireframes are approved by the client, include them in the user interface section of your software design document.

illustration of people working together
Learn how to create a low-fidelity wireframe in Lucidchart to include within your software design document. -->

## Goals and milestones
- [] Credentials: add or remove access to your contacts credentials.
    - [] Might elimanate the storage of this data and just ask user to verify everytime they want to access
- [] Delete and/or replace the local list of contacts (will erase all data)
- [] add a reference for empty link counting when database is first created
- [] Allow user to add a new entry to historic list (data can be added or disabled/enabled)
    - [additional feature] allow for adding a reason for disabling
- [] view for the verified data (most likey a list)



### Secondary Goals
- [] Format phones numbers to a standard representation

- [ ]Modify the admin view / dashboard
- [ ]Add input verification to receipt page for after the fact email entry
- [ ]Possibly track who enter an email after the fact for a receipt but does not want it associated to its account.
- [completed] Setup a verification for cases submitted without a link to associate it to an entry
    - [partial]make an option to permit the user to eliminate the non-relevant link
        -[]figure out how to make mongoose update / replace a field with similar data
    - [completed]include more information with the link to make it easier to identify the correct one from the incorrect one

### Wishlist Feature
- [ ][additional Feature] Collect submit fails with reason for fail
- [ ][additional Feature] Click through handler, session detection
- [ ][additional Feature] Compare and submit contact changes
- [ ][Wishlist] Dashboard with visualizations
- [ ][wishlist] find the structure of the information to use for limiting the import. Try to implement dynamicly.
    - [ ][wishist] will also be used to define the information to select from the data.    
- [ ][wishlist] integrate USPS address validity verification

### Completed
- [partial] Filter data (selection from outlook not working
- [completed] Review changes view
- [completed] Database implementation
- [completed] User view / form 
- [completed] Form error handling
- [completed] Receipt/submit view
- [completed] Connect to outlook
- [completed] Import contacts with timestamps
- [completed] Send email
- [completed] Generate unique link
- [completed] Fill names database
- [completed] fixed error with dashboard not counting the without link access amount
- [completed]Make sure the disabled entry stays disabled through out application.
    -[complete]Made sure the submit button was disabled if all data was already verified
- [completed]Make email dynamic ~~and have application look for an email if one is not provide in the submitted data.~~ [would override the data precations already implemented] if none found advice the user of importance, inability to provide email confirmation.
    - [completed]Add an option after the fact to include an email to send the confirmation.
- [partial] Click through handler
    - [completed] Implement display of data

## Bugs and Issues
- EWS Restriction filter not working
- EWS Selecting only needed properties not clear when mutiple are needed


<!-- NOTES
### Initial loading of information
The idea behind this part of the app is that the user can load information from another resourse (for contacts) like ms exchange. They will enter their credentials which will be verified. When the user selects to import the information they can choose a field by which to limit the import. And can select which value for the field to use.

When the information is loaded, it will be placed in two databases, one will contain the full information selected. A unique link will be generated for each entry. Then the name and associated unique link will be used to fill a seperate database. The app will count how many items were load into the two db and confirm to the user that the data was load. It will reload to a page that displays the data.
 
- seperate database with distint permision levels to avoid access to private data
- create process to verfiy credentials for reading and editiong contacts
- find the structure of the information to use for limiting the import. Try to implement dynamicly.
    - will also be used to define the information to select from the data.
- count the amount of data that was loaded into the database for display.
- add a reference for empty link counting
* Generate unique link

### Historic data display vs current data
The historic database will only have two options posibly three. You will be able to update the timestamp to show recent the data was changed, you can mark fields as disabled for data that is not relevent to the update process. Might posibly allow the addition of new entries for data that was not in the initial import.

Current data might be a manipulation of the submitted database and the historic database or a whole new database for this purpose. It will show what data has been submitted and what data has been passed on to outlook.

### Configure Page
- Credentials: add or remove access to your contacts.
    - Might elimanate the storage of this data and just ask user to verify everytime they want to access
- Delete and/or replace the local list of contacts (will erase all data)
- Import only works if no data is present, this to avoid duplicates
        - [additional] add duplicate detector
- Allow user to add a new entry to historic list (data can be added or disabled/enabled)
* [completed] Option for editing list. User can enable and disable contacts as a visual way of indicating these contacts do not need to be updated.
    - [additional] allow for adding a reason for disabling

### Update Page
* [unneeded] Seperate the field for last names, for visual representation since outlook only permits one field so it will still be stored as one value.
- integrate USPS address validity verification
- permit user to post a name to associate number phone number too
- [additional] Limit the type of phone numbers to match outlooks limits
- unify number and type array to avoid errors match number and type
- modify form verification code, either integrate a pgk or move it to make it more cleaner and change the way it process information to make it more intuitive for the user. Posible not use sessions for this data.


 -->

<!-- Break it down
 Instead of approaching your project as a single drawn-out process, you might find it helpful to break it down into more manageable pieces. (This is true for the project’s timeline and the code itself.) At the most macro level, you have an overarching goal: What problem is your software addressing? Who will be using it?

Below that, you have a set of milestones. Milestones are essentially checkpoints—they help stakeholders know when certain aspects of the project will be completed. These milestones are for both internal use and external use. Within your team, they help keep your engineering team on track. You can also use them to show the client measurable steps your teams are taking to finish the project.  -->

<!-- ## Prioritization
As you begin to break the project into smaller features and user stories, you’ll want to rank them according to priority. To do this, plot each feature on a prioritization matrix, a four-quadrant graph that helps you sort features according to urgency and impact. The horizontal axis runs from low to high urgency; the vertical axis runs from low to high impact.

Based on the quadrant each feature falls into, decide whether to include it in your minimum viable product (MVP). Features in the upper-right quadrant (high urgency, high impact) should be included in your MVP. With features in the bottom-right (high urgency, low impact) and upper-left (low urgency, high impact) quadrants, use your discretion to decide if they are a part of your MVP. Features in the bottom-left quadrant (low urgency, low impact) should not be included in your minimum viable product.
-->

<!-- ## Current and proposed solutions 
You’re building software to address a problem, but yours might not be the first attempt at a solution. There’s a good chance a current (or existing) solution is in place—you’ll want to describe this solution in your SDD. 

You don’t need to get into the tiny details, but should at least write up a user story: How does a user interact with that solution? How is data handled?

Next, you’ll want to include a section outlining your proposed solution. If there’s an existing solution in place, why is your proposed solution needed? Now’s your chance to justify the project. You’ll want to explain this in as much technical detail as possible—after reading this section, another engineer should be able to build your proposed solution, or something like it, without any prior knowledge of the project.
-->

<!-- ## Timeline
The milestones section of your SDD should provide a general timeframe for non-engineering stakeholders. This section is far more detailed and is mostly for the benefit of your engineering teams. In your timeline, include specific tasks and deadlines as well as the teams or individuals to which they’re assigned.  -->

<!--  -->
<!-- Pro tips for creating your software design documents
Just because you create a software design document and include each of the aforementioned sections doesn’t mean it’ll be effective. It’s a start, sure, but to get the most from your SDDs, keep these tips in mind. -->

<!-- Keep your language simple
When it comes to software design documents, clarity is key. There’s no need for flowery language and long, winding sentences—keep your sentences short and precise. Where appropriate, include bullet points or numbered lists. -->

<!-- Include visuals
Think back to your user interface section. Using wireframes, you’re able to accurately communicate a design that would be nearly impossible to describe in writing. You might find class diagrams, timelines, and other charts similarly useful throughout your SDD.  -->

<!-- Get feedback early
Your first draft of an SDD doesn’t necessarily need to be your last—it should be one of many. As you create a software design document for your project, send it to the client and other stakeholders. They might catch sections that need to be fleshed out or parts that are unclear that you missed. Once you’ve gotten their feedback, revise, revise, revise! -->

<!-- Update your SDD
Once you’ve written your software design document and gotten approval from stakeholders, don’t lock it away in some dusty drawer (or whatever the digital equivalent is). As your project progresses, team members should be referencing the SDD constantly. If there’s a delay, update your timeline. By treating an SDD as a living document, it will become an invaluable single source of truth. -->

<!-- 
------------- Look in to ------------------
[]perhap add a field for access link to be filled in manual if none is provided.
[]find a better method for names that is not seperating with $ and splitting
[]what if data failed to retrieve or not found?

[] {verify} What happens when an items is verified? Should user be able to keep submitting data or should the case be disabled.

[] {SORT OF EXTRA} add forget password option
[] {SORT OF EXTRA} obscure password entry
[] {SORT OF EXTRA} possibly change the comparison to the verified data when present

[] {extra} fix the display of comma when no address is present
[] {extra} update the dashboard view to have needed data, historical data list view might not be the most pertinent
- {extra} Import only works if no data is present, this to avoid duplicates
        - [additional] add duplicate detector
[] {extra} ensure the verified data db doesnt have duplicates
[] {extra} review ux to ensure it is understandable by user
[] {extra} create process to verfiy credentials for reading and editiong contacts
[] {extra} add the count of items to the submitlist page view and if the info has been verified already. Perhaps order it by verification status
[] {extra} modify the submitlist view to not include data since we will only be display unique values and won't represent all changes made. This includes timestamp.
- {extra} permit user to post a name to associate number phone number too
    - [additional] Limit the type of phone numbers to match outlooks limits
- {extra} unify number and type array to avoid errors match number and type
- {extra} modify form verification code, either integrate a pgk or move it to make it more cleaner and change the way it process information to make it more intuitive for the user. Posible not use sessions for this data.



-->
