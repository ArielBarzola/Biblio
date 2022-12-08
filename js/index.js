const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    if (localStorage.getItem('carrito')){
      carrito = JSON.parse(localStorage.getItem('carrito'))
      pintarCarrito()
    }
})

cards.addEventListener('click', e => {
  addCarrito(e)
})

items.addEventListener('click', e => {
  btnAct(e)
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
    cards.appendChild(fragment)
}

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    //   console.log(e.target.parentElement)
    //   let padre = e.target.parentElement
    //   let precio = parseInt(padre.querySelector('p').innerText)
    //   console.log(precio) 
    //   totalCompra = totalCompra + precio
    //   console.log(totalCompra)
    //   resultado.innerText = `El total de su compra es de ${totalCompra}`
    //   localStorage.setItem('total', JSON.stringify(totalCompra))
    // 
  }
    e.stopPropagation()
}

const setCarrito = objeto => {
  const producto = {
    id: objeto.querySelector('.btn-dark').dataset.id,
    titulo: objeto.querySelector('h2').textContent,
    precio: objeto.querySelector('p').textContent,
    cantidad: 1
  }
  if(carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1
  }
  carrito[producto.id] = {...producto}
  pintarCarrito()
}

const pintarCarrito = () => {
  items.innerHTML = ''
  Object.values(carrito).forEach(producto => {
    templateCarrito.querySelector('th').textContent = producto.id
    templateCarrito.querySelectorAll('td')[0].textContent = producto.titulo
    templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
    templateCarrito.querySelector('.btn-pluss').dataset.id = producto.id
    templateCarrito.querySelector('.btn-minuss').dataset.id = producto.id
    templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

    const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)
  })
  items.appendChild(fragment)

  pintarFooter()

  localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
  footer.innerHTML = ''
  if(Object.keys(carrito).length === 0) {
    footer.innerHTML = `
    <th scope="row" colspan="5">Su carrito se encuentra vacío, puede comenzar a comprar</th>
    `
    return
  }

  const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
  const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)

  templateFooter.querySelectorAll('td')[0].textContent = nCantidad
  templateFooter.querySelector('span').textContent = nPrecio

  const clone = templateFooter.cloneNode(true)
  fragment.appendChild(clone)
  footer.appendChild(fragment)

  const btnVaciar = document.getElementById('vaciar-carrito')
  btnVaciar.addEventListener('click', () => {
    carrito = {}
    pintarCarrito()
  })
}

const btnAct = e => {
  if(e.target.classList.contains('btn-pluss')) {
    const producto = carrito[e.target.dataset.id]
    producto.cantidad++
    carrito[e.target.dataset.id] = {...producto}
    pintarCarrito()
  }
  if(e.target.classList.contains('btn-minuss')) {
    const producto = carrito[e.target.dataset.id]
    producto.cantidad--
    if(producto.cantidad === 0) {
      delete carrito[e.target.dataset.id]
    }
    pintarCarrito()
  }

    e.stopPropagation()
}

//const resultado = document.querySelector('#resultado p')
