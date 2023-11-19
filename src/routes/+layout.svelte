<script lang="ts">
    import '../app.postcss';
    import {Navbar, NavBrand} from "flowbite-svelte";
    import {invalidate} from '$app/navigation';
    import {onMount} from 'svelte';
    import {page} from "$app/stores";
    import {metadata} from "../metaDataStore.js";

    export let data;

    $: ({supabase, session} = data);

    onMount(() => {
        const {data} = supabase.auth.onAuthStateChange((event, _session) => {
            if (_session?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth');
            }
        });

        return () => data.subscription.unsubscribe();
    });

    // SEO
    let pageTitle = '';
    let pageDescription = '';

    metadata.subscribe((value) => {
        pageTitle = value.title;
        pageDescription = value.description;
    });
</script>

<svelte:head>
    <title>{pageTitle}</title>
    <meta content={pageDescription} name="description"/>
</svelte:head>

<!--HEADER and FOOTER + SLOT-->
<div class="flex flex-col min-h-screen">
    <div class="isolate bg-white">
        <div class="px-6 pt-6 lg:px-8">
            <Navbar let:hidden let:toggle>
                <NavBrand href="/">
                    <img
                            alt="SobaSift Logo"
                            class="mr-3 h-9 sm:h-12"
                            src="/SobaSift.svg"
                    />
                    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
      SobaSift
    </span>
                </NavBrand>
                <div class="flex md:order-2">
                    <div class="flex rounded-lg justify-center items-center">
                        <a class="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                           href="/auth"
                           type="button">
                            {$page.data.session ? 'My Account' : 'Login'}
                        </a>
                    </div>
                    <!--                    <NavHamburger on:click={toggle}/>-->
                </div>
                <!--                <NavUl class="order-1" {hidden}>-->
                <!--                    <NavLi href="#">Plans</NavLi>-->
                <!--                    <NavLi href="#">About</NavLi>-->
                <!--                    <NavLi href="#">FAQ</NavLi>-->
                <!--                </NavUl>-->
            </Navbar>
        </div>
    </div>

    <slot/>

    <!--FOOTER-->
    <footer class="mt-auto w-full p-4 bg-white rounded-lg shadow flex items-center justify-center dark:bg-gray-800">
    <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © 2023 <a class="hover:underline" href="/">SobaSift</a>. All Rights Reserved.
    </span>
    </footer>
</div>
