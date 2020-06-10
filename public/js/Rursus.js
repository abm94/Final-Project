//Iterum.js
//const BASE_URL = "http://localhost:8080";

//tasks sometimes fall out, the id changes when it is made again. 
//Sometimes the task disappears.
//check saving and loading to make sure the tasks end up where they're supposed to be.

const BASE_URL = "";



//change id gen convention

let list = document.getElementById("list");
let tButton = document.getElementById("addTaskButton");
let oButton = document.getElementById("addObjectiveButton");
let activityButton = document.getElementById("addActivityButton");
let inputItem = document.getElementById("itemInput");
let oInput=document.getElementById('objectivesTextInput');
let activityInput = document.getElementById('activitiesTextInput');
let saveButton = document.getElementById('saveButton');

let userCache;

const API_TOKEN = "password12345";
let newActivities = [];

function switchDisplays(){
    //Switch the first display out for the second one
    //Turn off flex for the main container
    document.querySelector('#firstDisplay').classList.add('invisible');
    document.querySelector('#secondDisplay').classList.remove('invisible');

    

   loadAll();
}

//Creates a new activity object on the array using data from the input bar

//Make a similar function for tasks and objectives

function getNextIndex() {
    
    return Date.now();
}

function deleteParent(input) {
    console.log(`deleting ${input}`);
    document.getElementById(`listItem${input}`).remove();
}


function generateObjective(text, whereTheObjectiveLands, addHere = -1) {
    if (!text.length) {
        return;
    }
    let totalItems = getNextIndex();
    if (addHere + 1) {
        totalItems = addHere;
    }
    let newstuff =
        `<li class="listItem objectiveItem" id="listItem${totalItems}">
            <div id="LIContent${totalItems}" class = "itemContent">${text}</div> <br/>
            <button type="submit" class="listItemButton checkButton" onclick="strikeThrough(${totalItems})" id="check${totalItems}">
                check
            </button>
            <button type="submit" class="listItemButton checkButton" onclick = "deleteParent(${totalItems})" id="delete${totalItems}">
                delete
            </button>
         </li>`;
    whereTheObjectiveLands.insertAdjacentHTML('beforeend', newstuff);
    console.log("added block ", newstuff, " at itemNumber ", totalItems);
}


function generateTask(text, whereTheTaskLands, addHere = -1) {
    if (!text.length) {
        return;
    }
    let itemNumber = getNextIndex();

    if (addHere + 1) {
        itemNumber = addHere;
    }

    let newstuff = `<li class="listItem taskItem" id="listItem${itemNumber}">
        <div id="LIContent${itemNumber}" class = "itemContent">${text}</div> <br/>
        <button type="submit" class="listItemButton checkButton" onclick="strikeThrough(${itemNumber})" id="check${itemNumber}">
            check
        </button>
        <button type="submit" class="listItemButton checkButton" onclick = "deleteParent(${itemNumber})" id="delete${itemNumber}">
            delete
        </button>
     </li>`;

    whereTheTaskLands.insertAdjacentHTML('beforeend', newstuff);
    console.log("added block ", newstuff, " at itemNumber ", itemNumber);

}

