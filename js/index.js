const items = document.getElementById('items')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
let carrito = {}
let totalCompra = 0
document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    if (localStorage.getItem('totalCompra')){
      carrito = JSON.parse(localStorage.getItem('carrito'))
      carrito()
    }
})

items.addEventListener('click', e => {
  addCarrito(e)
})

const fetchData = async () => {
  try {
      const res = await fetch('api.json')
      const data = await res.json()
      pintarCards(data)
  } catch (error) {
      console.log(error)   
  }
}

const pintarCards = data => {
    data.forEach(producto => {
      templateCard.querySelector('h2').textContent = producto.titulo
      templateCard.querySelector('p').textContent = producto.precio
      templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
      templateCard.querySelector('.btn-dark').dataset.id = producto.id

      const clone = templateCard.cloneNode(true)
      fragment.appendChild(clone)
    })
    items.appendChild(fragment)
}

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
      
      console.log(e.target.parentElement)
      let padre = e.target.parentElement
      let precio = parseInt(padre.querySelector('p').innerText)
      console.log(precio)
      totalCompra = totalCompra + precio
      console.log(totalCompra)
      resultado.innerText = `El total de su compra es de ${totalCompra}`
      localStorage.setItem('total', JSON.stringify(totalCompra))
    }
    e.stopPropagation()
}

const setCarrito = objeto => {

}

const resultado = document.querySelector('#resultado p')
