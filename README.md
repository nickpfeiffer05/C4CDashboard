# C4C Dashboard

## Instructions for Running
- Download Node.js if not already installed: https://nodejs.org/en
- Clone the repository: `git clone https://github.com/nickpfeiffer05/C4CDashboard/`
- Navigate into the local repository (called C4CDashboard)
- Install dependencies: `npm install`
- Run the application: `node server.js`
    - View application at http://localhost:3000
- The Authorization Key: C4C


## Overview of the Application 
This application lets users create a record of partner organizations, for those who have the correct authorization key. The program lets users enter a Partner organization name, a partner's company logo, a description of the partner, and an indicator of whether or not this company is in active partnership with C4C. 

The user can then search for partners by the name of the partner, where they can then see and edit the partner's information, like their name, activity status, description, and company logo. After searching, the user can also delete the partner from the records or return back to the adding partner menu. 

This program does persist the record of partners, meaning that if you add partners, close the program, and open it tomorrow, the partners and data will still be present and usable. It does this by writing and reading partner information to a local partners.json file. 

The bonus features I implemented were 1) ability to search for partners, 2) ability to directly edit an organization's information (including an option to delete a partner), 3) authorization control for who can view and make changes to partenr information, and 4) persistant data storage.


## Design choices 
The most significant design choice I made was to not use React. I used native HTML, CSS, and Javascript. I did this because I thought this projecct was very doable without React, and, particularly for web development, I usually try to avoid frameworks and libraries when they are not needed. I feel that every time I make an application using HTML, CSS, and Javascript, I greatly improve my overall web dev ability, and, in the past, I had trouble with getting lost in frameworks without fully understanding what's going on. So for small, learning based projects like this, I now like to avoid using frameworks whenever possible. I understand that there is a lot of value for frameworks like React, but simply for learning purposes I preferred to not use any frameworks. 

Another design choice was figuring out how to store and persist partner information. I thought that storing data to a local JSON file would be the most straightforward method, and actually did this recently in Java for a class. The data persistence turned out to be very effective, and storing the data as a class `Partner` made the implementation very simple. 


## What I Learned
One important idea that I learned was the value in creating reusable code. Much of my frontend and backend had repeated code. For example, many of my buttons had the same general style, and much of my backend logic relied on the same repeating ideas. As a result, I started to try to abstract and shorten my code whenever possible, which made me realize how important it is to create an application that is not only readable and concise but also maintainable. Now, if I want to add another button with the same styles, I have an exact set of styles that I can use, for example. If I knew this from the start, I would have first focused on creating reusable components that would have saved me a lot of time from copy and pasting. 

Another aspect that I learned from this project was persisting data using JSON. As I mentioned earlier, I have very recently had several opportunities (including this one) to learn JSON for the first time, and I think this understanding is very valuable to have. 

One thing that I would do differently is the authentication. I ran out of time for this implementation, the authentication as of now is actually very insecure. The current method of authentication is purely client side, and therefore not actually secure at all. For example, any user could simply paste in the main page URL and bypass the authentication entirely. If I had more time, I would have prevented this and also tried to learn more about sessions and allowing users to stay logged in for a certain amount of time.

Another thing that I would have implemented is a full display of every partner that C4C has. Currently, you have to search for specific partners, which can be a little tedious if you don't know their names already. I simply did not have time to design a new search page that could store multiple partner's information and display it all at once. 

Also one thing that I just rememberd (as I am running out of time) is that my application is not fully responsive. I actually designed the frontend so it can easily be made responsive (the card in the center design), however, I realize now that I forgot to implement that. Currently, when the width of the window shrinks, the content in the center also shrinks, when what should happen is the background should just get smaller and smaller. I don't think this would be that difficult to implement, though.

The main issue that I ran into was figuring out how I wanted the application to flow, and the different pages and links that all connected to each other. I started off by just diving into the coding, and after a certain point, I realized that I didn't really have a good plan for how to move forward. So, I took a step back, and focused on drawing out how I wanted my application to look and how I wanted it to be used. I focused on user experience and actually fully planned out how I wanted the application to flow between the differnet pages (auth, add, search, and search results). I realize now that I should have done this from the beginning, and I now know the value in extensive planning. 

I implemented all the bonus features listed (also listed above) because I thought they were very doable and would really elevate the quality of this application. I didn't want to create a purely frontend program, and I really wanted to test my ability with creating a backend that can handle a variety of requests and data parsing, and I think it created a much more interesting application as a result. 
