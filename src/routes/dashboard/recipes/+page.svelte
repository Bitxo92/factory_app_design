<script lang="ts">
  import { fly, fade } from "svelte/transition";

  let currentStep = 1;
  const totalSteps = 5;

  let showSuccessModal = false;

  // Datos del formulario
  let recetaSeleccionada = "";
  const categoriasRecetas = {
    Aves: [
      "Pechuga de Pollo Premium",
      "Muslos de Pollo Marinados",
      "Alitas BBQ",
    ],
    "Carnes Rojas": [
      "Lomo de Res Premium",
      "Costillas de Cerdo",
      "Carne Molida Especial",
    ],
    Embutidos: [
      "Salchichas Tradicionales",
      "Chorizo Casero",
      "Mortadela Premium",
    ],
    Especiales: [
      "Receta Orgánica",
      "Receta Sin Gluten",
      "Receta Baja en Sodio",
    ],
  };

  // Ingredientes
  let tipoIngrediente = "";
  let pesoIngrediente = "";
  let ingredientes: Array<{ tipo: string; peso: string }> = [];

  // Aditivos
  const aditivosDisponibles = [
    {
      nombre: "Glutamato monosódico",
      categoria: "Potenciador",
      maxDosis: "10g/kg",
    },
    { nombre: "Fosfatos", categoria: "Estabilizante", maxDosis: "5g/kg" },
    {
      nombre: "Nitrito de sodio",
      categoria: "Conservante",
      maxDosis: "0.15g/kg",
    },
    { nombre: "Ácido Ascórbico", categoria: "Antioxidante", maxDosis: "1g/kg" },
    { nombre: "Ergogastina", categoria: "Enzima", maxDosis: "0.5g/kg" },
    { nombre: "Sodio caseinato", categoria: "Proteína", maxDosis: "8g/kg" },
  ];
  let aditivoSeleccionado = "";
  let dosisAditivo = "";
  let aditivos: Array<{ nombre: string; dosis: string }> = [];

  // Amasado
  let minutosAmasado = "";
  let horaInicio = "";
  let horaFin = "";
  let temperaturaAmasado = "";

  // Revisión / ID
  let recetaId = "";

  // Estado de validación
  let errors = {
    receta: "",
    ingrediente: "",
    peso: "",
    aditivo: "",
    dosis: "",
    amasado: "",
  };

  // Reactive statement para información del aditivo
  $: infoAditivo = getAditivoInfo(aditivoSeleccionado);

  function confirmRecipe(event: Event) {
    event.preventDefault();
    if (validateStep(5)) {
      showSuccessModal = true;
    }
  }

  // Validaciones mejoradas por paso
  function validateStep(step: number): boolean {
    const newErrors = {
      receta: "",
      ingrediente: "",
      peso: "",
      aditivo: "",
      dosis: "",
      amasado: "",
    };

    if (step === 1) {
      if (!recetaSeleccionada) {
        newErrors.receta = "Debes seleccionar una receta";
      }
    }

    if (step === 2) {
      if (ingredientes.length === 0) {
        newErrors.ingrediente = "Debes agregar al menos un ingrediente";
      }
    }

    if (step === 3) {
      if (aditivos.length === 0) {
        newErrors.aditivo = "Debes agregar al menos un aditivo";
      }
    }

    if (step === 4) {
      const minutos = minutosAmasado;
      const minutosNum = parseFloat(minutos);
      if (!minutos || isNaN(minutosNum) || minutosNum <= 0) {
        newErrors.amasado = "Los minutos de amasado deben ser mayores a 0";
      }
    }

    errors = newErrors;
    return Object.values(newErrors).every((error) => error === "");
  }

  function canProceed(): boolean {
    return validateStep(currentStep);
  }

  function nextStep() {
    if (!canProceed()) {
      return;
    }
    if (currentStep === 4) {
      calcularHorario();
      recetaId = "RC" + Date.now().toString().slice(-8);
    }
    if (currentStep < totalSteps) {
      currentStep = currentStep + 1;
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep = currentStep - 1;
    }
  }

  function calcularHorario() {
    const ahora = new Date();
    horaInicio = ahora.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const minutosNum = parseFloat(minutosAmasado || "0");
    const fin = new Date(ahora.getTime() + minutosNum * 60000);
    horaFin = fin.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function agregarIngrediente() {
    if (tipoIngrediente && pesoIngrediente && parseFloat(pesoIngrediente) > 0) {
      ingredientes = [
        ...ingredientes,
        {
          tipo: tipoIngrediente,
          peso: pesoIngrediente,
        },
      ];
      tipoIngrediente = "";
      pesoIngrediente = "";
    }
  }

  function eliminarIngrediente(index: number) {
    ingredientes = ingredientes.filter((_, i) => i !== index);
  }

  function agregarAditivo() {
    if (aditivoSeleccionado && dosisAditivo) {
      aditivos = [
        ...aditivos,
        {
          nombre: aditivoSeleccionado,
          dosis: dosisAditivo,
        },
      ];
      aditivoSeleccionado = "";
      dosisAditivo = "";
    }
  }

  function eliminarAditivo(index: number) {
    aditivos = aditivos.filter((_, i) => i !== index);
  }

  function getAditivoInfo(nombre: string) {
    return aditivosDisponibles.find((ad) => ad.nombre === nombre);
  }

  function calcularPesoTotal(): number {
    return ingredientes.reduce(
      (total, ing) => total + parseFloat(ing.peso || "0"),
      0
    );
  }

  function resetForm() {
    recetaSeleccionada = "";
    ingredientes = [];
    aditivos = [];
    minutosAmasado = "";
    temperaturaAmasado = "";
    currentStep = 1;
    errors = {
      receta: "",
      ingrediente: "",
      peso: "",
      aditivo: "",
      dosis: "",
      amasado: "",
    };
  }
</script>

<main class="flex flex-1 justify-center py-8 bg-gray-50 min-h-screen ml-64">
  <div class="w-full max-w-4xl px-4 {showSuccessModal ? 'blur-sm' : ''}">
    <!-- Header Mejorado -->
    <div class="mb-8 text-center">
      <div
        class="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-sm border border-gray-200"
      >
        <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <h2 class="text-2xl font-bold text-gray-900">
          Crear Nueva Receta de Producción
        </h2>
      </div>
      <p class="mt-3 text-gray-600 max-w-2xl mx-auto">
        Sigue los pasos guiados para crear una receta de producción completa con
        todos los ingredientes y parámetros necesarios.
      </p>
    </div>

    <!-- Stepper Mejorado -->
    <div class="w-full mb-8">
      <div
        class="mx-auto flex w-full max-w-3xl items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-200"
      >
        {#each Array(totalSteps) as _, i}
          <div class="flex flex-col items-center text-center relative z-10">
            <div class="relative">
              <!-- Círculo del paso -->
              <div
                class="flex h-14 w-14 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300
                {currentStep === i + 1
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                  : currentStep > i + 1
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'}"
              >
                {#if currentStep > i + 1}
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                {:else}
                  {i + 1}
                {/if}
              </div>

              <!-- Línea conectora -->
              {#if i < totalSteps - 1}
                <div
                  class="absolute top-1/2 left-full w-16 h-0.5 -translate-y-1/2
                  {currentStep > i + 1 ? 'bg-green-500' : 'bg-gray-200'}"
                ></div>
              {/if}
            </div>

            <!-- Etiqueta -->
            <p
              class="mt-3 text-sm font-medium max-w-20 leading-tight
              {currentStep >= i + 1 ? 'text-gray-900' : 'text-gray-400'}"
            >
              {#if i === 0}Receta{/if}
              {#if i === 1}Ingredientes{/if}
              {#if i === 2}Aditivos{/if}
              {#if i === 3}Amasado{/if}
              {#if i === 4}Revisión{/if}
            </p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Contenido del Formulario -->
    <form class="space-y-6" on:submit|preventDefault={confirmRecipe}>
      <!-- Paso 1: Selección de Receta -->
      {#if currentStep === 1}
        <div
          in:fly={{ y: 20, duration: 300 }}
          out:fade
          class="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
        >
          <div class="flex items-center gap-3 mb-6">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold"
            >
              1
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">
                Selección de Receta
              </h3>
              <p class="text-gray-600 text-sm">
                Elige la receta base para tu producción
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <label class="flex flex-col">
              <span class="mb-3 text-sm font-medium text-gray-700"
                >Categoría de Receta *</span
              >
              <select
                bind:value={recetaSeleccionada}
                class="w-full rounded-xl border border-gray-300 bg-white p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              >
                <option value="">-- Selecciona una receta --</option>
                {#each Object.entries(categoriasRecetas) as [categoria, recetas]}
                  <optgroup label={categoria}>
                    {#each recetas as rec}
                      <option value={rec}>{rec}</option>
                    {/each}
                  </optgroup>
                {/each}
              </select>
            </label>

            {#if errors.receta}
              <p
                class="text-red-600 text-sm font-medium flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
                {errors.receta}
              </p>
            {/if}

            {#if recetaSeleccionada}
              <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 class="font-semibold text-blue-900 mb-2">
                  Información de la Receta
                </h4>
                <p class="text-blue-800 text-sm">
                  Receta seleccionada: <strong>{recetaSeleccionada}</strong>
                </p>
                <p class="text-blue-700 text-sm mt-1">
                  Esta receta incluye parámetros predefinidos de calidad y
                  tiempos de procesamiento optimizados.
                </p>
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Paso 2: Ingredientes -->
      {#if currentStep === 2}
        <div
          in:fly={{ y: 20, duration: 300 }}
          out:fade
          class="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
        >
          <div class="flex items-center gap-3 mb-6">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold"
            >
              2
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">
                Gestión de Ingredientes
              </h3>
              <p class="text-gray-600 text-sm">
                Agrega los ingredientes principales de la receta
              </p>
            </div>
          </div>

          <div class="space-y-6">
            <!-- Formulario para agregar ingrediente -->
            <div
              class="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-gray-50 rounded-xl p-4"
            >
              <label class="flex flex-col">
                <span class="mb-2 text-sm font-medium text-gray-700"
                  >Tipo de Ingrediente *</span
                >
                <select
                  bind:value={tipoIngrediente}
                  class="rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Pollo">Pollo</option>
                  <option value="Carne de Res">Carne de Res</option>
                  <option value="Cerdo">Cerdo</option>
                  <option value="Pavo">Pavo</option>
                  <option value="Condimentos">Condimentos</option>
                  <option value="Especias">Especias</option>
                </select>
              </label>
              <label class="flex flex-col">
                <span class="mb-2 text-sm font-medium text-gray-700"
                  >Peso (kg) *</span
                >
                <input
                  type="number"
                  bind:value={pesoIngrediente}
                  min="0.1"
                  step="0.1"
                  placeholder="Ej: 2.5"
                  class="rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </label>
              <div class="sm:col-span-2">
                <button
                  type="button"
                  on:click={agregarIngrediente}
                  class="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!tipoIngrediente ||
                    !pesoIngrediente ||
                    parseFloat(pesoIngrediente) <= 0}
                >
                  <div class="flex items-center justify-center gap-2">
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Agregar Ingrediente
                  </div>
                </button>
              </div>
            </div>

            <!-- Lista de ingredientes agregados -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-semibold text-gray-900">
                  Ingredientes Agregados
                </h4>
                <span class="text-sm text-gray-600"
                  >{ingredientes.length} ingrediente(s)</span
                >
              </div>

              {#if ingredientes.length === 0}
                <div
                  class="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
                >
                  <svg
                    class="w-12 h-12 text-gray-400 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p class="text-gray-500">No hay ingredientes agregados</p>
                  <p class="text-gray-400 text-sm mt-1">
                    Agrega al menos un ingrediente para continuar
                  </p>
                </div>
              {:else}
                <div class="space-y-3 max-h-60 overflow-y-auto">
                  {#each ingredientes as ingrediente, index}
                    <div
                      class="flex items-center justify-between bg-green-50 rounded-lg p-4 border border-green-200"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                        >
                          <svg
                            class="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <p class="font-medium text-gray-900">
                            {ingrediente.tipo}
                          </p>
                          <p class="text-sm text-gray-600">
                            {ingrediente.peso} kg
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        title="button"
                        on:click={() => eliminarIngrediente(index)}
                        class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  {/each}
                </div>

                <div
                  class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-blue-900">Peso Total:</span>
                    <span class="text-xl font-bold text-blue-900"
                      >{calcularPesoTotal().toFixed(2)} kg</span
                    >
                  </div>
                </div>
              {/if}

              {#if errors.ingrediente}
                <p
                  class="text-red-600 text-sm font-medium mt-3 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {errors.ingrediente}
                </p>
              {/if}
            </div>
          </div>
        </div>
      {/if}

      <!-- Paso 3: Aditivos -->
      {#if currentStep === 3}
        <div
          in:fly={{ y: 20, duration: 300 }}
          out:fade
          class="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
        >
          <div class="flex items-center gap-3 mb-6">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold"
            >
              3
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">
                Gestión de Aditivos
              </h3>
              <p class="text-gray-600 text-sm">
                Agrega los aditivos necesarios para la receta
              </p>
            </div>
          </div>

          <div class="space-y-6">
            <!-- Formulario para agregar aditivo -->
            <div
              class="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-gray-50 rounded-xl p-4"
            >
              <label class="flex flex-col">
                <span class="mb-2 text-sm font-medium text-gray-700"
                  >Aditivo *</span
                >
                <select
                  bind:value={aditivoSeleccionado}
                  class="rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                >
                  <option value="">-- Selecciona aditivo --</option>
                  {#each aditivosDisponibles as ad}
                    <option value={ad.nombre}>{ad.nombre}</option>
                  {/each}
                </select>
              </label>
              <label class="flex flex-col">
                <span class="mb-2 text-sm font-medium text-gray-700"
                  >Dosis *</span
                >
                <input
                  type="text"
                  bind:value={dosisAditivo}
                  placeholder="Ej: 1.5 g/kg"
                  class="rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </label>
              <div class="sm:col-span-2">
                <button
                  type="button"
                  on:click={agregarAditivo}
                  class="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!aditivoSeleccionado || !dosisAditivo}
                >
                  <div class="flex items-center justify-center gap-2">
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Agregar Aditivo
                  </div>
                </button>
              </div>
            </div>

            <!-- Información del aditivo seleccionado -->
            {#if aditivoSeleccionado && infoAditivo}
              <div class="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <h4 class="font-semibold text-purple-900 mb-2">
                  Información del Aditivo
                </h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-purple-700">Categoría:</span>
                    <span class="ml-2 text-purple-900 font-medium"
                      >{infoAditivo.categoria}</span
                    >
                  </div>
                  <div>
                    <span class="text-purple-700">Dosis Máxima:</span>
                    <span class="ml-2 text-purple-900 font-medium"
                      >{infoAditivo.maxDosis}</span
                    >
                  </div>
                </div>
              </div>
            {/if}

            <!-- Lista de aditivos agregados -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-semibold text-gray-900">Aditivos Agregados</h4>
                <span class="text-sm text-gray-600"
                  >{aditivos.length} aditivo(s)</span
                >
              </div>

              {#if aditivos.length === 0}
                <div
                  class="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
                >
                  <svg
                    class="w-12 h-12 text-gray-400 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <p class="text-gray-500">No hay aditivos agregados</p>
                  <p class="text-gray-400 text-sm mt-1">
                    Agrega al menos un aditivo para continuar
                  </p>
                </div>
              {:else}
                <div class="space-y-3 max-h-60 overflow-y-auto">
                  {#each aditivos as aditivo, index}
                    <div
                      class="flex items-center justify-between bg-purple-50 rounded-lg p-4 border border-purple-200"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"
                        >
                          <svg
                            class="w-5 h-5 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <p class="font-medium text-gray-900">
                            {aditivo.nombre}
                          </p>
                          <p class="text-sm text-gray-600">
                            Dosis: {aditivo.dosis}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        title="button"
                        on:click={() => eliminarAditivo(index)}
                        class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  {/each}
                </div>
              {/if}

              {#if errors.aditivo}
                <p
                  class="text-red-600 text-sm font-medium mt-3 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {errors.aditivo}
                </p>
              {/if}
            </div>
          </div>
        </div>
      {/if}

      <!-- Paso 4: Amasado -->
      {#if currentStep === 4}
        <div
          in:fly={{ y: 20, duration: 300 }}
          out:fade
          class="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
        >
          <div class="flex items-center gap-3 mb-6">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold"
            >
              4
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">
                Parámetros de Amasado
              </h3>
              <p class="text-gray-600 text-sm">
                Configura los tiempos y temperatura del proceso
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label class="flex flex-col">
              <span class="mb-3 text-sm font-medium text-gray-700"
                >Minutos de Amasado *</span
              >
              <input
                type="number"
                bind:value={minutosAmasado}
                min="1"
                placeholder="Ej: 15"
                class="rounded-xl border border-gray-300 bg-white p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              />
              {#if errors.amasado}
                <p
                  class="text-red-600 text-sm font-medium mt-2 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {errors.amasado}
                </p>
              {/if}
            </label>

            <label class="flex flex-col">
              <span class="mb-3 text-sm font-medium text-gray-700"
                >Temperatura (°C)</span
              >
              <input
                type="number"
                bind:value={temperaturaAmasado}
                min="0"
                max="30"
                placeholder="Ej: 12"
                class="rounded-xl border border-gray-300 bg-white p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </label>
          </div>

          {#if minutosAmasado && parseFloat(minutosAmasado) > 0}
            <div class="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 class="font-semibold text-blue-900 mb-2">
                Proyección del Proceso
              </h4>
              <p class="text-blue-800 text-sm">
                Al avanzar al siguiente paso, se calcularán automáticamente las
                horas de inicio y fin del proceso de amasado.
              </p>
              <p class="text-blue-700 text-sm mt-2">
                <strong>Duración estimada:</strong>
                {minutosAmasado} minutos
              </p>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Paso 5: Revisión -->
      {#if currentStep === 5}
        <div
          in:fly={{ y: 20, duration: 300 }}
          out:fade
          class="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
        >
          <div class="flex items-center gap-3 mb-6">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold"
            >
              5
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">
                Revisión y Confirmación
              </h3>
              <p class="text-gray-600 text-sm">
                Verifica toda la información antes de confirmar
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Resumen de la Receta -->
            <div class="space-y-4">
              <h4 class="font-bold text-gray-900 text-lg border-b pb-2">
                Resumen de la Receta
              </h4>

              <div class="space-y-3">
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-gray-600">ID de Receta:</span>
                  <span class="font-mono font-bold text-blue-600"
                    >{recetaId}</span
                  >
                </div>

                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-gray-600">Receta:</span>
                  <span class="font-semibold text-gray-900"
                    >{recetaSeleccionada}</span
                  >
                </div>

                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-gray-600">Peso Total:</span>
                  <span class="font-semibold text-gray-900"
                    >{calcularPesoTotal().toFixed(2)} kg</span
                  >
                </div>

                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-gray-600">Minutos de Amasado:</span>
                  <span class="font-semibold text-gray-900"
                    >{minutosAmasado}</span
                  >
                </div>

                {#if temperaturaAmasado}
                  <div
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-gray-600">Temperatura:</span>
                    <span class="font-semibold text-gray-900"
                      >{temperaturaAmasado}°C</span
                    >
                  </div>
                {/if}

                <div
                  class="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span class="text-gray-600">Hora Inicio:</span>
                  <span class="font-semibold text-gray-900">{horaInicio}</span>
                </div>

                <div class="flex justify-between items-center py-2">
                  <span class="text-gray-600">Hora Fin:</span>
                  <span class="font-semibold text-gray-900">{horaFin}</span>
                </div>
              </div>
            </div>

            <!-- Detalles de Ingredientes y Aditivos -->
            <div class="space-y-6">
              <!-- Ingredientes -->
              <div>
                <h4 class="font-bold text-gray-900 mb-3">
                  Ingredientes ({ingredientes.length})
                </h4>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                  {#each ingredientes as ingrediente}
                    <div
                      class="flex justify-between items-center bg-green-50 rounded-lg px-3 py-2"
                    >
                      <span class="text-sm text-gray-700"
                        >{ingrediente.tipo}</span
                      >
                      <span class="text-sm font-semibold text-gray-900"
                        >{ingrediente.peso} kg</span
                      >
                    </div>
                  {/each}
                </div>
              </div>

              <!-- Aditivos -->
              <div>
                <h4 class="font-bold text-gray-900 mb-3">
                  Aditivos ({aditivos.length})
                </h4>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                  {#each aditivos as aditivo}
                    <div
                      class="flex justify-between items-center bg-purple-50 rounded-lg px-3 py-2"
                    >
                      <span class="text-sm text-gray-700">{aditivo.nombre}</span
                      >
                      <span class="text-sm font-semibold text-gray-900"
                        >{aditivo.dosis}</span
                      >
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          </div>

          <!-- Nota importante -->
          <div
            class="mt-6 bg-yellow-50 rounded-xl p-4 border border-yellow-200"
          >
            <div class="flex items-start gap-3">
              <svg
                class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <div>
                <p class="text-yellow-800 font-medium">
                  Verificación importante
                </p>
                <p class="text-yellow-700 text-sm mt-1">
                  Por favor, verifica que toda la información sea correcta antes
                  de confirmar la receta. Una vez confirmada, la receta será
                  registrada en el sistema de producción.
                </p>
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Botones de Navegación Mejorados -->
      <div class="flex justify-between items-center pt-6">
        <button
          type="button"
          on:click={prevStep}
          class="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-8 py-4 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
          disabled={currentStep === 1}
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Atrás
        </button>

        <div class="flex items-center gap-4">
          <button
            type="button"
            on:click={resetForm}
            class="rounded-xl border border-red-300 bg-white px-6 py-4 font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 hover:shadow-sm"
          >
            Reiniciar
          </button>

          {#if currentStep < totalSteps}
            <button
              type="button"
              on:click={nextStep}
              class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              Siguiente
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          {:else}
            <button
              type="submit"
              class="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-8 py-4 font-semibold text-white hover:bg-green-700 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Confirmar Receta
            </button>
          {/if}
        </div>
      </div>
    </form>
  </div>

  <!-- Modal de Éxito Mejorado -->
  {#if showSuccessModal}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      transition:fade
    >
      <div
        class="bg-white rounded-2xl p-8 flex flex-col items-center space-y-6 max-w-md mx-4 shadow-xl"
        transition:fly={{ y: -20, duration: 400 }}
      >
        <div
          class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
        >
          <svg
            class="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            ¡Receta Creada con Éxito!
          </h3>
          <p class="text-gray-600">
            La receta <strong>{recetaSeleccionada}</strong> ha sido registrada correctamente
            en el sistema.
          </p>
          <p class="text-sm text-gray-500 mt-2">
            ID: <span class="font-mono">{recetaId}</span>
          </p>
        </div>

        <div class="flex gap-3 w-full">
          <button
            class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            on:click={() => {
              showSuccessModal = false;
              resetForm();
            }}
          >
            Crear Otra Receta
          </button>
          <button
            class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            on:click={() => {
              showSuccessModal = false;
            }}
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  /* Scrollbar personalizado */
  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
</style>
