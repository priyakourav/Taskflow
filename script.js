//GET ELEMENTS

const input = document.getElementById("taskInput")
const addBtn = document.getElementById("addBtn")
const list = document.getElementById("taskList")
const priority = document.getElementById("priority")
const taskCount = document.getElementById("taskCount")
const toggleBtn = document.getElementById("themeToggle")

//DATA 

let tasks = JSON.parse(localStorage.getItem("tasks")) || []
let filter = "all"

//SAVE TASKS 

function save(){
localStorage.setItem("tasks", JSON.stringify(tasks))
}

//RENDER TASKS

function render(){

list.innerHTML = ""

let filtered = tasks.filter(task => {

if(filter === "pending") return !task.completed
if(filter === "completed") return task.completed

return true

})

filtered.forEach((task,index)=>{

const li = document.createElement("li")

// add priority class
li.classList.add(task.priority)

// completed style
if(task.completed){
li.classList.add("completed")
}

// task layout
li.innerHTML = `

<button class="complete-btn" onclick="toggle(${index})">✔</button>

<span>${task.text}</span>

<i class="fa fa-trash delete" onclick="removeTask(${index})"></i>

`

// enable drag
li.setAttribute("draggable", true)

list.appendChild(li)

})

updateCount()

}

//ADD TASK

function addTask(){

let text = input.value.trim()

if(text === "") return

tasks.push({
text: text,
priority: priority.value,
completed: false
})

input.value = ""

save()
render()

}

//TOGGLE COMPLETE

function toggle(index){

tasks[index].completed = !tasks[index].completed

save()
render()

}

//REMOVE TASK

function removeTask(index){

tasks.splice(index,1)

save()
render()

}

//FILTER TASKS 

function filterTasks(type){

filter = type

render()

}

//TASK COUNTER 

function updateCount(){

let remaining = tasks.filter(task => !task.completed).length

taskCount.textContent = "Tasks Left: " + remaining

}

//DARK MODE

toggleBtn.addEventListener("click",()=>{

document.body.classList.toggle("dark")

})

//ADD TASK BUTTON

addBtn.addEventListener("click", addTask)

//INITIAL RENDER 

render()

//DRAG & DROP 

let draggedItem = null

document.addEventListener("dragstart",(e)=>{

if(e.target.tagName === "LI"){

draggedItem = e.target
e.target.classList.add("dragging")

}

})

document.addEventListener("dragend",(e)=>{

if(e.target.tagName === "LI"){

e.target.classList.remove("dragging")

}

})

list.addEventListener("dragover",(e)=>{

e.preventDefault()

const afterElement = getDragAfterElement(list, e.clientY)

if(afterElement == null){

list.appendChild(draggedItem)

}else{

list.insertBefore(draggedItem, afterElement)

}

})

//HELPER FUNCTION 

function getDragAfterElement(container,y){

const elements = [...container.querySelectorAll("li:not(.dragging)")]

return elements.reduce((closest,child)=>{

const box = child.getBoundingClientRect()

const offset = y - box.top - box.height / 2

if(offset < 0 && offset > closest.offset){
return {offset: offset, element: child}
}else{
return closest
}

},{offset: Number.NEGATIVE_INFINITY}).element

}
