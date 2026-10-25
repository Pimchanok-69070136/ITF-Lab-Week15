const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

let todoArray = [];

function createTodoItem(text) {
    let li = document.createElement("li");

    let span = document.createElement("span");
    span.textContent = text;
    li.appendChild(span);

    let deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "ลบ";

    deleteBtn.addEventListener("click", () => {
        todoList.removeChild(li);

        let index = todoArray.indexOf(text);
        if (index > -1) {
            todoArray.splice(index, 1);
        }

        updateLocalStorage();
    });

    li.appendChild(deleteBtn);
    return li;
}

function updateLocalStorage() {
    localStorage.setItem("todo_items", JSON.stringify(todoArray));
}

addBtn.addEventListener("click", () => {
    let text = todoInput.value.trim();
    
    if (text === "") {
        return;
    }

    let newLi = createTodoItem(text);
    todoList.appendChild(newLi);

    todoArray.push(text);
    updateLocalStorage();

    todoInput.value = "";
});

todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addBtn.click();
    }
});

window.onload = () => {
    let savedData = localStorage.getItem("todo_items");
    if (savedData) {
        let parsedData = JSON.parse(savedData);
        
        todoList.innerHTML = "";

        parsedData.forEach((text) => {
            let newLi = createTodoItem(text);
            todoList.appendChild(newLi);
            todoArray.push(text);
        });
    } else {
        let initialItems = todoList.querySelectorAll("li span");
        initialItems.forEach((span) => {
            let text = span.textContent;
            todoArray.push(text);
            
            let li = span.parentElement;
            let deleteBtn = li.querySelector("button");
            if (deleteBtn) {
                deleteBtn.addEventListener("click", () => {
                    todoList.removeChild(li);
                    let index = todoArray.indexOf(text);
                    if (index > -1) {
                        todoArray.splice(index, 1);
                    }
                    updateLocalStorage();
                });
            }
        });
        updateLocalStorage();
    }
};