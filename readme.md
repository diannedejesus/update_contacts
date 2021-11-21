# UPDATE CONTACT
**Built by Dianne De Jesus; No current reviewers**
  
## Description
Create a unique link for a client list which will permit them to update their contact information.

## Functional Description
The application will connect to an outlook exchange account and import the contact list, timestamping the import. The list will be filtered by job title. Then a unique access link will be generated for each contact. This link will be used as an identifer for the contact. Then a separate database will be filled for the user application. It will contain only name and link/identifier for security purposes.
- the import will be timestamped the day of import or have the last modified date.
- filtering by job title since that is the field we use to identify type of contact.
- connection by outlook exchange since that is what the company uses, through the soap protocal and EWS
- the number of contacts will be less then 100 so the access link can be unique but managable as a manual entry
- the data will be used to fill a separate database, the user data entry has no need to access all the contact information so that will be kept seperate with other none sensitive information.

The user application will consist of a form where the user will be able enter and submit their contact information. If they use a unique link then their name will be auto filled. Clear instruction will be placed onscreen and warnings will show up to explain the importance of updating their data.
- The instruction will state that in order to erase information and not replace it, they will need to call or email us.
- if the unique link is not used then the linkid will be left empty and a match will be found during the verification process. 


When the form is submitted it will be added to a submit database with a timestamp where it can be reviewed before updating the outlook database. The user will recieve a visual confirmation of the submitted data and if an email was provided then we will send a confirmation by email.
- form can be submitted partially filled but needs at least name
- the person will be informed of importance of updating all information, especially email if partially full.
- repeated data will just be stored in database, this is not an issue due to the small scale use of the application.
- The visual confirmation is a thanks page with the information displayed with time and date for printing and we will indicate that an email was sent (if no error occurred and if an email is on file).


The application will also track the click through information of the links. How many times the link was accessed and if information was submitted.
- This will be stored in the names database since it has a simple reference to each contact and ideally not have any repeated info like the submitted databse.
- as soon as the link is accessed the access count is incremented. If possible a measure can be implemented to avoid multiple counts for same session but should not be an issue if this is not possible.
- if the submit button is pressed without errors the submit count will be incremented.

### Databases
* historic data/initial import
    - name
    - phones
    - postal address
    - email
    - link
    - timestamp
* name reference (reference for main access aka not through unique link)
    - name
    - link
    - access count
    - submitted count
* submitted information
    - name
    - phones
    - postal address
    - email
    - email use
    - link
    - timestamp
    - synced



<!-- With this section, you’re trying to answer a simple question: What does the software do? Of course, to answer this question thoroughly, you’ll need to dig a little deeper. In your functional description, you should cover error handling, one-time startup procedures, user limitations, and other similar details.  -->

## User/Client Interface
<!-- There’s a good chance your coding project is going to be an application, which means it will have a user interface. (If your project is a library or something similar, there won’t be an interface.) As clients, UX designers, and programmers discuss and plan the user interface, it’s easy for the lines to get crossed. If the client doesn’t adequately communicate their vision, your teams might build out the user interface only to have the design shot down.  

Here’s the good news: These mishaps are, for the most part, entirely avoidable. You just need to discuss a few questions with the client before you start developing. Do certain elements of the interface change (animations)? Which elements are buttons? How many unique screens can the user navigate to? And, of course, what does all of this actually look like?

And there’s more good news: Wireframe diagrams can help you answer all of these questions! As your client shares their vision for the user interface (perhaps sending rough sketches), your teams should build out wireframe diagrams.

Once these wireframes are approved by the client, include them in the user interface section of your software design document.

illustration of people working together
Learn how to create a low-fidelity wireframe in Lucidchart to include within your software design document. -->

## Goals and milestones
- outlook connection implementation
    * import contacts
- id generator
- timestamp handler
- click through handler
- user view
- receipt/submit view
- admin view
- database implementation
- [additional Feature] dashboard with visualizations
- [additional Feature] 
- [Wishlist] 

## Bugs and Issues
- EWS Restriction filter not working
- EWS Selecting only needed properties not clear when mutiple are needed


<!-- Instead of approaching your project as a single drawn-out process, you might find it helpful to break it down into more manageable pieces. (This is true for the project’s timeline and the code itself.) At the most macro level, you have an overarching goal: What problem is your software addressing? Who will be using it?

Below that, you have a set of milestones. Milestones are essentially checkpoints—they help stakeholders know when certain aspects of the project will be completed. These milestones are for both internal use and external use. Within your team, they help keep your engineering team on track. You can also use them to show the client measurable steps your teams are taking to finish the project.  -->

<!-- ## Prioritization
As you begin to break the project into smaller features and user stories, you’ll want to rank them according to priority. To do this, plot each feature on a prioritization matrix, a four-quadrant graph that helps you sort features according to urgency and impact. The horizontal axis runs from low to high urgency; the vertical axis runs from low to high impact.

Based on the quadrant each feature falls into, decide whether to include it in your minimum viable product (MVP). Features in the upper-right quadrant (high urgency, high impact) should be included in your MVP. With features in the bottom-right (high urgency, low impact) and upper-left (low urgency, high impact) quadrants, use your discretion to decide if they are a part of your MVP. Features in the bottom-left quadrant (low urgency, low impact) should not be included in your minimum viable product.

## Current and proposed solutions
You’re building software to address a problem, but yours might not be the first attempt at a solution. There’s a good chance a current (or existing) solution is in place—you’ll want to describe this solution in your SDD. 

You don’t need to get into the tiny details, but should at least write up a user story: How does a user interact with that solution? How is data handled?

Next, you’ll want to include a section outlining your proposed solution. If there’s an existing solution in place, why is your proposed solution needed? Now’s your chance to justify the project. You’ll want to explain this in as much technical detail as possible—after reading this section, another engineer should be able to build your proposed solution, or something like it, without any prior knowledge of the project.

## Timeline
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
