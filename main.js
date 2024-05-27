'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
} 

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_seashell')) ?? []
const setLocalStorage = (dbSeashell) => localStorage.setItem("db_seashell", JSON.stringify(dbSeashell))

// CRUD methods
const createSeashell = (seashell) => {
    const dbSeashell = getLocalStorage()
    dbSeashell.push(seashell)
    setLocalStorage(dbSeashell)
}

const readSeashell = () => getLocalStorage()

const updateSeashell = (index, seashell) => {
    const dbSeashell = readSeashell()
    dbSeashell[index] = seashell
    setLocalStorage(dbSeashell)
}

const deleteSeashell = (index) => {
    const dbSeashell = readSeashell()
    dbSeashell.splice(index, 1)
    setLocalStorage(dbSeashell)
}


// Auxiliary functions

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

const clearTable = () => {
    const rows = document.querySelectorAll('#seashellTable>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const createRow = (seashell, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${seashell.popularName}</td>
        <td>${seashell.scientificName}</td>
        <td>${seashell.distribution}</td>
        <td>${seashell.family}</td>
        <td>
        <button type="button" class="edit-button button" id="edit-${index}">Edit</button>
        <button type="button" class="delete-button button" id="delete-${index}">Delete</button>
        </td>
        `
        document.querySelector('#seashellTable>tbody').appendChild(newRow)
    }
    
    const updateTable = () => {
        const dbSeashell = readSeashell()
    clearTable()
    dbSeashell.forEach(createRow)
}

const fillFields = (seashell) => {
    document.getElementById('popularName').value = seashell.popularName
    document.getElementById('scientificName').value = seashell.scientificName
    document.getElementById('distribution').value = seashell.distribution
    document.getElementById('family').value = seashell.family
    document.getElementById('popularName').dataset.index = seashell.index
}

const editSeashell = (index) => {
    const seashell = readSeashell()[index]
    seashell.index = index
    fillFields(seashell)
    openModal()
}
// Interation with interface 

const saveSeashell = () => {
    if(isValidFields()){
        const seashell = {
            popularName: document.getElementById('popularName').value,
            scientificName: document.getElementById('scientificName').value,
            distribution: document.getElementById('distribution').value,
            family: document.getElementById('family').value
        }
        const index = document.getElementById('popularName').dataset.index
        if(index == 'new'){
            createSeashell(seashell)
        }
        else{
            updateSeashell(index, seashell)
        }
        updateTable()
        closeModal()
    }
}

const editDelete = (event) => {
    if(event.target.type == 'button'){
        const [action, index] = event.target.id.split('-')
        if(action == 'edit'){
            editSeashell(index)
        }   
        else{
            deleteSeashell(index)
            updateTable()
        }
    }
}   

// Event listeners

document.getElementById('registerButton')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('saveButton')
    .addEventListener('click', saveSeashell)

document.querySelector('#seashellTable>tbody')
    .addEventListener('click', editDelete)
