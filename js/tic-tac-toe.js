const user_1 = document.getElementById("user_1")
const user_2 = document.getElementById("user_2")
const form = document.getElementById("form")
const xClass = 'x'
const circleClass ='circle'
const winningCombination = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
]
const cellElements = document.querySelectorAll(".cell")
const board = document.getElementById( "board")
const winningMessageElement = document.getElementById("mensaje")
const changeTurn = document.getElementById("cambiar-turnos")
const restartButton = document.getElementById("reintentar-boton")
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn
const xPoints = document.getElementById("x")
const circlePoints = document.getElementById("circle")
let xPointsValue = document.getElementById("x-points").value = 0
let circlePointsValue = document.getElementById("circle-points").value = 0


changeTurn.addEventListener('click', cambiarTurno)
restartButton.addEventListener('click', partidaIniciada)

function cambiarTurno(){
        circleTurn = !circleTurn
        añadirHover()
}

partidaIniciada()

function partidaIniciada(){
    changeTurn.removeAttribute('disabled', 'disabled')
    changeTurn.classList.remove("disabled")
    changeTurn.classList.add("enable")
    cellElements.forEach(cell => {
        cell.classList.remove(xClass)
        cell.classList.remove(circleClass)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, {once: true})
    })
    añadirHover()
    winningMessageElement.classList.remove('mostrar')
}

function handleClick(e){
    changeTurn.setAttribute('disabled', 'disabled')
    changeTurn.classList.add("disabled")
    changeTurn.classList.remove("enable")
    const cell = e.target
    const turnoActual = circleTurn ? circleClass : xClass
    placeMark(cell, turnoActual) 
    if (checkWin(turnoActual)){
        endGame(false)
    } else if (isDraw()){
        endGame(true)
    } else {
        turnos()
        añadirHover()
    }
}
function endGame(draw){
    if(draw){
        winningMessageTextElement.innerHTML = "¡Draw!"
    }else{
            winningMessageTextElement.innerHTML = `¡${circleTurn ?  user_2.value : user_1.value } Wins!`
            incremento()
        }
    winningMessageElement.classList.add('mostrar')
}

function incremento(){
    if(circleTurn){
        circlePointsValue++
        circlePoints.innerHTML = circlePointsValue
    }else{
        xPointsValue++
        xPoints.innerHTML = xPointsValue
    }
}

function isDraw(){
    return [...cellElements].every(cell => {
        return cell.classList.contains(xClass) ||
         cell.classList.contains(circleClass)
    })
}

function placeMark(cell, turnoActual){
    cell.classList.add(turnoActual)
}

function turnos() {
    circleTurn = !circleTurn
}

function checkWin(turnoActual){
    return winningCombination.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(turnoActual)
        })
    })
 }


function añadirHover(){
    board.classList.remove(circleClass)
    board.classList.remove(xClass)
    if(circleTurn){

     board.classList.add(circleClass)
    }
    else{
     board.classList.add(xClass)
    }
}
