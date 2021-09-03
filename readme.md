# Booking Office Meetings
**Built by Dianne De Jesus; No current reviewers**
  
## Functional Description
This application will permit the user to create a custom link with available dates for a client to select (only a single date can be chosen). Once the client selects a date, it will be added to the user's calendar. The user will be notified which date was selected by email and the client will recieve a confirmation email.

### User Interfase Description
The user will be able to create date/time slots for a client to select. They will include the clients information and other details pertinate to the appointment. A link will be generated and sent to the client by email.

#### User Interfase Data & Functionality
User Input:
- Client: name [string]
- Appointment: Description [string], duration [number], location [string]
- Slots: Date [date], time [date]
    - slots will be saved as an array, the user will be able to add and remove slots before saving
 
 Additional Data:
 - unique link id [string]
 - isFilled [boolean] (data availability)

Date Selection:
The user with be able to add as many date/time slots as need, ideally we will be able to verify the selected dates againts the users calendar to verify if the date is already filled. We will not limit or check if the date was included in another client list. The same date can be given to multiple clients, the first to select it get the date.

Date Verification:
- filled dates will be collected from the users calendar
- A local copy might help with speed, but update timing will be an issue
- data must be organised to facilite lookup

confirm/save:
Data will be saved to a database along with unique identifier for the client link

<!-- delete:
permitly removes an appointment selection -->


### Client Interfase Description
The client will see the times/dates available for the specified appointment and the details for the appointment. When a date is selected they will need to confirm the selection. Once the selection is confirmed the user will recieve an email and the date will be added to the user's calendar. The client will also recieve an email.

#### Client Interfase Data & Functionality
A set of buttons will allow the client to choose a sinlge time slot. An option for emailing user if no dates fit the clients schedule. Once it is confirmed then two emails will be sent.
- one to client
- one to the user

After the date is selected only the selected date and appointment details will be displayed.


<!-- With this section, you’re trying to answer a simple question: What does the software do? Of course, to answer this question thoroughly, you’ll need to dig a little deeper. In your functional description, you should cover error handling, one-time startup procedures, user limitations, and other similar details.  -->

## User/Client Interface
<!-- There’s a good chance your coding project is going to be an application, which means it will have a user interface. (If your project is a library or something similar, there won’t be an interface.) As clients, UX designers, and programmers discuss and plan the user interface, it’s easy for the lines to get crossed. If the client doesn’t adequately communicate their vision, your teams might build out the user interface only to have the design shot down.  

Here’s the good news: These mishaps are, for the most part, entirely avoidable. You just need to discuss a few questions with the client before you start developing. Do certain elements of the interface change (animations)? Which elements are buttons? How many unique screens can the user navigate to? And, of course, what does all of this actually look like?

And there’s more good news: Wireframe diagrams can help you answer all of these questions! As your client shares their vision for the user interface (perhaps sending rough sketches), your teams should build out wireframe diagrams.

Once these wireframes are approved by the client, include them in the user interface section of your software design document.

illustration of people working together
Learn how to create a low-fidelity wireframe in Lucidchart to include within your software design document. -->

## Goals and milestones
- Get the connection between the exchange server and nodejs established. [completed]
- Get a basic MVC nodejs working for the user and client interfase. [completed]
- Design the data schemas needed
- Determine the login format for the app.
- Verify authentication process for exchange servers
- Get email and calendar interation with app.
- [Feature] Verify that date/times don't overlap
- [Feature] Calendar display
- [Wishlist] Verify holidays and vacation days
- [Wishlist] limit access to link by email


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
