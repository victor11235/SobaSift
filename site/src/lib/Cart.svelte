<script>
    import cartStore, {cartClear, decreaseQuantity, increaseQuantity, removeFromCart} from "../cartStore.ts";
    import {onDestroy} from "svelte";
    import {showCart} from "../showCart.js";

    let show;
    showCart.subscribe(value => {
        show = value;
    })

    function closeCart() {
        showCart.set(false);
    }

    let cartItems = [];
    const unsubscribe = cartStore.subscribe((value) => {
        cartItems = value;
    });
    onDestroy(unsubscribe);

    let totalPrice = 0;

    $: {
        totalPrice = cartItems.reduce((acc, item) => {
            return acc + item.quantity * item.price;
        }, 0);
    }

    async function checkoutCart() {
        // Create an array of line items for the Stripe session
        const lineItems = cartItems.map(item => ({
            price_data: {
                currency: 'usd',
                unit_amount: item.price * 100,
                product_data: {
                    name: item.title,
                    description: item.description,
                    images: [item.imageUrl],
                },
            },
            quantity: item.quantity,
        }));

        await fetch('/api/stripeCheckout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: lineItems,
                cancelUrl: window.location.href,
            }),
        })
            .then(data => {
                return data.json();
            })
            .then(data => {
                cartClear();
                window.location.replace(data.url);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
</script>

<div
        class="fixed inset-0 overflow-hidden"
        class:hidden={!show}
>
    <div class="absolute inset-0 overflow-hidden">
        <button
                class="absolute inset-0 bg-gray-500 bg-opacity-50"
                on:click={closeCart}
                aria-label="Close cart overlay"
        ></button>

        <div class="absolute inset-y-0 right-0 flex">
            <div
                    class="bg-white w-screen max-w-md transform transition-transform duration-300 ease-in-out"
                    class:translate-x-0={show}
                    class:translate-x-full={!show}
            >
                <!-- Your cart content goes here -->
                <div class="flex items-start justify-between p-6">
                    <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">Shopping cart</h2>
                    <div class="ml-3 flex h-7 items-center">
                        <button type="button" on:click={closeCart} class="-m-2 p-2 text-gray-400 hover:text-gray-500">
                            <span class="sr-only">Close panel</span>
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="mt-8 p-6">
                    <div class="flow-root max-h-[calc(95vh-300px)] overflow-auto">
                        <ul class="-my-6 divide-y divide-gray-200">
                            {#each cartItems as item}
                                <li class="flex py-6">
                                    <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        <img src="{item.imageUrl}"
                                             alt="{item.title} image"
                                             class="h-full w-full object-cover object-center">
                                    </div>

                                    <div class="ml-4 flex flex-1 flex-col">
                                        <div>
                                            <div class="flex justify-between text-base font-medium text-gray-900">
                                                <h3>
                                                    {item.title}
                                                </h3>
                                                <p class="ml-4">${item.price}</p>
                                            </div>
                                            <p class="mt-1 text-sm text-gray-500">{item.description}</p>
                                        </div>
                                        <div class="flex flex-1 items-end justify-between text-sm">
                                            <div class="flex">
                                                <button type="button" on:click={() => decreaseQuantity(item._id)}
                                                        class="font-medium text-indigo-600 hover:text-indigo-500 mr-2">-
                                                </button>
                                                <p class="text-gray-500">Qty {item.quantity}</p>
                                                <button type="button" on:click={() => increaseQuantity(item._id)}
                                                        class="font-medium text-indigo-600 hover:text-indigo-500 ml-2">+
                                                </button>
                                            </div>
                                            <div class="flex">
                                                <button type="button" on:click={() => removeFromCart(item._id)}
                                                        class="font-medium text-indigo-600 hover:text-indigo-500">Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>

                <div class="absolute bottom-0 w-full border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div class="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${totalPrice.toFixed(2)}</p>
                    </div>
                    <p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div class="mt-6">
                        <button on:click={() => checkoutCart()}
                                class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                            Checkout
                        </button>
                    </div>
                    <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                            or
                            <button type="button" on:click={closeCart}
                                    class="font-medium text-indigo-600 hover:text-indigo-500">
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                            </button>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>
