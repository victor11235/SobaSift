<!-- src/routes/account/+page.svelte -->
<script lang="ts">
    import {enhance, type SubmitFunction} from '$app/forms';
    import {browser} from "$app/environment";
    import {onDestroy} from "svelte";
    import {page} from "$app/stores";
    import {metadata} from "../../metaDataStore.js";

    export let data;

    let {session} = data;
    $: ({session} = data)
    let loading = false;
    let hasToken: null | boolean = false;
    let hasWeights = false;

    $: if (session) {
        const user_id = session.user.id;

        const checkToken = async () => {
            const {data, error} = await $page.data.supabase.from('auth_tokens')
                .select('id')
                .eq('user_id', user_id)
                .single();
            if (data && !error) {
                hasToken = true;
            } else {
                hasToken = false;
            }
        };

        const checkWeights = async () => {
            const {data, error} = await $page.data.supabase.storage.from('email-folders')
                .list();
            if (data && !error) {
                // Check if any object name matches the 'user_id'. Then the user has stored weights
                hasWeights = data.some(object => object.name === user_id);
            } else {
                hasWeights = false;
            }
        };

        // Initial check
        checkToken();
        checkWeights();

        // Subscribe to changes on the auth_tokens table
        const channel = $page.data.supabase.channel('realtime tokens').on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'auth_tokens'
        }, () => {
            checkToken();
        }).subscribe();

        const weightsChannel = $page.data.supabase.channel('realtime storage')
            .on('postgres_changes', {
                event: '*',
                schema: 'storage',
                table: 'objects'
            }, () => {
                checkWeights();
            })
            .subscribe()

        onDestroy(() => {
            $page.data.supabase.removeChannel(channel);
            $page.data.supabase.removeChannel(weightsChannel);
        });
    }

    async function authMS() {
        loading = true;
        const tenant = "common";
        const url = new URL(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`);
        url.searchParams.append('client_id', '4d49baea-95e9-41ef-88a8-330ba6146d20');
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('redirect_uri', `${$page.url.origin}/account`);
        url.searchParams.append('response_mode', 'query');
        url.searchParams.append('scope', 'https://graph.microsoft.com/mail.read offline_access');
        url.searchParams.append('prompt', 'select_account');
        url.searchParams.append('state', '12345');
        url.searchParams.append('code_challenge', 'mdU2Hel7ergaI6-vi2lmvGeEVknHXhNPTV6oQBv6sjo');
        url.searchParams.append('code_challenge_method', 'S256');

        if (browser) {
            window.location.replace(url);
        }
    }

    // Should prevent multiple entries being added to the database on page reload
    if (browser) {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            fetch('/api/msAuth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({code: code})
            })
                .then(response => response.json())
                .then((data) => {
                    console.log(data);
                    // Remove the code parameter from the URL after processing
                    window.history.replaceState({}, document.title, window.location.pathname);
                })
                .catch(error => console.error('Error:', error));
        }
    }

    const handleClick: SubmitFunction = () => {
        loading = true;
        return async ({update}) => {
            update();
        }
    }

    const handleRemoveClick: SubmitFunction = (event) => {
        if (!window.confirm("Are you sure you want to remove the Outlook Email Connection?")) {
            event.preventDefault();
        }
    }

    metadata.set({
        title: 'SobaSift | Account',
        description: 'Connect your Outlook email, and train an AI model to manage emails with SobaSift.'
    });
</script>
<section class="bg-white dark:bg-gray-900">
    <div class="prose py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2>Account information</h2>
        <dl>
            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Email</dt>
            <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{session && session.user ? session.user.email : 'N/A'}</dd>
        </dl>
        <form action="?/signout" class="flex items-center space-x-4" method="POST" use:enhance={handleClick}>
            <button class="inline-flex items-center text-white !bg-red-600 hover:!bg-red-700 focus:ring-4 focus:outline-none focus:!ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:!bg-red-500 dark:hover:!bg-red-600 dark:focus:!ring-red-900"
                    disabled={loading}
                    type="submit">
                <svg class="icon icon-tabler icon-tabler-logout-2 mr-4" fill="none" height="24"
                     stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     viewBox="0 0 24 24"
                     width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                    <path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2"></path>
                    <path d="M15 12h-12l3 -3"></path>
                    <path d="M6 15l-3 -3"></path>
                </svg>
                Log out
            </button>
        </form>
    </div>

    <!--TODO: display a different message once signed in or a check mark - we can do this by checking if the user has a access token-->
    <div class="prose py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2>Step 1. Sign in to Microsoft</h2>
        {#if hasToken}
            <!-- Display check mark when token exists -->
            <span>Successfully connected Outlook Email ✅</span>
            <form action="?/deleteAuthToken" class="flex items-center space-x-4 my-4" method="POST"
                  use:enhance={handleRemoveClick}>
                <button class="inline-flex items-center text-white !bg-red-600 hover:!bg-red-700 focus:ring-4 focus:outline-none focus:!ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:!bg-red-500 dark:hover:!bg-red-600 dark:focus:!ring-red-900"
                        disabled={loading}
                        type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash mr-2" width="24"
                         height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                         stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M4 7l16 0"></path>
                        <path d="M10 11l0 6"></path>
                        <path d="M14 11l0 6"></path>
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                    </svg>
                    Remove Outlook Email Connection
                </button>
            </form>
        {:else}
            <button class="inline-flex items-center text-white !bg-primary-600 hover:!bg-primary-700 focus:ring-4 focus:outline-none focus:!ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:!bg-primary-500 dark:hover:!bg-primary-600 dark:focus:!ring-primary-900"
                    disabled={loading}
                    on:click={authMS}>
                Sign in with outlook
            </button>
        {/if}
    </div>

    <div class="prose py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2>Step 2. Create the following folders in Outlook</h2>
        <ol class="list-decimal list-inside">
            <li>0_school_stuff</li>
            <li>1_applications</li>
            <li>2_academic_emails</li>
            <li>3_external_stuff</li>
        </ol>
        <p>Add <strong>5 - 10</strong> training examples to each folder and then proceed to step 3.</p>
    </div>

    <div class="prose py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2>Step 3. Train your model</h2>
        {#if !hasToken}
            <span>Connect Outlook email in step 1 and create the folders (with emails) in step 2 before training</span>
        {:else if hasToken && hasWeights}
            <span>Congrats! Your model has been trained.</span>
        {:else}
            <form action="?/train" class="flex items-center space-x-4" method="POST" use:enhance={handleClick}>
                <button class="inline-flex items-center justify-center text-white min-w-[224px] !bg-primary-600 hover:!bg-primary-700 focus:ring-4 focus:outline-none focus:!ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:!bg-primary-500 dark:hover:!bg-primary-600 dark:focus:!ring-primary-900"
                        disabled={loading}
                        type="submit">
                    {#if loading && !hasWeights}
                        <svg aria-hidden="true"
                             class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentFill"/>
                        </svg>
                    {:else}
                        Train Model
                    {/if}
                </button>
            </form>
        {/if}
    </div>
</section>
