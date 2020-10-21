const inquire = require("inquirer");
const fs = require("fs");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

let teamList = [];
const mgrInfo = [
    {
        type: "input",
        name: "name",
        message: "What is the manager's last name?",
        validate: async (input) => {
            if (input == "" || /\s/.test(input)) {
                return "You must enter a last name.";
            }
            return true;
        }
    },
    {
        type: "input",
        name: "email",
        message: "What is the manager's email?",
        // Validate email per stack overflow: https://stackoverflow.com/questions/52456065/how-to-format-and-validate-email-node-js
        validate: async (input) => {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
                return true;
            }
            return "You must enter a valid email address.";
        }
    },
    {
        type: "input",
        name: "officeNumber",
        message: "What is the manager's office number?",
        validate: async (input) => {
            if (isNaN(input)) {
                return "You must enter a number";
            }
            return true;
        }
    },
    {
        type: "list",
        name: "moreTeam",
        message: "Are there any more team members?",
        choices: ["Yes", "No"]
    }
]

const empInfo = [
    {
        type: "input",
        name: "name",
        message: "What is the employee name:",
        validate: async (input) => {
            if (input == "") {
                return "You must enter a last name.";
            }
            return true;
        }
    },
    {
        type: "input",
        name: "email",
        message: "Enter their email:",
        // Validate email per stack overflow: https://stackoverflow.com/questions/52456065/how-to-format-and-validate-email-node-js
        validate: async (input) => {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
                return true;
            }
            return "You must enter a valid email address.";
        }
    },
    {
        type: "list",
        name: "role",
        message: "What is their role?",
        choices: ["engineer", "intern"]
    },
    {
        when: input => {
            return input.role == "engineer"
        },
        type: "input",
        name: "github",
        message: "What is your github username?",
        validate: async (input) => {
            // Search for whitespace characters string
            if (input == "" || /\s/.test(input)) {
                return "Please enter a valid GitHub username";
            }
            return true;
        }
    },
    {
        when: input => {
            return input.role == "intern"
        },
        type: "input",
        name: "school",
        message: "What is the name of the school you attend?",
        validate: async (input) => {
            if (input == "") {
                return "You must enter a school name.";
            }
            return true;
        }
    },
    {
        type: "list",
        name: "addAnother",
        message: "Are there any more team members to add?",
        choices: ["Yes", "No"]
    }
]

function start() {
    inquire.prompt(mgrInfo).then(mgrData => {
        let teamManager = new Manager(mgrData.name, 1, mgrData.email, mgrData.officeNumber);
        teamList.push(teamManager);
        if (mgrData.moreTeam === "Yes") {
            teamCreate();    
        } else {
            teamHtmlCreate();
        }
    })
}

function teamCreate() {
    inquire.prompt(empInfo).then(empData => {
        if (empData.role == "engineer") {
            var newMember = new Engineer(empData.name, teamList.length + 1, empData.email, empData.github);
        } else {
            var newMember = new Intern(empData.name, teamList.length + 1, empData.email, empData.school);
        }
        teamList.push(newMember);
        if (empData.addAnother === "Yes") {
            console.log(" ");
            teamCreate();
        } else {
            teamHtmlCreate();
        }
    })
}

function teamHtmlCreate() {
    let newFile = fs.readFileSync("./templates/main.html")
    fs.writeFileSync("./output/team.html", newFile, function (err) {
        if (err) throw err;
    })

    for (member of teamList) {
        if (member.getRole() == "Manager") {
            memberHtmlCreate("manager", member.getName(), member.getId(), member.getEmail(), "Office: " + member.getOfficeNumber());
        } else if (member.getRole() == "Engineer") {
            memberHtmlCreate("engineer", member.getName(), member.getId(), member.getEmail(), "Github: " + member.getGithub());
        } else if (member.getRole() == "Intern") {
            memberHtmlCreate("intern", member.getName(), member.getId(), member.getEmail(), "School: " + member.getSchool());
        }
    }
    // Append team data to main html file with relative closing tags added
    fs.appendFileSync("./output/team.html", "</div></main></body></html>", function (err) {
        if (err) throw err;
    });
    console.log("team.html page successfully completed.")

}

function memberHtmlCreate(memberType, name, id, email, propertyValue) {
    let data = fs.readFileSync(`./templates/${memberType}.html`, 'utf8')
    data = data.replace("nameMember", name);
    data = data.replace("idMember", `ID: ${id}`);
    data = data.replace("emailMember", `Email: <a href="mailto:${email}">${email}</a>`);
    data = data.replace("propertyRole", propertyValue);
    fs.appendFileSync("./output/team.html", data, err => { if (err) throw err; })
}

start();