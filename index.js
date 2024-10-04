import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://majitomarket-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingList = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  if (inputValue !== "") {
    push(shoppingListInDB, inputValue);
    inputFieldEl.value = "";
  } else {
    inputFieldEl.classList.add("highlight");
  }
});
inputFieldEl.addEventListener("input", function () {
  if (inputFieldEl.value !== "") {
    inputFieldEl.classList.remove("highlight");
  }
});
onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let shoppingArray = Object.entries(snapshot.val());
    console.log(shoppingArray);
    shoppingList.innerHTML = "";

    for (let i = 0; i < shoppingArray.length; i++) {
      let currentItem = shoppingArray[i];
      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingList.textContent = "💅 No items here...";
    shoppingList.classList.add("empty-list");
  }
});

function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;
  newEl.addEventListener("dblclick", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });

  shoppingList.append(newEl);
}