//Returns a ready-made activity.
//we might need to enable toggling for id
function newActivity(name, objectives = [],tasks = [],idNumber = -1) {
    let id;
    if (idNumber == (-1)){ 
        id = getNextIndex();
    }
    else{
        id = idNumber;
    }
    /*The new element has:
     * classes: listItem activityItem id: 'listItem${id}' 
     * */

    //Holder element
    let newElement = document.createElement("li");
    newElement.classList.add("listItem", "activityItem");
    newElement.id = `listItem${id}`;

    //Name
    let itemContent = document.createElement('div');
    itemContent.classList.add("itemContent");
    itemContent.id = `LIContent${id}`;
    itemContent.innerText = name;
    //add
    newElement.appendChild(itemContent);
    newElement.appendChild(document.createElement(`br`));

    //Bin
    let newBin = document.createElement('ul');
    newBin.classList.add("activityBin");
    newBin.id = `activityContentHolder${id}`;

    //insert children
    for (index in objectives) {
        newBin.appendChild(newObjective(objectives[index].name));
    }
    for (index in tasks) {
        newBin.appendChild(newTask(tasks[index].name));
    }

    //add to activity
    newElement.appendChild( newBin);


    //Add form for adding internally
    let form = document.createElement('form');
    form.classList.add("activityForm");
    

    //div to group input/button
    let tgrouper = document.createElement('div');
    tgrouper.classList.add("buttonInputGrouper");


    //input and button for tasks. Later: make a form to surround each pair.
    let tinput = document.createElement('input'); //Insert a <br> after this one
    tinput.classList.add("inActivityInput");
    tinput.id = `taskInput${id}`;
    tinput.type = "text";
    let tbutton = document.createElement('button');
    tbutton.classList.add("listItemButton", "checkButton","taskButton");
    tbutton.id = `taskButton${id}`;
    tbutton.type = "submit";
    tbutton.innerText = "Task";
    tbutton.addEventListener('click', (event) => {
        event.preventDefault();
        if (!document.getElementById(`taskInput${id}`).value) {
            return;
        }
        document.getElementById(`activityContentHolder${id}`).appendChild(newTask(document.getElementById(`taskInput${id}`).value));
        document.getElementById(`taskInput${id}`).value = "";

    });

    //put task section into form
    tgrouper.appendChild(tinput);
    tgrouper.appendChild(tbutton);
    form.appendChild(tgrouper);

    //make objective section
    let ogrouper = document.createElement('div');
    ogrouper.classList.add("buttonInputGrouper");
    let oinput = document.createElement('input');
    oinput.classList.add("inActivityInput");
    oinput.id = `objectiveInput${id}`;
    oinput.type = "text";
    let obutton = document.createElement('button');
    obutton.classList.add("listItemButton", "objectiveButton","checkButton");
    obutton.id = `objectiveButton${id}`;
    obutton.type = "submit";
    obutton.innerText = "Objective";
    obutton.addEventListener('click', (event) => {
        event.preventDefault();
        if (document.getElementById(`objectiveInput${id}`).value == "") {
            return;
        }
        document.getElementById(`activityContentHolder${id}`).appendChild(newObjective(document.getElementById(`objectiveInput${id}`).value));
        document.getElementById(`objectiveInput${id}`).value = "";

    });

    //add objective section to form
    ogrouper.appendChild(oinput);
    ogrouper.appendChild(obutton);
    form.appendChild(ogrouper);
    newElement.appendChild(form);

    //create delete button
    let deleteButton = document.createElement('button');
    deleteButton.classList.add("checkButton");
    deleteButton.id = `delete${id}`;
    deleteButton.type = "submit";
    deleteButton.innerText = "delete";
    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById(`listItem${id}`).remove();
    });
    //add delete button to activity.
    newElement.appendChild(deleteButton);

    return newElement;
}

function newTask(name, idNumber = -1) {
    let id;
    if(idNumber == (-1)){
        id = getNextIndex();
    }
    else{
        id = idNumber;
    }
    let li = document.createElement('li');
    li.classList.add("listItem", "taskItem");
    li.id = `listItem${id}`;

    let content = document.createElement('div');
    content.id = `LIContent${id}`;
    content.classList.add('itemContent');
    content.innerText = name;
    li.appendChild(content);

    let checkButton = document.createElement('button');
    checkButton.type = 'submit';
    checkButton.classList.add("listItemButton", 'checkButton');
    checkButton.id = `check${id}`;
    checkButton.innerText = "check";
    checkButton.addEventListener('click', (event) => {
        event.preventDefault();
        strikeThrough(id);
    });
    li.appendChild(checkButton);

    let deleteButton = document.createElement('button');
    deleteButton.type = 'submit';
    deleteButton.classList.add("listItemButton", 'checkButton');
    deleteButton.id = `delete${id}`;
    deleteButton.innerText = 'delete';
    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        deleteParent(id);
    });
    li.appendChild(deleteButton);

    return li;
}

function newObjective(name, idNumber = -1) {
    let newObjective = newTask(name,idNumber);

    newObjective.classList.remove("taskItem");
    newObjective.classList.add('objectiveItem');
    return newObjective;
}

function clearDatabase() {

    let url = (BASE_URL +'/clearAll');


    let settings = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'Application/JSON'
        }
    };
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                console.log(response);
                return;
            }
            throw new Error(response.statusText);
        })
        .catch(err => {
                console.log(err.message);
        });

    


}

function loadAll() {
    
    let seed = 0;
    
    let bin = document.getElementById('list');
    let type;
    let parent;
    let parentIndex;
    let totalItems;
    let returnedStuff = {};

    let url = (BASE_URL + "/all");
    settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'Application/JSON'
        }
    };
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
            for(i in responseJSON.activities){ 
                list.appendChild(
                    newActivity(
                        responseJSON.activities[i].name,
                        responseJSON.activities[i].objectives,
                        responseJSON.activities[i].tasks,
                        seed
                    )
                );   
                seed++;
            }
            for(j in responseJSON.objectives){
                list.appendChild(
                    newObjective(
                        responseJSON.objectives[j].name,
                        seed
                    )
                );
                seed++;
            }
            for(j in responseJSON.tasks){
                list.appendChild(
                    newTask(
                        responseJSON.tasks[j].name,
                        seed
                    )
                );
                seed++;
            }
        });

}

