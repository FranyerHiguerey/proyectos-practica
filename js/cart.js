const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCart = document.getElementById('template-cart').content
const fragment = document.createDocumentFragment()
let cart = {}

document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'))
        printCart()
    }
})

cards.addEventListener('click', e =>{
    addToCart(e)
})

items.addEventListener('click', e =>{
    btnAction(e)
})

const fetchData = async () => {
    try{
        const res = await fetch('json/datos.json')
        const data = await res.json()
        doCard(data)
    }catch (error){
        console.log(error)
    }
}

const doCard = data =>{
    data.forEach(item => {
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('img').setAttribute("src", item.thumbnailUrl)
        templateCard.querySelector('.btn-success').dataset.id = item.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const addToCart = e => {
    if(e.target.classList.contains('btn-success')){
        setCart(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCart = object =>{
    console.log(object)
    const productCart = {
        id: object.querySelector('.btn-success').dataset.id,
        title: object.querySelector('h5').textContent,
        precio: object.querySelector('p').textContent,
        cantidad: 1
    }
    if(cart.hasOwnProperty(productCart.id)){
        productCart.cantidad = cart[productCart.id].cantidad + 1 
    }
    cart[productCart.id] = {...productCart}
    printCart()
}

const printCart = () => {
    console.log(cart)
    items.innerHTML = ""
    Object.values(cart).forEach(product => {
        templateCart.querySelector('th').textContent = product.id
        templateCart.querySelectorAll('td')[0].textContent = product.title
        templateCart.querySelectorAll('td')[1].textContent = product.cantidad
        templateCart.querySelector('.btn-info').dataset.id = product.id
        templateCart.querySelector('.btn-danger').dataset.id = product.id
        templateCart.querySelector('span').textContent = product.precio * product.cantidad

        const clone = templateCart.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    printFooter()
    localStorage.setItem('cart', JSON.stringify(cart))
}

const printFooter = () =>{
    footer.innerHTML = ""
     if(Object.keys(cart).length === 0){
         footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
         return
     }

     const cantidadTotal = Object.values(cart).reduce((acc, {cantidad}) => acc + cantidad,0) 
     const precioTotal = Object.values(cart).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)

     templateFooter.querySelectorAll('td')[0].textContent = cantidadTotal
     templateFooter.querySelector('span').textContent = precioTotal

     const clone = templateFooter.cloneNode(true)
     fragment.appendChild(clone)
     footer.appendChild(fragment)

     const btnVaciar = document.getElementById('vaciar-cart')
     btnVaciar.addEventListener('click', () => {
         cart = {}
         printCart()
     })
}

const btnAction = e => {
    if(e.target.classList.contains('btn-info')){

        const product = cart[e.target.dataset.id]
        product.cantidad++
        cart[e.target.dataset.id] = {...product}
        printCart()
    }
    if(e.target.classList.contains('btn-danger')){
        const product = cart[e.target.dataset.id]
        product.cantidad--
        if(product.cantidad === 0){
            delete cart[e.target.dataset.id]
        }
        printCart()
    }

    e.stopPropagation()
}