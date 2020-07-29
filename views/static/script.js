fetch("/api/", {
  method: "get",
  headers: { "Content-Type": "application/json" },
})
  .then((data) => data.json())
  .then((data) => {
    window.todos = data;
    window.todos.map(todo=> todo.switched = false)
    if(window.todos.length > 0){
        updateTodos();
    }
  })
  .catch((err) => console.log(err));

// function to return todo-item template when supplied data
const getTemplate = ({ _id, name, done }) => {
  return `<div class="todo-item">
  <input type="checkbox" name="${_id}" id="${_id}" class="check">
  <div>
  <span class="name text-${_id}" style="${done ? 'text-decoration: line-through; color: grey' : ""}">${name}</span>
        <input type="text" name="${_id}" value="${name}" class="hide input-${_id}">
        </div>
        <div>
            <button class="btn-1 btn-${_id}">edit</button>
            <button class="btn-2 btn-${_id}">delete</button>
        </div>
    </div>`;
};

// function to update the todo list holder
const updateTodos = () => {
  let todoBodyTemplateString = "";
  window.todos.map((todo) => {
    todoBodyTemplateString += getTemplate(todo);
  });
  document.querySelector("#todo-holder").innerHTML = todoBodyTemplateString;
  window.todos.map(({_id, done})=>{
      document.getElementById(`${_id}`).defaultChecked = done;
      document.getElementById(`${_id}`).onclick = e =>handleChecked(e.target)
      document.querySelector(`.btn-1.btn-${_id}`).onclick = e => handleEdit(_id)
      document.querySelector(`.btn-2.btn-${_id}`).onclick = e => handleDelete(_id)
  })
};

// function to handle checkbox in the todo-item
const handleChecked = checkbox =>{
    let myTodo = null
    window.todos.map(todo=>{
        if(todo._id === checkbox.name){
            todo.done = !todo.done;
            myTodo = todo;
        }
    })
    updateTodos();
    fetch(`/api/${checkbox.name}`, {method: "put", headers: {"Content-Type": "application/json"}, body: JSON.stringify({name: myTodo.name, done: myTodo.done})})
    .then(data=>data.json)
    .then(data=>{
        console.log("todo updated")
    })
    .catch(err=>console.log(err))
}

//function to delete todo-items from the list
const handleDelete = id =>{
    window.todos = window.todos.filter(({_id})=> _id !== id);
    updateTodos();
    fetch(`/api/${id}`, {method: "delete", headers: {"Content-Type": 'application/json'}})
    .then(data=>data.json)
    .then(data=>console.log("todo updated"))
    .catch(err=>console.log(err));
}

// function to toggle between input and string
const switchSides = id =>{
    document.querySelector(`.text-${id}`).classList.toggle('hide');
    document.querySelector(`.input-${id}`).classList.toggle('hide');
}

// function to edit todo-items in the list
const handleEdit = id =>{
    let myTodo = null;
    window.todos.map((todo)=>{
        if(todo._id === id){
            myTodo = todo;
        }
    })
    if(myTodo.switched){
        window.todos.map((todo)=>{
            if(todo._id === id){
                todo.name = document.querySelector(`.input-${id}`).value;
                todo.switched = !todo.switched;
                switchSides(id);
                updateTodos();
            }
        })
        fetch(`/api/${id}`, {method: "put", headers: {"Content-Type": "application/json"}, body: JSON.stringify({name: myTodo.name, done: myTodo.done})})
        .then(data=>data.json)
        .then(data=>console.log("todo item updated"))
        .catch(err=>console.log(err));
    }else{
        switchSides(id);
        window.todos.map((todo)=>{
            if(todo._id === id){
                todo.switched = !todo.switched;
            }
        })
    }
}

// function to update the todos list
const getTodos = () => {
  fetch("/api/", {
    method: "get",
    headers: { "Content-Type": "application/json" },
  })
    .then((data) => data.json())
    .then((data) => {
      window.todos = data;
    })
    .catch((err) => console.log(err));
};


document.addEventListener("DOMContentLoaded", () => {

  // creating todo item
  const form = document.querySelector("#todo-form");
  console.log(window.todos);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputElement = e.target.getElementsByTagName("input")[0];
    const name = inputElement.value;
    if (name !== "") {
      fetch("/api/", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ name, done: false }),
      })
        .then((data) => data.json())
        .then((data) => {
            window.todos.push(data[0]);
            updateTodos();
            inputElement.value = "";
        })
        .catch((err) => console.log(err));
    }
  });
});
