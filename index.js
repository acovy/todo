window.addEventListener("load", () => {
    const form = document.querySelector("#new-task-form"),
        input = document.querySelector("#new-task-input"),
        listEl = document.querySelector("#tasks");

    let taskIdCounter = 0;

    loadTasks();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const task = input.value;
        if (!task) {
            alert("Please enter a task");
            return;
        }

        const taskObject = {
            id: taskIdCounter++, 
            text: task,
        };

        saveTask(taskObject);
        input.value = "";


        addTaskToList(taskObject);
    });

    function saveTask(taskObject) {
        const savedTasks = getSavedTasks();

        savedTasks.push(taskObject);
        localStorage.setItem("tasks", JSON.stringify(savedTasks));
    }

    function loadTasks() {
        const savedTasks = getSavedTasks();
    
        listEl.innerHTML = "";

        savedTasks.forEach((taskObject) => {
            addTaskToList(taskObject);
    
            if (taskObject.checked) {
                const taskEl = document.querySelector(`#task-${taskObject.id}`);
                const taskInputEl = taskEl.querySelector(".text");
    
                taskInputEl.style.textDecoration = "line-through";
                taskInputEl.style.opacity = "0.2";
                taskInputEl.setAttribute("check", "check");
            }
        });
    }
    

    function getSavedTasks() {
        const tasksJson = localStorage.getItem("tasks");

        return JSON.parse(tasksJson) || [];
    }

function addTaskToList(taskObject) {
    const taskEl = document.createElement("div");
    taskEl.classList.add("task");
    taskEl.id = `task-${taskObject.id}`; 

    const taskContentEl = document.createElement("div");
    taskContentEl.classList.add("content");

    taskEl.appendChild(taskContentEl);

    const taskInputEl = document.createElement("input");
    taskInputEl.classList.add("text");
    taskInputEl.type = "text";
    taskInputEl.value = taskObject.text;
    taskInputEl.setAttribute("readonly", "readonly");

    taskContentEl.appendChild(taskInputEl);

    const taskActionEl = document.createElement("div");
    taskActionEl.classList.add("actions");

    const taskEditEl = document.createElement("button");
    taskEditEl.classList.add("edit");
    taskEditEl.textContent = "Редактировать";

    const taskDeleteEl = document.createElement("button");
    taskDeleteEl.classList.add("delete");
    taskDeleteEl.textContent = "Удалить";

    taskActionEl.appendChild(taskEditEl);
    taskActionEl.appendChild(taskDeleteEl);

    taskEl.appendChild(taskActionEl);
    listEl.appendChild(taskEl);

    
    taskEl.addEventListener("click", () => {
        const todoId = taskObject.id;
        console.log(todoId);
    });

    
    taskEl.addEventListener("click", (e) => {
        const action = e.target.classList.contains("edit") ? "edit" : e.target.classList.contains("delete") ? "delete" : "";
        taskEl.dataset.action = action;

        action === "check" && checkTodo(todoId)
    });

    
    taskInputEl.addEventListener("click", () => {
        if (!taskInputEl.hasAttribute("check")) {
            taskInputEl.setAttribute("check", "check");
            taskInputEl.style.textDecoration = "line-through"; 
            taskInputEl.style.opacity = "0.2"; 

            
            taskObject.checked = true;
            updateTask(taskObject.id, taskObject.text, true);
        } else {
            taskInputEl.removeAttribute("check");
            taskInputEl.style.textDecoration = "none"; 
            taskInputEl.style.opacity = "1"; 
            taskObject.checked = false;
            updateTask(taskObject.id, taskObject.text, false);
        }
    });


    function checkTodo(todoId) {
        let todos = todos.map((todo, index) => {
                ({...todo,
                cheched: index === todoId ? !todo.cheched : todo.cheched,})
        });
    }

    taskEditEl.addEventListener("click", () => {
        if (taskEditEl.textContent.toLowerCase() == "редактировать") {
            taskInputEl.removeAttribute("readonly");
            taskInputEl.focus();
            taskEditEl.textContent = "Сохранить";
        } else {
            taskInputEl.setAttribute("readonly", "readonly");
            taskEditEl.textContent = "Редактировать";
            updateTask(taskObject.id, taskInputEl.value);
        }
    });

    taskDeleteEl.addEventListener("click", () => {
        listEl.removeChild(taskEl);

        deleteTask(taskObject.id);

        updateIds();
    });
}

function updateTask(taskId, newText, checked) {
    const savedTasks = getSavedTasks();
    const updatedTasks = savedTasks.map((taskObject) => {
        if (taskObject.id === taskId) {
            taskObject.text = newText;
            taskObject.checked = checked;
        }
        return taskObject;
    });

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

    function deleteTask(taskId) {
        const savedTasks = getSavedTasks();
        const updatedTasks = savedTasks.filter((taskObject) => taskObject.id !== taskId);
        
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }

    function updateIds() {
        const taskElements = document.querySelectorAll(".task");
        taskElements.forEach((taskElement, index) => {
            const taskId = taskElement.id.split("-")[1];
            taskElement.id = `task-${index}`;
            const taskObject = getTaskById(taskId);
            if (taskObject) {
                taskObject.id = index;
            }
        });
    }

    function getTaskById(taskId) {
        const savedTasks = getSavedTasks();
        return savedTasks.find((taskObject) => taskObject.id == taskId);
    }
});
