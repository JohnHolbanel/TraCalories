// Storage Controller

// Item Controller
const ItemCtrl = (function(){
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    items: [
      // {id: 0, name: "Tofu Steak Dinner", calories: 1200},
      // {id: 1, name: "Cookie", calories: 400},
      // {id: 2, name: "Brocolli", calories: 50}
    ],
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    getItems: function(){
      return data.items;
    },

    addItem: function(name, calories){
      let ID;
      // Create ID
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else{
        ID = 0;
      }

      // Create new item
      newItem = new Item(ID, name, calories);

      data.items.push(newItem);

      return newItem;
    },

    getItemById: function(id){
      let found = null;
      // Loop through items
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      })

      return found;
    },

    updateItem: function(name, calories){
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
        return found;
    },

    setCurrentItem: function(item){
      data.currentItem = item;
    },

    getCurrentItem: function(){
      return data.currentItem;
    },

    getTotalCalories: function(){
      let total = 0;

      // Adding up calories
      data.items.forEach(function(item){
        total += parseInt(item.calories);
      })
      
      // Set total calories
      data.totalCalories = total;

      return data.totalCalories;
    },

    logData: function(){
      return data;
    }
  }
})();

// UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  }

  // Public methods
  return {
    populateItemList: function(items){
      let html = "";

      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`
      })

      // Insert list item
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput(){
      return{
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function(item){
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      // Add class
      li.className = "collection-item";
      // Add id
      li.id = `item-${item.id}`;
      // Add html
      li.innerHTML = `
      <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
        `;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
    },

    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute("id");
        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          `;
        }
      })
    },

    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },

    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = "none";
    },

    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },

    showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },

    getSelectors: function(){
      return UISelectors;
    }
  }

})();

// App Controller
const App = (function(ItemCtrl, UICtrl){
  // Load event listeners
  const loadEventListeners = function(){
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

    // Disable submit on enter
    document.addEventListener("keypress", function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);
  }

  // Add item submit
  const itemAddSubmit = function(e){
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if(input.name !== "" && input.calories !== ""){
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);  

      // Clear input
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Click edit item
  const itemEditClick = function(e){
    if(e.target.classList.contains("edit-item")){
        // Get list item id
        const listId = e.target.parentNode.parentNode.id;

        // Break into array
        const listIdArray = listId.split("-");

        // Get the actual id
        const id = parseInt(listIdArray[1]);

        // Get item
        const itemToEdit = ItemCtrl.getItemById(id);

        // Set current item
        ItemCtrl.setCurrentItem(itemToEdit);

        // Add item to form
        UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  // Item update submit
  const itemUpdateSubmit = function(e){
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);  

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Public methods
  return {
    init: function(){
      // Clear edit state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if(items.length === 0){
        UICtrl.hideList();
      } else{
        // Populate list with items
        UICtrl.populateItemList(items);
      };

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories)

      // Load event listeners
      loadEventListeners();

    }
  }

})(ItemCtrl, UICtrl);

// Initialize App
App.init();