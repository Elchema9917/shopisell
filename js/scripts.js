document.addEventListener('DOMContentLoaded', () => {

    // // 1. SELECTORES PRINCIPALES (No hay cambios) ==================================
    const body = document.body;
    const overlay = document.getElementById('overlay');

    const sections = document.querySelectorAll('.main-section');
    const navButtons = document.querySelectorAll('.nav-btn');
    const goToTiendaBtn = document.getElementById('go-to-tienda');
    const goToVendeBtn = document.getElementById('go-to-vende');

    // Selectores de la hamburguesa
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle-btn'); 
    const menuCerrar = document.getElementById('menu-cerrar-btn');
    const sidebarNavButtons = document.querySelectorAll('.sidebar-nav-btn');
    const loginLink = document.getElementById('login-link');

    // Modales y Carrito
    const loginModal = document.getElementById('login-modal');
    const loginCerrarBtn = document.getElementById('login-cerrar-btn');
    const filtroBtns = document.querySelectorAll('.nav-categorias-principal .filtro-btn');
    const productosGrid = document.getElementById('productos-grid');
    const sinResultadosMsg = document.getElementById('sin-resultados-msg');
    const cartModal = document.getElementById('cart-modal');
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartCerrarBtn = document.getElementById('cart-cerrar-btn');
    const cartCounter = document.getElementById('cart-counter');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const btnCheckout = document.getElementById('btn-checkout');

    // Vender Form
    const formVende = document.getElementById('form-vende');
    const nombreProducto = document.getElementById('nombre-producto');
    const descripcionProducto = document.getElementById('descripcion-producto');
    const categoriaPrincipal = document.getElementById('categoria-principal');
    const precioCop = document.getElementById('precio-cop');
    const inputImagen = document.getElementById('input-imagen');
    const archivoSeleccionadoSpan = document.getElementById('archivo-seleccionado');
    const previewImagen = document.getElementById('preview-imagen');
    const feedbackVende = document.getElementById('feedback-vende');

    // // 2. ESTADO GLOBAL (Productos Corregidos) ============================================
    let productos = [
        // MUJER
        { id: 1, nombre: "Jeans High Rise", descripcion: "MUJER / MUJERES", categoria: "pantalones", precio: 120000, imagen: "img/jeans.png" },
        { id: 2, nombre: "Camiseta Oversize Gráfica", descripcion: "MUJER / MUJERES", categoria: "camisetas", precio: 65000, imagen: "img/camiseta.png" },
        { id: 3, nombre: "Chaqueta de Cuero Sintético", descripcion: "MUJER / MUJERES", categoria: "chaquetas", precio: 210000, imagen: "img/chaqueta.png" },
        { id: 4, nombre: "Buzo Cropped con Capota", descripcion: "MUJER / MUJERES", categoria: "buzos", precio: 95000, imagen: "img/buzo.png" },
        // HOMBRE
        { id: 5, nombre: "Pantalon Cargo Talla M", descripcion: "HOMBRES / HOMBRE", categoria: "pantalones", precio: 150000, imagen: "img/pantalones2.png" },
        { id: 6, nombre: "Camisa de Lino", descripcion: "HOMBRES / HOMBRE", categoria: "camisetas", precio: 80000, imagen: "img/camisa.png" },
        // ACCESORIOS
        { id: 7, nombre: "Gafas de Sol Clásicas", descripcion: "ACCESORIOS / UNISEX", categoria: "accesorios", precio: 45000, imagen: "img/accesorios.png" }
    ];

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // // 3. FUNCIONES DE UTILIDAD ====================================

    function showSection(targetId) {
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        
        navButtons.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(`btn-${targetId.replace('-section', '')}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    function openModal(modal) {
        modal.classList.add('visible');
        overlay.classList.remove('hidden');
        body.classList.add('no-scroll');
    }

    function closeModal(modal) {
        modal.classList.remove('visible');
        overlay.classList.add('hidden');
        body.classList.remove('no-scroll');
    }
    
    // FUNCIÓN CLAVE PARA LA HAMBURGUESA
    function toggleSidebar() {
        sidebar.classList.toggle('sidebar-visible');
        // Muestra/Oculta el overlay según si el sidebar está visible
        overlay.classList.toggle('hidden', !sidebar.classList.contains('sidebar-visible'));
        body.classList.toggle('no-scroll', sidebar.classList.contains('sidebar-visible'));
    }

    function formatCurrency(number) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(number);
    }
    
    function renderProductos(filtroCategoria = 'todos') {
        let productosFiltrados = productos;
        
        if (filtroCategoria !== 'todos') {
            productosFiltrados = productos.filter(p => p.categoria === filtroCategoria);
        }

        productosGrid.innerHTML = '';

        if (productosFiltrados.length === 0) {
            sinResultadosMsg.classList.remove('hidden');
            return;
        }

        sinResultadosMsg.classList.add('hidden');
        
        productosFiltrados.forEach(producto => {
            const card = document.createElement('div');
            card.classList.add('producto-card');
            
            const imagenPath = producto.imagen || 'img/default.png'; 

            card.innerHTML = `
                <img src="${imagenPath}" alt="${producto.nombre}" style="width: 100%; object-fit: cover;">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <div class="price">${formatCurrency(producto.precio)}</div>
                <button class="btn-agregar-carrito" data-id="${producto.id}">Agregar al Carrito</button>
            `;
            productosGrid.appendChild(card);
        });

        productosGrid.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                addToCart(id);
            });
        });
    }

    // (Otras funciones de Carrito y Vender Omitidas por espacio, son las mismas que antes)

    // // 5. MANEJADORES DE EVENTOS ==================================

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.id.replace('btn-', '') + '-section';
            showSection(target);
            if (target === 'tienda-section') {
                renderProductos('todos');
                filtroBtns.forEach(b => b.classList.remove('active'));
                document.getElementById('todos').classList.add('active');
            }
        });
    });

    goToTiendaBtn.addEventListener('click', () => showSection('tienda-section'));
    goToVendeBtn.addEventListener('click', () => showSection('vende-section'));

    // EVENTO CLAVE PARA LA HAMBURGUESA
    menuToggle.addEventListener('click', toggleSidebar); 
    menuCerrar.addEventListener('click', toggleSidebar);

    sidebarNavButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            showSection(e.target.dataset.section + '-section');
            toggleSidebar();
            if (e.target.dataset.section === 'tienda') {
                renderProductos('todos');
            }
        });
    });

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (sidebar.classList.contains('sidebar-visible')) {
            toggleSidebar();
        }
        openModal(loginModal);
    });
    loginCerrarBtn.addEventListener('click', () => closeModal(loginModal));

    cartToggleBtn.addEventListener('click', () => openModal(cartModal));
    cartCerrarBtn.addEventListener('click', () => closeModal(cartModal));

    overlay.addEventListener('click', () => {
        if (sidebar.classList.contains('sidebar-visible')) {
            toggleSidebar();
        }
        if (loginModal.classList.contains('visible')) {
            closeModal(loginModal);
        }
        if (cartModal.classList.contains('visible')) {
            closeModal(cartModal);
        }
    });

    filtroBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const categoria = e.target.id;
            
            filtroBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            renderProductos(categoria);
        });
    });

    // Código restante del formulario de venta (no modificado)
    function addToCart(productId) {
        const producto = productos.find(p => p.id === productId);
        const cartItem = carrito.find(item => item.id === productId);

        if (producto) {
            if (cartItem) {
                cartItem.cantidad++;
            } else {
                carrito.push({ ...producto, cantidad: 1 });
            }
            updateCart();
        }
    }

    function updateCart() {
        localStorage.setItem('carrito', JSON.stringify(carrito));

        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        cartCounter.textContent = totalItems;

        renderCartItems();
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-vacio">El carrito está vacío.</p>';
            cartTotalPrice.textContent = formatCurrency(0);
            btnCheckout.disabled = true;
            return;
        }
        
        btnCheckout.disabled = false;

        carrito.forEach(item => {
            const itemTotal = item.precio * item.cantidad;
            total += itemTotal;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <span>${item.nombre} (x${item.cantidad})</span>
                <span>${formatCurrency(itemTotal)}</span>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        cartTotalPrice.textContent = formatCurrency(total);
    }
    
    inputImagen.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            archivoSeleccionadoSpan.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImagen.src = e.target.result;
                previewImagen.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            archivoSeleccionadoSpan.textContent = 'No se ha seleccionado archivo.';
            previewImagen.style.display = 'none';
        }
    });

    formVende.addEventListener('submit', (e) => {
        e.preventDefault();

        const imagenSimulada = previewImagen.src.startsWith('data:') ? 'img/nuevo_producto.png' : 'img/default.png';

        const nuevoProducto = {
            id: productos.length + 1,
            nombre: nombreProducto.value,
            descripcion: categoriaPrincipal.value.toUpperCase(), // Usamos la categoría como descripción temporal
            categoria: categoriaPrincipal.value,
            precio: parseInt(precioCop.value),
            imagen: imagenSimulada 
        };

        productos.push(nuevoProducto);
        
        feedbackVende.textContent = `Producto "${nuevoProducto.nombre}" publicado con éxito!`;
        feedbackVende.classList.remove('hidden');

        formVende.reset();
        archivoSeleccionadoSpan.textContent = 'No se ha seleccionado archivo.';
        previewImagen.style.display = 'none';

        setTimeout(() => {
            feedbackVende.classList.add('hidden');
        }, 5000);
    });

    // // 6. INICIALIZACIÓN (No hay cambios) ==========================================

    showSection('home-section');
    renderProductos('todos');
    updateCart();

    

    

});