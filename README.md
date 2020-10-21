# Employee Summary - Template Engine  
___
## Objective
Build a Node CLI that takes in information about employees and generates an HTML webpage that displays summaries for each person.  Also, ensure that all unit tests pass.

___
## Layout:
The application, **app.js**, will prompt the user for information about the team manager and then information about the team members. The user can input any number of team members, and they may be a mix of **engineers** and **interns**. The app must also pass all unit tests (**Employee.test.js, Engineer.test.js, intern.test.js, Manager.test.js**). When the user has completed building the team, the application will create an HTML file, **team.html**, that displays a nicely formatted team roster based on the information provided by the user. The dependencies are, [jest](https://jestjs.io/) for running the provided tests, and [inquirer](https://www.npmjs.com/package/inquirer) for collecting input from the user.  
HTML templates for each type of user are created to build the completed **team.html** file:
- engineer.html
- intern.html
- main.html
- manager.html
___
## Summary

