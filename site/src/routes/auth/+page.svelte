<!-- src/routes/+page.svelte -->
<script lang="ts">
    import {enhance} from "$app/forms";
    import {metadata} from "../../metaDataStore.js";

    let formSubmitted = false;

    const handleSubmit = event => {
        event.preventDefault();
        formSubmitted = true;
    };

    metadata.set({
        title: 'SobaSift | Login',
        description: 'Enter your email to receive a OTP to get started managing your emails with SobaSift'
    });

</script>

<section class="dark:bg-gray-900">
    <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-20 lg:py-16 lg:grid-cols-12">
        <div class="w-full place-self-center lg:col-span-6">
            <div class="p-6 mx-auto bg-white rounded-lg shadow dark:bg-gray-800 sm:max-w-xl sm:p-8">
                <h1 class="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                    Welcome to SobaSift
                </h1>
                <p class="text-sm font-light text-gray-500 dark:text-gray-300">
                    To get started, enter your email. A magic link will be sent to log you in.
                </p>
                <form class="mt-4 space-y-6 sm:mt-6" method="POST" on:submit={handleSubmit} use:enhance>
                    <div class="grid gap-6">
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="email">Email</label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   id="email" name="email"
                                   placeholder="name@company.com"
                                   required="true" type="email">
                        </div>
                    </div>
                    <button class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            type="submit">
                        Send a magic link
                    </button>
                </form>
                {#if formSubmitted}
                    <p class="mt-4 space-y-6 sm:mt-6 text-sm font-light text-gray-500 dark:text-gray-300">
                        Your magic link has been sent. Please check your email!
                    </p>
                {/if}
            </div>
        </div>
        <div class="mr-auto place-self-center lg:col-span-6">
            <img alt="illustration"
                 class="hidden mx-auto lg:flex"
                 src="/auth.svg">
        </div>
    </div>
</section>