let newListItems=[];
let newCheckButtons=[];
let newDeleteButtons=[];
let newTextBoxes = [];



function strikeThrough(input){
    console.log(`striking through ${input}`);
    
    var parentText=document.getElementById(`LIContent${input}`);
    if(!parentText.matches(".strikeThrough")){
        parentText.classList.add("strikeThrough");
    }
    else{
        parentText.classList.remove("strikeThrough");
    }
}

function deleteParent(input){
    console.log(`deleting ${input}`);
    document.getElementById(`listItem${input}`).remove();
}



function postTask(name,id, activity=null){
    let url = (BASE_URL + "/task");
    
    let data = {
        name:name,
        id:id,
    };
    if(activity){
        data.activity = activity;
    }
    let settings = {
        method: 'POST',
        headers : {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }
    fetch(url,settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
        })
        .catch(err => {
            console.log(err.message);
        });
}

function postObjective(name,id,activity = null){
    
    
    let url = (BASE_URL + "/objective");
    
    let data = {
        name:name,
        id:id,
    };
    if(activity){
        data.activity = activity;
    }
    
   // console.log(data);
    let settings = {
        method: 'POST',
        headers : {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }
    fetch(url,settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
        })
        .catch(err => {
            console.log(err.message);
        });
}

function postActivity(name,id){
    let url = (BASE_URL + "/activity");
    
    let data = {
        name:name,
        id:id,
    };
    let settings = {
        method: 'POST',
        headers : {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }
    fetch(url,settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
        })
        .catch(err => {
            console.log(err.message);
        });
}


function save() {

    
    //save activities then objectives then tasks
    
    let activities = [];
    let objectives = [];
    let tasks = [];
    let currentObject = {};
    let children;
    
    let newObjects = document.getElementById('list').querySelectorAll("li");
    newObjects.forEach( (item,index) => {
        
        //Deal with the activities and their contents, then hit with a continue if found.
        if(item.classList.contains('activityItem')){
            //Loop through the li's in this one
            
            
            currentObject = {
                id: item.id,
                name:item.innerText
            };
            currentObject.name = item.querySelector('.itemContent').innerText;
            activities.push(currentObject);           
            
        }
        
        //After we check for activity, we can register the tasks and objectives. Don't forget to edit this part if we add tasks under objectives!
       
        //Adding an objective
        if(item.classList.contains('objectiveItem')){
            currentObject = {
                id: item.id,
                name:item.innerText,
                activity:null
            }
            currentObject.name = item.querySelector('.itemContent').innerText;
            
            if(item.parentElement.classList.contains('activityBin')){
                currentObject.activity = item.parentElement.parentElement.id;
            }
            
            objectives.push(currentObject);
            
        }
        
       //Adding a task
        if(item.classList.contains('taskItem')){
            currentObject = {
                id: item.id,
                name: item.innerText,
                activity: null
            };
            currentObject.name = item.querySelector('.itemContent').innerText;
            if(item.parentElement.classList.contains('activityBin')){
                currentObject.activity = item.parentElement.parentElement.id;
            }
            
            tasks.push(currentObject);
            
        }

    });
    
    
    
    for (index in activities){
        postActivity(activities[index].name,activities[index].id);
    }
    for (index in objectives){
        setTimeout(postObjective(objectives[index].name,objectives[index].id,objectives[index].activity),15);
    }
    for (index in tasks){
        setTimeout(postTask(tasks[index].name,tasks[index].id,tasks[index].activity),15);
    }
    
}


function watchButtons() {
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        clearDatabase();
        setTimeout(save,90);
        
    });


    oButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (!oInput.value) {
            return;
        }
        list.appendChild(newObjective(oInput.value));
        oInput.value = "";
    });


    activityButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (!activityInput.value) {
            return;
        }
        list.appendChild(newActivity(activityInput.value));


        //clear the form
        activityInput.value = "";

    });

    tButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (!inputItem.value) {
            return;
        }
        list.appendChild(newTask(inputItem.value));
        inputItem.value = "";
    });

}


function init() {
    setTimeout(switchDisplays,2500);
    watchButtons();
}

init();