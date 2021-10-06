const deleteBtn = document.querySelectorAll('.del')
const signoutBtn = document.querySelector('.signout')
const addDateBtn = document.querySelector('.addDate')
const selectedSlot = document.querySelectorAll('.selectSlot')
const sendMail = document.querySelectorAll('.sendMail')

if(addDateBtn){addDateBtn.addEventListener('click', addTimeSlot)}
if(signoutBtn){signoutBtn.addEventListener('click', signout)}

Array.from(selectedSlot).forEach((el)=>{
    el.addEventListener('click', selectTimeSlot)
})

Array.from(sendMail).forEach((el)=>{
    el.addEventListener('click', resendEmail)
})

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
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

async function resendEmail(){
    const id = this.parentNode.dataset.id

    try {
        const response = await fetch('../../setDates/resendEmail', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'idFromJSFile': id,
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (error) {
        console.log(error)
    }
}