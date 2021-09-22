const deleteBtn = document.querySelectorAll('.del')
const signoutBtn = document.querySelector('.signout')
const addDateBtn = document.querySelector('.addDate')
const selectedSlot = document.querySelectorAll('.selectSlot')
const todoItem = document.querySelectorAll('span.not')
const todoComplete = document.querySelectorAll('span.completed')

if(addDateBtn){addDateBtn.addEventListener('click', addTimeSlot)}
if(signoutBtn){signoutBtn.addEventListener('click', signout)}

Array.from(selectedSlot).forEach((el)=>{
    el.addEventListener('click', selectTimeSlot)
})

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', markIncomplete)
})

async function deleteTodo(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('../setDates/deleteDates', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function signout(){
    try{
        const response = await fetch('signup/logout', {
            method: 'get',
            headers: {'Content-type': 'application/json'},
        })
        location.reload()
    }catch(err){
        console.log(err)
    }
}

function addTimeSlot(){
    const selectedDate = document.querySelector("[name='dateItem']").value
    const selectedTime = document.querySelector("[name='timeItem']").value
    const dateList = document.querySelector('#timeSlots')

    if(selectedDate !== '' || selectedTime !== '' ){
        let newItem = document. createElement("li")
        let newFormItem = document. createElement("input")
        newFormItem.type = 'hidden'
        newFormItem.name = 'dateTimeItem'
        newFormItem.value = `${selectedDate} ${selectedTime}`
        newItem.appendChild(document.createTextNode(`${selectedDate} ${selectedTime}`))
        this.parentNode.appendChild(newFormItem)
        dateList.appendChild(newItem)
    }
}

async function selectTimeSlot(){
    const name = this.parentNode.dataset.name
    const dateTime = this.parentNode.dataset.datetime
    const id = this.parentNode.dataset.id

    try{
        const response = await fetch('../../setDates/assignTimeSlot', {
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'dateTimeFromJSFile': dateTime,
                'idFromJSFile': id,
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}











async function markComplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('setDates/markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markIncomplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markIncomplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}