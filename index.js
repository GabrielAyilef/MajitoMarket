import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://majitomarket-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingList = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    if (inputValue !== "") { // Verificar si el valor no está vacío
        push(shoppingListInDB, inputValue);
        clearInputFieldEl();
    }else {
        // El valor está vacío, se resalta el campo de entrada
        inputFieldEl.classList.add("highlight");
        document.getElementById("my-image").src = "tenor.gif";

    }
})
inputFieldEl.addEventListener("input", function() {
    if (inputFieldEl.value !== "") {
        inputFieldEl.classList.remove("highlight");
    }
});
onValue(shoppingListInDB, function (snapshot) {
    if(snapshot.exists()){
    let shoppingArray = Object.entries(snapshot.val())
    clearShoppingListEl()
    
        for (let i = 0; i < shoppingArray.length; i++){
            let currentItem = shoppingArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            appendItemToShoppingListEl(currentItem)
    } 
    } else {
        shoppingList.textContent = '💅 No items here...';
        shoppingList.classList.add('empty-list');
    }

})
function clearShoppingListEl() {
    shoppingList.innerHTML= ""
}
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0] /*para conseguir el ID y luego borrar ese elemento al ser clickeado*/
    let itemValue = item[1]/* para que la funcion agregue el nombre del producto en la pantalla. Esta diferencia porque en database esta asi diagramado, primero ID y segundo el nombre */
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    newEl.addEventListener("dblclick", function () {
       let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
        
    })
    
    shoppingList.append(newEl)
}

