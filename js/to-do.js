const formToDo = document.getElementById('form-to-do')
const inputToDo = document.getElementById('input-to-do')
const toDoList = document.getElementById('to-do-list')
const templateToDo = document.getElementById('template-to-do').content
const fragment = document.createDocumentFragment()
let toDoLet = {}

document.addEventListener('DOMContentLoaded', () =>{
    if(localStorage.getItem('toDoStorage')){
        toDoLet = JSON.parse(localStorage.getItem('toDoStorage'))
    }
    printToDo()
})

toDoList.addEventListener('click', e =>{
    btnAction(e)
})

formToDo.addEventListener('submit', e => {
    e.preventDefault()

    setToDo(e)
})

const setToDo = e => {
    if(inputToDo.value.trim() === ""){
        return
    }
    const todo = {
        id: Date.now(),
        texto: inputToDo.value,
        status: false
    }
    toDoLet[todo.id] = todo

    formToDo.reset()
    inputToDo.focus
    printToDo()
}

const printToDo = () =>{
    localStorage.setItem('toDoStorage', JSON.stringify(toDoLet))

    if(Object.values(toDoLet).length === 0){
        toDoList.innerHTML = `
        <div class="alert alert-dark text-center">
        <h3>¡No hay tareas al pendiente!</h3>
        </div>
        `
        return
    }


    toDoList.innerHTML = ''
    Object.values(toDoLet).forEach(todo => {
        const clone = templateToDo.cloneNode(true)
        clone.querySelector('p').textContent = todo.texto

        if(todo.status){
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary')
            clone.querySelector('p').style.textDecoration = 'Line-through'
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle', 'fa-undo-alt')
        }
        clone.querySelectorAll('.fas')[0].dataset.id = todo.id
        clone.querySelectorAll('.fas')[1].dataset.id = todo.id
    
        fragment.appendChild(clone)
    })
    toDoList.appendChild(fragment)
}

const btnAction = e => {
    if(e.target.classList.contains('fa-check-circle')){
        toDoLet[e.target.dataset.id].status = true
        printToDo()
    }
    if(e.target.classList.contains('text-danger')){
        delete toDoLet[e.target.dataset.id]
        printToDo()
    }
    if(e.target.classList.contains('fa-undo-alt')){
        toDoLet[e.target.dataset.id].status = false
        printToDo()
    }
    e.stopPropagation()
}