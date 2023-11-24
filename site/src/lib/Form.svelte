<script>
    import {enhance} from "$app/forms";
    export let form;
    export let errors;

    export let constraints;
    export let formAction;
</script>

<section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <form action="?/{formAction}" method="POST" use:enhance>
            {#if formAction === "update"}
                <h2 class="mb-4 text-xl font-semibold leading-none text-gray-900 dark:text-white">Their response</h2>
            {:else}
            <h2 class="mb-4 text-xl font-semibold leading-none text-gray-900 dark:text-white">Prescription Request Form</h2>
            {/if}
            <div class="grid grid-cols-1 gap-4 mb-4 md:gap-6 sm:mb-8">
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="dateOfBirth">Date
                        of Birth</label>
                    <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                           id="dateOfBirth"
                           name="dateOfBirth"
                           placeholder="YYYY-MM-DD"
                           required="true" type="date" bind:value={$form.dateOfBirth} {...$constraints.dateOfBirth}>
                    {#if $errors.dateOfBirth}
                        <p class="text-xs font-bold text-red-500 mt-2">{$errors.dateOfBirth}</p>
                    {/if}
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="doctorAdvised">Has
                        your doctor advised
                        that you are not fit enough for any physical and/or sexual activity?</label>
                    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            id="doctorAdvised" name="doctorAdvised" bind:value={$form.doctorAdvised} {...$constraints.doctorAdvised}>
                        <option disabled selected value> -- select an option --</option>
                        <option value="NO">No</option>
                        <option value="YES">Yes</option>
                    </select>
                    {#if $errors.doctorAdvised}
                        <p class="text-xs font-bold text-red-500 mt-2">{$errors.doctorAdvised}</p>
                    {/if}
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="chestPain">Do
                        you feel breathless or experience chest pain with light or moderate physical activity?</label>
                    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            id="chestPain" name="chestPain" bind:value={$form.chestPain} {...$constraints.chestPain}>
                        <option disabled selected value> -- select an option --</option>
                        <option value="NO">No</option>
                        <option value="YES">Yes</option>
                    </select>
                    {#if $errors.chestPain}
                        <p class="text-xs font-bold text-red-500 mt-2">{$errors.chestPain}</p>
                    {/if}
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="recentHeartAttack">Have
                        you had a heart attack within the last 6 months?</label>
                    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            id="recentHeartAttack" name="recentHeartAttack" bind:value={$form.recentHeartAttack} {...$constraints.recentHeartAttack}>
                        <option disabled selected value> -- select an option --</option>
                        <option value="NO">No</option>
                        <option value="YES">Yes</option>
                    </select>
                    {#if $errors.recentHeartAttack}
                        <p class="text-xs font-bold text-red-500 mt-2">{$errors.recentHeartAttack}</p>
                    {/if}
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="faintingOrDizziness">Do
                        you experience unexplained fainting or dizziness?</label>
                    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            id="faintingOrDizziness" name="faintingOrDizziness" bind:value={$form.faintingOrDizziness} {...$constraints.faintingOrDizziness}>
                        <option disabled selected value> -- select an option --</option>
                        <option value="NO">No</option>
                        <option value="YES">Yes</option>
                    </select>
                    {#if $errors.faintingOrDizziness}
                        <p class="text-xs font-bold text-red-500 mt-2">{$errors.faintingOrDizziness}</p>
                    {/if}
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Do you have any of the
                        following medical conditions?</label>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex items-center">
                            <input class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                   id="unstableAngia" name="unstableAngia" type="checkbox"
                                   bind:checked={$form.unstableAngia}>
                            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                   for="unstableAngia">Unstable angia (chest pain)</label>
                            {#if $errors.unstableAngia}
                                <p class="text-xs font-bold text-red-500 mt-2">{$errors.unstableAngia}</p>
                            {/if}
                        </div>
                        <div class="flex items-center">
                            <input class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                   id="arrhythmia" name="arrhythmia" type="checkbox"
                                   bind:checked={$form.arrhythmia}>
                            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                   for="arrhythmia">Irregular heart beat or palpitations (arrhythmia)</label>
                            {#if $errors.arrhythmia}
                                <p class="text-xs font-bold text-red-500 mt-2">{$errors.arrhythmia}</p>
                            {/if}
                        </div>
                        <div class="flex items-center">
                            <input class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                   id="heartValveProblem" name="heartValveProblem" type="checkbox"
                                   bind:checked={$form.heartValveProblem}>
                            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                   for="heartValveProblem">A problem with one of your valves in your heart</label>
                            {#if $errors.heartValveProblem}
                                <p class="text-xs font-bold text-red-500 mt-2">{$errors.heartValveProblem}</p>
                            {/if}
                        </div>
                        <div class="flex items-center">
                            <input class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                   id="cardiomyopathy" name="cardiomyopathy" type="checkbox"
                                   bind:checked={$form.cardiomyopathy}>
                            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                   for="cardiomyopathy">A problem where the heart muscles become inflamed and they don't
                                work as well as they should (cardiomyopathy)</label>
                            {#if $errors.cardiomyopathy}
                                <p class="text-xs font-bold text-red-500 mt-2">{$errors.cardiomyopathy}</p>
                            {/if}
                        </div>
                        <div class="flex items-center">
                            <input class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                   id="bloodFlowIssues" name="bloodFlowIssues" type="checkbox"
                                   bind:checked={$form.bloodFlowIssues}>
                            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                   for="bloodFlowIssues">Heart problems causing blood flow issues? (e.g left ventricular
                                outflow obstruction; aortic narrowing)</label>
                            {#if $errors.bloodFlowIssues}
                                <p class="text-xs font-bold text-red-500 mt-2">{$errors.bloodFlowIssues}</p>
                            {/if}
                        </div>
                        <div class="flex items-center">
                            <input class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                   id="severeCardiacFailure" name="severeCardiacFailure" type="checkbox"
                                   bind:checked={$form.severeCardiacFailure}>
                            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                   for="severeCardiacFailure">Severe cardiac failure</label>
                            {#if $errors.severeCardiacFailure}
                                <p class="text-xs font-bold text-red-500 mt-2">{$errors.severeCardiacFailure}</p>
                            {/if}
                        </div>
                    </div>
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="otherConditions">Please
                        mention any other heart condition(s)</label>
                    <textarea
                            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            id="otherConditions" name="otherConditions"
                            placeholder="Write your response here..."
                            rows="4" bind:value={$form.otherConditions} {...$constraints.otherConditions}></textarea>
                    {#if $errors.otherConditions}
                        <p class="text-xs font-bold text-red-500 mt-2">{$errors.dateOfBirth}</p>
                    {/if}
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="nitrates">Do
                        you take/use any medicines/drugs containing any nitrates or nitric oxide donors?</label>
                    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            id="nitrates" name="nitrates" bind:value={$form.nitrates} {...$constraints.nitrates}>
                        <option disabled selected value> -- select an option --</option>
                        <option value="NO">No</option>
                        <option value="YES">Yes</option>
                    </select>
                    {#if $errors.nitrates}
                        <p class="text-xs font-bold text-red-500 mt-2">{$errors.nitrates}</p>
                    {/if}
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="gcStim">Are you
                        taking riociguat or other guanylate cyclase stimulators? (for lung problems caused by high blood
                        pressure)</label>
                    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            id="gcStim" name="gcStim" bind:value={$form.gcStim} {...$constraints.gcStim}>
                        <option disabled selected value> -- select an option --</option>
                        <option value="NO">No</option>
                        <option value="YES">Yes</option>
                    </select>
                    {#if $errors.gcStim}
                        <p class="text-xs font-bold text-red-500 mt-2">{$errors.gcStim}</p>
                    {/if}
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="hivHepatitis">Are
                        you
                        taking any medication for HIV or Hepatitis?</label>
                    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            id="hivHepatitis" name="hivHepatitis" bind:value={$form.hivHepatitis} {...$constraints.hivHepatitis}>
                        <option disabled selected value> -- select an option --</option>
                        <option value="NO">No</option>
                        <option value="YES">Yes</option>
                    </select>
                    {#if $errors.hivHepatitis}
                        <p class="text-xs font-bold text-red-500 mt-2">{$errors.hivHepatitis}</p>
                    {/if}
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="fungal">Do
                        you take any medication for fungal infections? (itraconazole, ketoconazole, fluconazole,
                        voriconazole, clarithromycin, erythromycin, rifampicin)</label>
                    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            id="fungal" name="fungal" bind:value={$form.fungal} {...$constraints.fungal}>
                        <option disabled selected value> -- select an option --</option>
                        <option value="NO">No</option>
                        <option value="YES">Yes</option>
                    </select>
                    {#if $errors.fungal}
                        <p class="text-xs font-bold text-red-500 mt-2">{$errors.fungal}</p>
                    {/if}
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="otherMedications">Please
                        list any other medication(s) you take</label>
                    <textarea
                            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            id="otherMedications" name="otherMedications"
                            placeholder="Write your response here..."
                            rows="4" bind:value={$form.otherMedications} {...$constraints.otherMedications}></textarea>
                    {#if $errors.otherMedications}
                        <p class="text-xs font-bold text-red-500 mt-2">{$errors.otherMedications}</p>
                    {/if}
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Do you have any of the
                        following?</label>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex items-center">
                            <input class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                   id="penisCondition" name="penisCondition" type="checkbox"
                                   bind:checked={$form.penisCondition}>
                            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                   for="penisCondition">Any condition which affects the shape of the penis such as cavernosal fibrosis; angulation or peyronie's disease</label>
                        </div>
                        <div class="flex items-center">
                            <input class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                   id="eyeCondition" name="eyeCondition" type="checkbox"
                                  bind:checked={$form.eyeCondition}>
                            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                   for="eyeCondition">Eye problems causing loss of visions such as reinitis pigmentosa; temporal arteritis; or NAION (non arteritic anterior ischaemic optic neuropathy)</label>
                        </div>
                        <div class="flex items-center">
                            <input class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                   id="sickle" name="sickle" type="checkbox"
                                   bind:checked={$form.sickle}>
                            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                   for="sickle">Sickle cell anemia</label>
                        </div>
                        <div class="flex items-center">
                            <input class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                   id="bloodCondition" name="bloodCondition" type="checkbox"
                                   bind:checked={$form.bloodCondition}>
                            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                   for="bloodCondition">Leukaemia or multiple myeloma</label>
                        </div>
                        <div class="flex items-center">
                            <input class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                   id="galactose" name="galactose" type="checkbox"
                                   bind:checked={$form.galactose}>
                            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                   for="galactose">Galactose intolerance; lapp lactase deficiency or glucose-galactose malabsorption</label>
                        </div>
                        <div class="flex items-center">
                            <input class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                   id="stomachCondition" name="stomachCondition" type="checkbox"
                                   bind:checked={$form.stomachCondition}>
                            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                   for="stomachCondition">Active stomach ulcers or bleeding problems (such as haemophilia)</label>
                        </div>
                </div>
            </div>
                {#if formAction === "update"}
                    <h2 class="my-4 text-xl font-semibold leading-none text-gray-900 dark:text-white">Your response</h2>
                    <div class="bg-gray-100 rounded-lg p-8">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="status">Do
                        you prescribe a 12 month sildenafil treatment plan for this patient?</label>
                    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            id="status" name="status" bind:value={$form.status} {...$constraints.status}>
                        <option disabled selected value> -- select an option --</option>
                        <option value="active">YES</option>
                        <option value="denied">NO</option>
                    </select>
                    {#if $errors.fungal}
                        <p class="text-xs font-bold text-red-500 mt-2">{$errors.fungal}</p>
                    {/if}
                </div>
                {/if}
            <button class="inline-flex justify-center items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-primary-600 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-700"
                    type="submit" on:click={formAction === 'update' ? () => { if (!confirm('Are you sure you want to submit?')) return false; } : undefined }>
                Submit
            </button>
        </form>
    </div>
</section>