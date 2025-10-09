<script lang="ts">
  import {
    CheckCircle2,
    Scale,
    Tag,
    Printer,
    ArrowRight,
    Egg,
    RotateCcw,
    Package,
    Scale as ScaleIcon,
    Clock,
    Plus,
    Trash2,
    Drumstick,
  } from "lucide-svelte";
  import { writable, get } from "svelte/store";
  let product: any;

  // Stepper data
  const steps = [
    {
      label: "Pesar",
      icon: Scale,
      description: "Coloca el producto en la báscula e ingresa el peso",
    },
    {
      label: "Seleccionar Producto",
      icon: Tag,
      description: "Elige el tipo de producto",
    },
    {
      label: "Imprimir",
      icon: Printer,
      description: "Imprime y aplica la etiqueta",
    },
  ];

  // Current step
  let currentStep = writable(0);

  // Reactive weight input
  let weight = writable("");
  let weightError = writable("");

  // Product selection
  let selectedProduct = writable("");
  let productError = writable("");

  // Products with additional data
  const products = [
    {
      id: "CB001",
      name: "Pechuga de Pollo",
      category: "Aves",
      pricePerKg: 12.99,
    },
    {
      id: "CT002",
      name: "Muslo de Pollo",
      category: "Aves",
      pricePerKg: 10.99,
    },
    {
      id: "CW003",
      name: "Alitas de Pollo",
      category: "Aves",
      pricePerKg: 8.99,
    },
    {
      id: "CD004",
      name: "Piernas de Pollo",
      category: "Aves",
      pricePerKg: 9.99,
    },
    {
      id: "WC005",
      name: "Pollo Entero",
      category: "Aves",
      pricePerKg: 7.99,
    },
    {
      id: "BF006",
      name: "Filete de Res",
      category: "Carnes Rojas",
      pricePerKg: 24.99,
    },
    {
      id: "BS007",
      name: "Lomo de Res",
      category: "Carnes Rojas",
      pricePerKg: 19.99,
    },
  ];

  // Mock recent items
  const recentItems = writable([
    {
      name: "Pechuga de Pollo",
      id: "LB12345",
      weight: "1.2 kg",
      time: "10:30 AM",
      price: "$14.39",
    },
    {
      name: "Muslo de Pollo",
      id: "LT67890",
      weight: "1.5 kg",
      time: "11:00 AM",
      price: "$16.49",
    },
    {
      name: "Alitas de Pollo",
      id: "LW24680",
      weight: "0.8 kg",
      time: "11:30 AM",
      price: "$7.19",
    },
  ]);

  // Batch statistics
  const batchStats = writable({
    itemsLabeled: 256,
    totalWeight: 320.5,
    averageWeight: 1.25,
    batchStartTime: "09:00 AM",
  });

  // Simulate scale reading
  let isScaleConnected = writable(true);
  let isReadingWeight = writable(false);

  // Function to validate and proceed to next step
  function nextStep() {
    const current = get(currentStep);

    if (current === 0) {
      // Validate weight
      const weightValue = parseFloat(get(weight));
      if (!get(weight) || isNaN(weightValue) || weightValue <= 0) {
        weightError.set("Peso Inválido");
        return;
      }
      weightError.set("");
    } else if (current === 1) {
      // Validate product selection
      if (!get(selectedProduct)) {
        productError.set("Selecciona un producto");
        return;
      }
      productError.set("");
    }

    // Move to next step
    if (current < steps.length - 1) {
      currentStep.update((n) => n + 1);
    } else {
      // Final step - print label and reset
      printLabel();
    }
  }

  // Function to go back to previous step
  function prevStep() {
    currentStep.update((n) => Math.max(0, n - 1));
  }

  // Function to reset the process
  function resetProcess() {
    currentStep.set(0);
    weight.set("");
    selectedProduct.set("");
    weightError.set("");
    productError.set("");
  }

  // Function to simulate printing
  function printLabel() {
    // Add to recent items
    const newItem = {
      name: get(selectedProduct),
      id: generateId(),
      weight: `${get(weight)} kg`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      price: calculatePrice(),
    };

    recentItems.update((items) => [newItem, ...items.slice(0, 4)]);

    // Update batch stats
    batchStats.update((stats) => ({
      ...stats,
      itemsLabeled: stats.itemsLabeled + 1,
      totalWeight: stats.totalWeight + parseFloat(get(weight)),
      averageWeight:
        (stats.totalWeight + parseFloat(get(weight))) /
        (stats.itemsLabeled + 1),
    }));

    // Reset for next item
    resetProcess();

    // Show success message
    showNotification("¡Etiqueta impresa exitosamente!");
  }

  // Helper function to generate ID
  function generateId() {
    return "LB" + Math.floor(10000 + Math.random() * 90000);
  }

  // Calculate price based on weight and product
  function calculatePrice() {
    const weightValue = parseFloat(get(weight));
    const product = products.find((p) => p.name === get(selectedProduct));
    if (product && weightValue) {
      return `$${(weightValue * product.pricePerKg).toFixed(2)}`;
    }
    return "$0.00";
  }

  // Simulate scale reading
  function simulateScaleReading() {
    if (get(isScaleConnected)) {
      isReadingWeight.set(true);
      // Simulate scale reading after a short delay
      setTimeout(() => {
        const randomWeight = (0.5 + Math.random() * 3).toFixed(2);
        weight.set(randomWeight);
        isReadingWeight.set(false);
      }, 1000);
    }
  }

  // Show notification
  function showNotification(message: string) {
    // In a real app, you would use a toast notification system
    alert(message);
  }

  // End current batch
  function endBatch() {
    if (confirm("¿Estás seguro de terminar este lote?")) {
      batchStats.set({
        itemsLabeled: 0,
        totalWeight: 0,
        averageWeight: 0,
        batchStartTime: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      recentItems.set([]);
      showNotification("¡Lote Completado!");
    }
  }
  $: product = products.find((p) => p.name === $selectedProduct);
  $: estimatedPrice = weight ? calculatePrice() : null;
</script>

<main class="flex-1 p-8 ml-64 bg-gray-50 min-h-screen">
  <!-- Header -->
  <div class="flex flex-col gap-1">
    <!-- Top bar with centered header and right-aligned status -->
    <div class="relative flex items-center justify-center">
      <!-- Centered header -->
      <header class="text-center">
        <div
          class="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-sm border border-gray-200 mb-4"
        >
          <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 class="text-2xl font-bold text-gray-900">Pesaje y Etiquetado</h2>
        </div>
        <p class="text-gray-600 max-w-2xl mx-auto mb-5">
          Sigue los pasos indicados para asegurar un correcto pesaje y
          etiquetado
        </p>
      </header>

      <!-- Right-aligned scale status -->
      <div class="absolute right-0 flex items-center gap-2 text-sm">
        <div
          class={`flex items-center gap-1 ${$isScaleConnected ? "text-green-600" : "text-red-600"}`}
        >
          <div
            class={`w-2 h-2 rounded-full ${$isScaleConnected ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span>
            Báscula: {$isScaleConnected ? "Conectada" : "Desconectada"}
          </span>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-8 lg:grid-cols-5">
    <!-- Stepper + Weight/Input Section -->
    <div class="flex flex-col gap-6 lg:col-span-3">
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <!-- Stepper -->
        <div class="flex items-center justify-between gap-4 mb-8">
          {#each steps as step, index}
            <div class="flex flex-col items-center gap-2 relative flex-1">
              <!-- Step indicator -->
              <div class="flex items-center justify-center relative">
                <!-- Connector (before) -->
                {#if index > 0}
                  <div
                    class={`absolute right-full h-0.5 w-8 ${index <= $currentStep ? "bg-blue-600" : "bg-gray-300"}`}
                  ></div>
                {/if}

                <!-- Step circle -->
                <div
                  class={`flex size-12 items-center justify-center rounded-full border-2 ${index < $currentStep ? "border-green-500 bg-green-500 text-white" : index === $currentStep ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-400"}`}
                >
                  {#if index < $currentStep}
                    <CheckCircle2 class="w-5 h-5" />
                  {:else}
                    <svelte:component this={step.icon} class="w-5 h-5" />
                  {/if}
                </div>

                <!-- Connector (after) -->
                {#if index < steps.length - 1}
                  <div
                    class={`absolute left-full h-0.5 w-8 ${index < $currentStep ? "bg-blue-600" : "bg-gray-300"}`}
                  ></div>
                {/if}
              </div>

              <!-- Label and description -->
              <div class="text-center mt-2">
                <p
                  class={`text-sm font-medium ${index <= $currentStep ? "text-gray-900" : "text-gray-500"}`}
                >
                  {step.label}
                </p>
                <p class="text-xs text-gray-500 mt-1 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          {/each}
        </div>

        <!-- Step Content -->
        <div class="mt-6">
          {#if $currentStep === 0}
            <!-- Weight Input Step -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ingresar Peso (kg) *
                </label>
                <div class="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    bind:value={$weight}
                    class="w-full rounded-xl border border-gray-300 bg-white p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                    placeholder="0.00"
                    disabled={$isReadingWeight}
                  />
                  {#if $isReadingWeight}
                    <div
                      class="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <div
                        class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"
                      ></div>
                    </div>
                  {/if}
                </div>
                {#if $weightError}
                  <p class="mt-1 text-sm text-red-600">{$weightError}</p>
                {/if}

                <div class="mt-4 flex gap-2">
                  <button
                    class="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    on:click={simulateScaleReading}
                    disabled={!$isScaleConnected || $isReadingWeight}
                  >
                    <ScaleIcon class="w-4 h-4" />
                    <span>Leer de Báscula</span>
                  </button>

                  <button
                    class="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    on:click={() => weight.set("")}
                  >
                    <RotateCcw class="w-4 h-4" />
                    <span>Limpiar</span>
                  </button>
                </div>
              </div>
            </div>
          {:else if $currentStep === 1}
            <!-- Product Selection Step -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Producto *
                </label>
                <select
                  bind:value={$selectedProduct}
                  class="w-full rounded-xl border border-gray-300 bg-white p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                >
                  <option value="" disabled selected
                    >Selecciona un producto</option
                  >
                  {#each products as product}
                    <option value={product.name}>
                      {product.name} - ${product.pricePerKg}/kg
                    </option>
                  {/each}
                </select>
                {#if $productError}
                  <p class="mt-1 text-sm text-red-600">{$productError}</p>
                {/if}
              </div>

              <!-- Product details preview -->
              {#if $selectedProduct && product}
                <div class="rounded-xl bg-blue-50 p-4 border border-blue-200">
                  <h4 class="font-semibold text-blue-900 mb-2">
                    Detalles del Producto
                  </h4>
                  <div class="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span class="text-blue-700">Categoría:</span>
                      <span class="ml-2 text-blue-900 font-medium"
                        >{product.category}</span
                      >
                    </div>
                    <div>
                      <span class="text-blue-700">Precio/kg:</span>
                      <span class="ml-2 text-blue-900 font-medium"
                        >${product.pricePerKg}</span
                      >
                    </div>
                  </div>

                  {#if $weight}
                    <div class="mt-2 text-sm">
                      <span class="text-blue-700">Precio Estimado:</span>
                      <span class="ml-2 font-medium text-blue-900"
                        >{estimatedPrice}</span
                      >
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
          {:else if $currentStep === 2}
            <!-- Print Preview Step -->
            <div class="space-y-6">
              <div
                class="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center"
              >
                <Printer class="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 class="text-lg font-medium text-gray-900">
                  Listo para Imprimir
                </h3>
                <p class="text-gray-600 mt-2">
                  Revisa la información antes de imprimir la etiqueta.
                </p>

                <div
                  class="mt-6 rounded-xl bg-gray-50 p-4 text-left border border-gray-200"
                >
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-600">Producto</p>
                      <p class="font-medium text-gray-900">
                        {$selectedProduct}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Peso</p>
                      <p class="font-medium text-gray-900">{$weight} kg</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Precio</p>
                      <p class="font-medium text-gray-900">
                        {calculatePrice()}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">ID de Etiqueta</p>
                      <p class="font-medium text-gray-900">{generateId()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-8 flex justify-between">
          <button
            class="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            on:click={prevStep}
            disabled={$currentStep === 0}
          >
            <span>Atrás</span>
          </button>

          <div class="flex gap-2">
            <button
              class="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              on:click={resetProcess}
            >
              <RotateCcw class="w-4 h-4" />
              <span>Reiniciar</span>
            </button>

            <button
              class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              on:click={nextStep}
              disabled={($currentStep === 0 &&
                (!$weight || parseFloat($weight) <= 0)) ||
                ($currentStep === 1 && !$selectedProduct)}
            >
              <span>
                {$currentStep === steps.length - 1
                  ? "Imprimir Etiqueta"
                  : "Continuar"}
              </span>
              {#if $currentStep < steps.length - 1}
                <ArrowRight class="w-4 h-4" />
              {/if}
            </button>
          </div>
        </div>
      </div>

      <!-- Batch Progress -->
      <div class="flex flex-col gap-4">
        <h3 class="text-xl font-bold text-gray-900">Progreso del Lote</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div
            class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div class="flex items-center gap-2">
              <Package class="w-5 h-5 text-blue-600" />
              <p class="text-sm text-gray-600">Artículos Etiquetados</p>
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {$batchStats.itemsLabeled}
            </p>
          </div>
          <div
            class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div class="flex items-center gap-2">
              <Scale class="w-5 h-5 text-green-600" />
              <p class="text-sm text-gray-600">Peso Total</p>
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {$batchStats.totalWeight.toFixed(1)}
              <span class="text-lg font-normal">kg</span>
            </p>
          </div>
          <div
            class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div class="flex items-center gap-2">
              <Scale class="w-5 h-5 text-purple-600" />
              <p class="text-sm text-gray-600">Peso Promedio</p>
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {$batchStats.averageWeight.toFixed(2)}
              <span class="text-lg font-normal">kg</span>
            </p>
          </div>
          <div
            class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div class="flex items-center gap-2">
              <Clock class="w-5 h-5 text-orange-600" />
              <p class="text-sm text-gray-600">Iniciado</p>
            </div>
            <p class="text-lg font-bold text-gray-900 mt-1">
              {$batchStats.batchStartTime}
            </p>
          </div>
        </div>
        <button
          class="mt-2 w-full rounded-xl border border-red-300 bg-white px-6 py-3 font-semibold text-red-600 transition-colors hover:bg-red-50"
          on:click={endBatch}
        >
          Terminar Lote Actual
        </button>
      </div>
    </div>

    <!-- Recently Labeled Items -->
    <div class="flex flex-col gap-6 lg:col-span-2">
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-gray-900">
            Artículos Etiquetados Recientemente
          </h3>
          <span class="text-sm text-gray-600">
            {$recentItems.length} artículos
          </span>
        </div>

        {#if $recentItems.length === 0}
          <div class="text-center py-8">
            <Package class="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p class="text-gray-600">No hay artículos recientes</p>
            <p class="text-sm text-gray-500 mt-1">
              Los artículos etiquetados aparecerán aquí
            </p>
          </div>
        {:else}
          <div class="space-y-3 max-h-[500px] overflow-y-auto">
            {#each $recentItems as item, index}
              <div
                class="flex items-center justify-between rounded-xl bg-gray-50 p-3 transition-colors hover:bg-gray-100 border border-gray-200"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                  >
                    <Drumstick class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">
                      {item.name}
                    </p>
                    <p class="text-sm text-gray-600">
                      ID: {item.id}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-900">
                    {item.weight}
                  </p>
                  <p class="text-sm text-gray-600">
                    {item.price}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {item.time}
                  </p>
                </div>
              </div>
            {/each}
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200">
            <button
              class="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              on:click={() => recentItems.set([])}
            >
              <Trash2 class="w-4 h-4" />
              <span>Limpiar Todo</span>
            </button>
          </div>
        {/if}
      </div>

      <!-- Quick Actions -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h3>
        <div class="grid grid-cols-2 gap-3">
          <button
            class="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
            on:click={resetProcess}
          >
            <RotateCcw class="w-6 h-6 text-gray-600" />
            <span class="text-sm font-medium text-gray-700"
              >Reiniciar Proceso</span
            >
          </button>
          <button
            class="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
            on:click={simulateScaleReading}
          >
            <Scale class="w-6 h-6 text-gray-600" />
            <span class="text-sm font-medium text-gray-700">Leer Báscula</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  /* Custom scrollbar for recent items */
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
