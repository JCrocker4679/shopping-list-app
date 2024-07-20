const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
	const itemsFromStorage = getItemsFromStorage();

	itemsFromStorage.forEach((item) => addItemtoDom(item));
	checkUI();
}

function onAddItemSubmit(e) {
	e.preventDefault();

	const newItem = itemInput.value;

	//validate input
	if (newItem === '') {
		alert('Please add an item');
		return;
	}

	//Check for edit mode
	if (isEditMode) {
		const itemToEdit = itemList.querySelector('.edit-mode');

		removeItemFromStorage(itemToEdit.textContent);
		itemToEdit.classList.remove('edit-mode');
		itemToEdit.remove();
		isEditMode = false;
	} else {
		if (checkIfItemExists(newItem)) {
			alert('That item already exists!');
			return;
		}
	}

	//Create item DOM element
	addItemtoDom(newItem);

	addItemtoStorage(newItem);

	checkUI();

	itemInput.value = '';
}

function createButton(classes) {
	const button = document.createElement('button');
	button.className = classes;
	const icon = createIcon('fa-solid fa-xmark');
	button.appendChild(icon);
	return button;
}

function createIcon(classes) {
	const icon = document.createElement('i');
	icon.className = classes;
	return icon;
}

function addItemtoDom(item) {
	const li = document.createElement('li');
	li.setAttribute('class', 'item');
	li.appendChild(document.createTextNode(item));

	const button = createButton('remove-item btn-link text-red');
	li.appendChild(button);

	//Add Li to DOM
	itemList.appendChild(li);
}

// Add items to storage
function addItemtoStorage(item) {
	const itemsFromStorage = getItemsFromStorage();

	// add new item to array
	itemsFromStorage.push(item);

	//convert to JSON string and set to local storage
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Get items from storage
function getItemsFromStorage() {
	let itemsFromStorage;

	if (localStorage.getItem('items') === null) {
		itemsFromStorage = [];
	} else {
		itemsFromStorage = JSON.parse(localStorage.getItem('items'));
	}

	return itemsFromStorage;
}

function onClickItem(e) {
	if (e.target.parentElement.classList.contains('remove-item')) {
		removeItem(e.target.parentElement.parentElement);
	} else if (isEditMode === true && e.target.id != 'item') {
		isEditMode = false;
		checkUI();
	} else {
		setItemToEdit(e.target);
	}
}

function checkIfItemExists(item) {
	const itemsFromStorage = getItemsFromStorage();

	if (itemsFromStorage.includes(item)) {
		return true;
	} else {
		return false;
	}
}

function setItemToEdit(item) {
	isEditMode = true;

	itemList
		.querySelectorAll('li')
		.forEach((i) => i.classList.remove('edit-mode'));

	itemList.classList.remove('edit-mode');

	if (item.classList.contains('item')) {
		item.classList.add('edit-mode');
		formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item ';
		formBtn.style.backgroundColor = '#228b22';

		itemInput.value = item.textContent;
	}
}

// Remove Item
function removeItem(item) {
	if (confirm('Are you sure?')) {
		//Remove item from DOM
		item.remove();

		//remove item from Storage

		removeItemFromStorage(item.textContent);

		checkUI();
	}
}

function removeItemFromStorage(item) {
	let itemsFromStorage = getItemsFromStorage();

	//filter out item to be removed

	itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

	//re-set to localstorage
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Clear items

function clearItems() {
	while (itemList.firstChild) {
		itemList.removeChild(itemList.firstChild);
	}

	//clear from localStorage

	localStorage.removeItem('items');

	checkUI();
}

// Filter Items

function filterItems(e) {
	const items = document.querySelectorAll('li');
	const text = e.target.value.toLowerCase();

	items.forEach((item) => {
		const itemName = item.firstChild.textContent.toLowerCase();

		if (itemName.indexOf(text) != -1) {
			item.style.display = 'flex';
		} else {
			item.style.display = 'none';
		}
	});
}

//CheckUI function

function checkUI() {
	itemInput.value = '';
	const items = document.querySelectorAll('li');
	if (items.length === 0) {
		clearButton.style.display = 'none';
		itemFilter.style.display = 'none';
	} else {
		clearButton.style.display = 'block';
		itemFilter.style.display = 'block';
	}

	formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
	formBtn.style.backgroundColor = '#333';

	itemList
		.querySelectorAll('li')
		.forEach((i) => i.classList.remove('edit-mode'));

	itemList.classList.remove('edit-mode');

	isEditMode = false;
}

//If click outside of form during edit mode

// Initialise App

function init() {
	//Event Listeners
	itemForm.addEventListener('submit', onAddItemSubmit);
	itemList.addEventListener('click', onClickItem);
	clearButton.addEventListener('click', clearItems);
	itemFilter.addEventListener('input', filterItems);
	document.addEventListener('DOMContentLoaded', displayItems);

	checkUI();
}

init();
