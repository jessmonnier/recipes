// ---------------- Recipe page functions ----------------
document.addEventListener("DOMContentLoaded", function(){

    // Ingredient checkbox toggle
    const checkboxes = document.querySelectorAll(".ingredients input");
    checkboxes.forEach(box => {
        box.addEventListener("change", function(){
            if(this.checked){
                this.parentElement.classList.add("checked");
            } else {
                this.parentElement.classList.remove("checked");
            }
        });
    });

    // Add to shopping list button
    const addBtns = document.querySelectorAll('.add-to-shopping');
    addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const recipeCard = btn.closest('.recipe-container');
            const ingredients = [...recipeCard.querySelectorAll('.ingredients li')]
                                .filter(li => !li.querySelector('input').checked)
                                .map(li => li.textContent.trim());

            const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

            ingredients.forEach(item => {
                if (!shoppingList.includes(item)) shoppingList.push(item);
            });

            localStorage.setItem('shoppingList', JSON.stringify(shoppingList));

            window.location.href = '../shopping.html';
        });
    });

});

// ---------------- Shopping List functions ----------------
const list = document.getElementById('shoppingList');
const resetBtn = document.getElementById('resetBtn');
const input = document.getElementById('itemInput');
const addBtn = document.getElementById('addBtn');

let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

function renderList() {
    if(!list) return; // Only run on shopping page

    list.innerHTML = '';

    shoppingList.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'recipe-card';

        const textInput = document.createElement('input');
        textInput.value = item;
        textInput.addEventListener('input', (e) => {
            shoppingList[index] = e.target.value;
            saveList();
        });

        // Up button
        const upBtn = document.createElement('button');
        upBtn.textContent = '⬆';
        upBtn.title = 'Move up';
        upBtn.onclick = () => {
            if(index === 0) return;
            [shoppingList[index-1], shoppingList[index]] = [shoppingList[index], shoppingList[index-1]];
            saveList();
            renderList();
        };

        // Down button
        const downBtn = document.createElement('button');
        downBtn.textContent = '⬇';
        downBtn.title = 'Move down';
        downBtn.onclick = () => {
            if(index === shoppingList.length-1) return;
            [shoppingList[index], shoppingList[index+1]] = [shoppingList[index+1], shoppingList[index]];
            saveList();
            renderList();
        };

        // Complete toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '✔';
        toggleBtn.title = 'Mark complete / incomplete';
        toggleBtn.onclick = () => {
            li.classList.toggle('completed');
        };

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.textContent = '❌';
        delBtn.title = 'Delete';
        delBtn.onclick = () => {
            shoppingList.splice(index, 1);
            saveList();
            renderList();
        };

        // Append elements: input, up, down, toggle, delete
        li.appendChild(textInput);
        li.appendChild(upBtn);
        li.appendChild(downBtn);
        li.appendChild(toggleBtn);
        li.appendChild(delBtn);

        list.appendChild(li);
    });
}

function saveList() {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

// input/add button functionality
if(addBtn && input){
    // Add item with button
    addBtn.addEventListener('click', () => {
        const item = input.value.trim();
        if(item){
            shoppingList.push(item);
            saveList();
            renderList();
            input.value = '';
        }
    });

    // Add item with Enter key
    input.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
            addBtn.click();
        }
    });
}

// Reset list
if(resetBtn){
    resetBtn.addEventListener('click', () => {
        if(confirm('Are you sure you want to clear the entire list?')){
            shoppingList = [];
            saveList();
            renderList();
        }
    });
}

// Drag-and-drop reorder
if(list){
    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(list, e.clientY);
        if(afterElement == null){
            list.appendChild(dragging);
        } else {
            list.insertBefore(dragging, afterElement);
        }
    });

    list.addEventListener('drop', () => {
        shoppingList = Array.from(list.querySelectorAll('li input')).map(input => input.value);
        saveList();
    });
}

function getDragAfterElement(container, y){
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height/2;
        if(offset < 0 && offset > closest.offset){
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

renderList();