<script>
    import {page} from '$app/stores';

    const emojis = {
        404: '🔎',
        500: '💥'
    }
</script>

<main class="grid min-h-full place-items-center bg-white py-24 px-6 sm:py-32 lg:px-8">
    <div class="text-center">
        <p class="text-base font-semibold text-indigo-600">{emojis[$page.status] ?? emojis[500]} {$page.status}</p>
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{$page.error.message}</h1>
        {#if $page.status === 404}
            <div class="flex flex-col justify-center items-center gap-4 mt-8 sm:flex-row">
                <a class="sm:w-[182px] px-5 py-3 w-full  text-base font-medium text-center text-white bg-orange-500 rounded-lg shrink-0 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                   href="/"
                   title="">
                    Return Home
                </a>
            </div>
        {/if}
    </div>
</main>