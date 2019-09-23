## Building the chrome extension

* Install Node.js v10.9.0 or greater.
* Development Environment
    Node: 10.9.0
    Angular CLI: 8.1.3
    Angular: 8.1.3
    Ionic: 4.12.0
    typescript: 3.4.5
    webpack: 4.35.2
* Clone this repository.
* Run `npm install` from the project root.
* Run `ng build` from the project root.
* Go to www folder and replace the content of index.html entirely with the content of popup.html
* Now in the chrome broswer go to extension and enable developer mode
* Click on upload unpacked extension and point to the www folder under the project
* Hooray now the extension appears in the browser tool bar

* There is a bug that most of the time google authentication frame once complete the task will also close the 0xO chrome extention. TO avoid this, once selected your gmail account you want to use and before the google authentication frame closes click inside the open 0xO browser extension window so it remains active. Thank you! 
