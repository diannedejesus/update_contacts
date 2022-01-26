// const deleteBtn = document.querySelectorAll('.del')
const signoutBtn = document.querySelector('.signout')
const addNumberBtn = document.querySelector('.addNumber')

// const sendMail = document.querySelectorAll('.sendMail')

if(addNumberBtn){addNumberBtn.addEventListener('click', addNumber)}
if(signoutBtn){signoutBtn.addEventListener('click', signout)}

document.querySelector('.showSection').addEventListener('click', showSection)


// Array.from(sendMail).forEach((el)=>{
//     el.addEventListener('click', resendEmail)
// })

// Array.from(deleteBtn).forEach((el)=>{
//     el.addEventListener('click', deleteTodo)
// })

// async function deleteTodo(){
//     const todoId = this.parentNode.dataset.id
//     try{
//         const response = await fetch('../setDates/deleteDates', {
//             method: 'delete',
//             headers: {'Content-type': 'application/json'},
//             body: JSON.stringify({
//                 'todoIdFromJSFile': todoId
//             })
//         })
//         const data = await response.json()
//         console.log(data)
//         location.reload()
//     }catch(err){
//         console.log(err)
//     }
// }

function showSection(event){
    let contactForm = document.querySelector('.addContact').style.display
console.log('contactForm', contactForm)
    if(contactForm === 'none' || !contactForm){
        document.querySelector('.addContact').style.display = 'block';
    }else {
        document.querySelector('.addContact').style.display = 'none';
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

function addNumber(){
    const numberList = document.querySelector('#numberSlots')
    let currentNumbers = []
    let nextField = []
    const numTypes = ['Home', 'Business', 'Mobile', 'Other']

    for(items of numberList.children){
        if(items.name === 'type'){
            currentNumbers.push(items.value)
        }
    }
    
        
    let numberLabel = document.createElement("label")
    numberLabel.for = 'number' + (currentNumbers.length + 1)
    numberLabel.appendChild(document.createTextNode('Number'))
    nextField.push(numberLabel)
    nextField.push(document.createTextNode(' '))

    let newInput = document.createElement("input")
    newInput.id = 'number' + (currentNumbers.length + 1)
    newInput.name = 'number'
    newInput.type = 'text'
    newInput.placeholder = '787-555-5555'
    nextField.push(newInput)
    nextField.push(document.createTextNode(' '))

    let typeLabel = document.createElement("label")
    typeLabel.for = 'type' +(currentNumbers.length + 1)
    typeLabel.appendChild(document.createTextNode('Type'))
    nextField.push(typeLabel)
    nextField.push(document.createTextNode(' '))

    let newSelect = document.createElement("select")
    newSelect.id = 'type' + (currentNumbers.length + 1)
    newSelect.name = 'type'
    console.log(newSelect)
    let option = []
    
    for(let i=0; i<numTypes.length; i++){
        let currentOption = document.createElement("option")
        currentOption.value = numTypes[i]
        currentOption.appendChild(document.createTextNode(numTypes[i]))

        //option.push(currentOption)
        newSelect.appendChild(currentOption)
    }

    nextField.push(newSelect)

    for(let i=0; i<nextField.length; i++){
        numberList.appendChild(nextField[i])
    }


}




// async function resendEmail(){
//     const id = this.parentNode.dataset.id

//     try {
//         const response = await fetch('../../setDates/resendEmail', {
//             method: 'POST',
//             headers: {'Content-type': 'application/json'},
//             body: JSON.stringify({
//                 'idFromJSFile': id,
//             })
//         })
//         const data = await response.json()
//         console.log(data)
//         location.reload()
//     } catch (error) {
//         console.log(error)
//     }
// }