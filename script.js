
        let cart = [];
        let cartTotal = 0;

        function display(sectionId) {
            const sections = document.querySelectorAll('body > div[id^="section"]');
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.style.display = 'block';
                if (sectionId === 'sectionHome') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        }

        function scrollToSection(sectionId) {
            display('sectionHome');
            setTimeout(() => {
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            }, 100);
        }

        function addToCart(itemName, price, category) {
            console.log('Adding to cart:', itemName, price);
            
            const existingItem = cart.find(item => item.name === itemName);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: itemName,
                    price: price,
                    category: category,
                    quantity: 1
                });
            }
            
            updateCart();
            showAddToCartAnimation();

            setTimeout(() => {
                openCart();
            }, 300);
        }

        function removeFromCart(itemName) {
            cart = cart.filter(item => item.name !== itemName);
            updateCart();
        }


        function updateQuantity(itemName, change) {
            const item = cart.find(item => item.name === itemName);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(itemName);
                } else {
                    updateCart();
                }
            }
        }

        function updateCart() {
            const cartCount = document.getElementById('cartCount');
            const cartBody = document.getElementById('cartBody');
            const emptyCartMessage = document.getElementById('emptyCartMessage');
            const cartTotalElement = document.getElementById('cartTotal');
            const checkoutBtn = document.getElementById('checkoutBtn');
            
            console.log('Updating cart, items:', cart);
            

            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            if (cartCount) {
                cartCount.textContent = totalItems;
            }
            

            if (cartBody) {
                cartBody.innerHTML = '';
                cartTotal = 0;
                
                if (cart.length === 0) {
                    if (emptyCartMessage) emptyCartMessage.style.display = 'block';
                    if (checkoutBtn) checkoutBtn.disabled = true;
                } else {
                    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
                    if (checkoutBtn) checkoutBtn.disabled = false;
                    
                    cart.forEach(item => {
                        const itemTotal = item.price * item.quantity;
                        cartTotal += itemTotal;
                        
                        const cartItem = document.createElement('div');
                        cartItem.className = 'cart-item';
                        cartItem.innerHTML = `
                            <div class="cart-item-info">
                                <h6>${item.name}</h6>
                                <p>₹${item.price} x ${item.quantity} = ₹${itemTotal}</p>
                            </div>
                            <div class="cart-item-controls">
                                <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.name}', -1)">-</button>
                                <span class="mx-2">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.name}', 1)">+</button>
                                <button class="btn btn-sm btn-danger ml-2" onclick="removeFromCart('${item.name}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
                        cartBody.appendChild(cartItem);
                    });
                }
                
                if (cartTotalElement) {
                    cartTotalElement.textContent = cartTotal;
                }
            }
        }


        function showAddToCartAnimation() {
            const animation = document.createElement('div');
            animation.className = 'add-to-cart-animation';
            animation.innerHTML = '<i class="fas fa-check"></i> Added to cart!';
            document.body.appendChild(animation);
            
            setTimeout(() => {
                animation.remove();
            }, 2000);
        }


        function openCart() {
            console.log('Opening cart...');
            const cartSidebar = document.getElementById('cartSidebar');
            const cartOverlay = document.getElementById('cartOverlay');
            
            if (cartSidebar && cartOverlay) {
                cartSidebar.classList.add('open');
                cartOverlay.classList.add('show');
                document.body.style.overflow = 'hidden';
            } else {
                console.error('Cart elements not found!');
            }
        }

        function closeCart() {
            console.log('Closing cart...');
            const cartSidebar = document.getElementById('cartSidebar');
            const cartOverlay = document.getElementById('cartOverlay');
            
            if (cartSidebar && cartOverlay) {
                cartSidebar.classList.remove('open');
                cartOverlay.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        }

        function checkout() {
            if (cart.length === 0) return;
            
            closeCart();
            

            const orderItems = document.getElementById('orderItems');
            if (orderItems) {
                orderItems.innerHTML = '';
                
                let subtotal = 0;
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    subtotal += itemTotal;
                    
                    const orderItem = document.createElement('div');
                    orderItem.className = 'order-item d-flex justify-content-between border-bottom pb-2 mb-2';
                    orderItem.innerHTML = `
                        <span>${item.name} (${item.quantity}x)</span>
                        <span>₹${itemTotal}</span>
                    `;
                    orderItems.appendChild(orderItem);
                });
                
                const deliveryFee = 40;
                const total = subtotal + deliveryFee;
                
                document.getElementById('subtotal').textContent = `₹${subtotal}`;
                document.getElementById('deliveryFee').textContent = `₹${deliveryFee}`;
                document.getElementById('totalAmount').textContent = `₹${total}`;
                

                $('#orderModal').modal('show');
            }
        }


        function placeOrder() {
            const name = document.getElementById('customerName');
            const phone = document.getElementById('customerPhone');
            const address = document.getElementById('deliveryAddress');
            
            if (!name || !phone || !address || !name.value || !phone.value || !address.value) {
                alert('Please fill in all required fields');
                return;
            }
            

            const orderId = 'FM' + Date.now().toString().slice(-6);
            
            const orderDetails = {
                orderId: orderId,
                items: [...cart],
                customer: { 
                    name: name.value, 
                    phone: phone.value, 
                    address: address.value, 
                    instructions: document.getElementById('specialInstructions')?.value || '' 
                },
                total: cartTotal + 40,
                subtotal: cartTotal,
                deliveryFee: 40
            };
 
            document.getElementById('orderId').textContent = orderId;
            

            $('#orderModal').modal('hide');
            
            cart = [];
            updateCart();
            document.getElementById('orderForm').reset();

            setTimeout(() => {
                $('#orderSuccessModal').modal('show');
            }, 500);

            console.log('Order placed successfully:', orderDetails);
        }

        document.addEventListener('DOMContentLoaded', function() {
            display('sectionHome');
            updateCart();

            const cartOverlay = document.getElementById('cartOverlay');
            if (cartOverlay) {
                cartOverlay.addEventListener('click', closeCart);
            }

            console.log('Page loaded, cart initialized');
        });