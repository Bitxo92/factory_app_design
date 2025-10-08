<script lang="ts">
  import { fly, fade } from "svelte/transition";

  let currentStep = 1;
  const totalSteps = 5;

  // Datos del formulario
  let recetaSeleccionada = "";
  const recetas = [
    "Receta 1",
    "Receta 2",
    "Receta 3",
    "Receta 4",
    "Receta 5",
    "Receta 6",
  ];

  // Ingredientes
  let tipoIngrediente = "";
  let pesoIngrediente = "";

  // Aditivos
  const aditivosDisponibles = [
    "Glutamato monosódico",
    "Fosfatos",
    "Nitrito de sodio",
    "Ascórbico",
    "Ergogastina",
    "Sodio caseinato",
  ];
  let aditivoSeleccionado = "";
  let dosisAditivo = "";

  // Amasado
  let minutosAmasado: number | null = null;
  let horaInicio: string = "";
  let horaFin: string = "";

  // Revisión / ID
  let recetaId = "";

  // Validaciones básicas por paso
  function canProceed() {
    if (currentStep === 1) {
      return recetaSeleccionada.trim() !== "";
    }
    if (currentStep === 2) {
      return tipoIngrediente.trim() !== "" && Number(pesoIngrediente) !== 0;
    }
    if (currentStep === 3) {
      return aditivoSeleccionado.trim() !== "" && dosisAditivo.trim() !== "";
    }
    if (currentStep === 4) {
      return minutosAmasado !== null && minutosAmasado > 0;
    }
    return true;
  }

  function nextStep() {
    if (!canProceed()) {
      alert("Por favor completa los campos obligatorios antes de continuar.");
      return;
    }
    if (currentStep === 4) {
      // Antes de ir a revisión, calcular horas y generar ID
      calcularHorario();
      recetaId = "73475343rh3h4r3r4";
    }
    if (currentStep < totalSteps) currentStep += 1;
  }

  function prevStep() {
    if (currentStep > 1) currentStep -= 1;
  }

  function calcularHorario() {
    const ahora = new Date();
    // Hora de inicio es ahora
    horaInicio = ahora.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    // Hora de fin sumando minutos
    const fin = new Date(ahora.getTime() + (minutosAmasado as number) * 60000);
    horaFin = fin.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
</script>

<main class="flex flex-1 justify-center py-12 bg-white min-h-screen ml-64">
  <div class="w-full max-w-4xl px-4">
    <div class="mb-12 text-center">
      <h2 class="text-3xl font-bold text-black">Crear Nueva Receta</h2>
      <p class="mt-2 text-black/70">
        Sigue los pasos para crear una receta de producción.
      </p>
    </div>

    <!-- Stepper -->
    <div class="w-full mb-12">
      <div class="mx-auto flex w-full max-w-2xl items-center">
        {#each Array(totalSteps) as _, i}
          <div class="flex flex-col items-center text-center">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full
              {currentStep === i + 1
                ? 'bg-gray-700 text-white'
                : currentStep > i + 1
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-400 text-black/40'}"
            >
              {i + 1}
            </div>
            <p
              class="mt-2 text-sm font-medium {currentStep === i + 1
                ? 'text-black'
                : 'text-black/60'}"
            >
              {#if i === 0}Selección{/if}
              {#if i === 1}Ingrediente{/if}
              {#if i === 2}Aditivado{/if}
              {#if i === 3}Amasado{/if}
              {#if i === 4}Revisión{/if}
            </p>
          </div>
          {#if i < totalSteps - 1}
            <div
              class="flex-1 border-t-2 border-dashed {currentStep > i + 1
                ? 'border-gray-700'
                : 'border-gray-400'}"
            ></div>
          {/if}
        {/each}
      </div>
    </div>

    <form class="space-y-8">
      {#if currentStep === 1}
        <div
          in:fly={{ y: 20, duration: 300 }}
          out:fade
          class="rounded-xl border border-gray-400 bg-gray-100 p-8"
        >
          <h3 class="text-xl font-bold text-black mb-4">
            Paso 1: Selección de receta *
          </h3>
          <label class="flex flex-col">
            <span class="mb-2 text-sm text-black">Receta</span>
            <select
              bind:value={recetaSeleccionada}
              class="form-select rounded-lg border-gray-300 bg-white p-3 text-black focus:border-gray-700 focus:ring-gray-700"
            >
              <option value="">-- Selecciona una receta --</option>
              {#each recetas as rec}
                <option value={rec}>{rec}</option>
              {/each}
            </select>
          </label>
        </div>
      {/if}

      {#if currentStep === 2}
        <div
          in:fly={{ y: 20, duration: 300 }}
          out:fade
          class="rounded-xl border border-gray-400 bg-gray-100 p-8"
        >
          <h3 class="text-xl font-bold text-black mb-4">
            Paso 2: Ingrediente *
          </h3>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <label class="flex flex-col">
              <span class="mb-2 text-sm text-black">Tipo de ingrediente</span>
              <select
                bind:value={tipoIngrediente}
                class="form-select rounded-lg border-gray-300 bg-white p-3 text-black focus:border-gray-700 focus:ring-gray-700"
              >
                <option value="">-- Selecciona --</option>
                <option value="Pollo">Pollo</option>
                <option value="Carne">Carne</option>
              </select>
            </label>
            <label class="flex flex-col">
              <span class="mb-2 text-sm text-black">Peso (kg)</span>
              <input
                type="number"
                bind:value={pesoIngrediente}
                min="0.1"
                step="0.1"
                placeholder="e.g. 200"
                class="form-input rounded-lg border-gray-300 bg-white p-3 text-black focus:border-gray-700 focus:ring-gray-700"
              />
            </label>
          </div>
        </div>
      {/if}

      {#if currentStep === 3}
        <div
          in:fly={{ y: 20, duration: 300 }}
          out:fade
          class="rounded-xl border border-gray-400 bg-gray-100 p-8"
        >
          <h3 class="text-xl font-bold text-black mb-4">Paso 3: Aditivado *</h3>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <label class="flex flex-col">
              <span class="mb-2 text-sm text-black">Aditivo</span>
              <select
                bind:value={aditivoSeleccionado}
                class="form-select rounded-lg border-gray-300 bg-white p-3 text-black focus:border-gray-700 focus:ring-gray-700"
              >
                <option value="">-- Selecciona aditivo --</option>
                {#each aditivosDisponibles as ad}
                  <option value={ad}>{ad}</option>
                {/each}
              </select>
            </label>
            <label class="flex flex-col">
              <span class="mb-2 text-sm text-black"
                >Dosis (g / kg u otra unidad)</span
              >
              <input
                type="text"
                bind:value={dosisAditivo}
                placeholder="e.g. 1.5"
                class="form-input rounded-lg border-gray-300 bg-white p-3 text-black focus:border-gray-700 focus:ring-gray-700"
              />
            </label>
          </div>
        </div>
      {/if}

      {#if currentStep === 4}
        <div
          in:fly={{ y: 20, duration: 300 }}
          out:fade
          class="rounded-xl border border-gray-400 bg-gray-100 p-8"
        >
          <h3 class="text-xl font-bold text-black mb-4">Paso 4: Amasado *</h3>
          <label class="flex flex-col mb-4">
            <span class="mb-2 text-sm text-black">Minutos de amasado</span>
            <input
              type="number"
              bind:value={minutosAmasado}
              min="1"
              placeholder="e.g. 15"
              class="form-input rounded-lg border-gray-300 bg-white p-3 text-black focus:border-gray-700 focus:ring-gray-700"
            />
          </label>
          {#if minutosAmasado !== null && minutosAmasado > 0}
            <p class="text-black/80">
              La hora de inicio y fin se calcularán al avanzar al siguiente
              paso.
            </p>
          {/if}
        </div>
      {/if}

      {#if currentStep === 5}
        <div
          in:fly={{ y: 20, duration: 300 }}
          out:fade
          class="rounded-xl border border-gray-400 bg-gray-100 p-8"
        >
          <h3 class="text-xl font-bold text-black mb-4">
            Paso 5: Revisión / Confirmar
          </h3>
          <p class="text-black/80 mb-2">
            <strong>ID de receta:</strong>
            {recetaId}
          </p>
          <p class="text-black/80 mb-2">
            <strong>Receta seleccionada:</strong>
            {recetaSeleccionada}
          </p>
          <p class="text-black/80 mb-2">
            <strong>Ingrediente:</strong>
            {tipoIngrediente}
          </p>
          <p class="text-black/80 mb-2">
            <strong>Peso:</strong>
            {pesoIngrediente} kg
          </p>
          <p class="text-black/80 mb-2">
            <strong>Aditivo:</strong>
            {aditivoSeleccionado}
          </p>
          <p class="text-black/80 mb-2">
            <strong>Dosis de aditivo:</strong>
            {dosisAditivo}
          </p>
          <p class="text-black/80 mb-2">
            <strong>Minutos de amasado:</strong>
            {minutosAmasado}
          </p>
          <p class="text-black/80 mb-2">
            <strong>Hora inicio:</strong>
            {horaInicio}
          </p>
          <p class="text-black/80"><strong>Hora fin:</strong> {horaFin}</p>
        </div>
      {/if}

      <!-- Botones navegación -->
      <div class="flex justify-between pt-4">
        <button
          type="button"
          on:click={prevStep}
          class="flex h-12 min-w-32 items-center justify-center rounded-lg border border-gray-400 bg-gray-200 px-6 text-sm font-bold text-black/60 hover:bg-gray-300 disabled:opacity-50"
          disabled={currentStep === 1}
        >
          Atrás
        </button>
        {#if currentStep < totalSteps}
          <button
            type="button"
            on:click={nextStep}
            class="flex h-12 min-w-32 items-center justify-center rounded-lg bg-gray-700 px-6 text-sm font-bold text-white hover:opacity-80"
          >
            Siguiente
          </button>
        {:else}
          <button
            type="submit"
            class="flex h-12 min-w-32 items-center justify-center rounded-lg bg-green-600 px-6 text-sm font-bold text-white hover:opacity-80"
          >
            Confirmar
          </button>
        {/if}
      </div>
    </form>
  </div>
</main>
