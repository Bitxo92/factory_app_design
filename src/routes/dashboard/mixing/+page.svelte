<script lang="ts">
  import {
    CookingPot,
    Timer,
    Play,
    Pause,
    Square,
    User,
    Clock,
    Calendar,
  } from "lucide-svelte";

  interface Lote {
    receta: string;
    operador: string;
    inicio: string;
    fin: string;
    duracion: number; // en segundos
    progreso: number;
    tiempoRestante: number;
    estado: "detenido" | "en_progreso" | "pausado";
    intervalo?: ReturnType<typeof setInterval>;
  }

  let lotes: Lote[] = [
    {
      receta: "Pollo al Curry Premium",
      operador: "Carlos García",
      inicio: "10:30",
      fin: "11:15",
      duracion: 45 * 60,
      progreso: 35,
      tiempoRestante: 29 * 60,
      estado: "en_progreso",
    },
    {
      receta: "Fajitas de Pollo Especial",
      operador: "María Rodríguez",
      inicio: "12:00",
      fin: "12:45",
      duracion: 45 * 60,
      progreso: 0,
      tiempoRestante: 45 * 60,
      estado: "detenido",
    },
    {
      receta: "Estofado de Pollo Tradicional",
      operador: "Carlos García",
      inicio: "14:00",
      fin: "14:50",
      duracion: 50 * 60,
      progreso: 0,
      tiempoRestante: 50 * 60,
      estado: "detenido",
    },
  ];

  function start(index: number) {
    const lote = lotes[index];
    clearInterval(lote.intervalo);
    lote.estado = "en_progreso";
    lotes = [...lotes];

    lote.intervalo = setInterval(() => {
      if (lote.progreso < 100 && lote.tiempoRestante > 0) {
        lote.progreso += 100 / lote.duracion;
        lote.tiempoRestante -= 1;
      } else {
        clearInterval(lote.intervalo);
        lote.estado = "detenido";
      }
      lotes = [...lotes];
    }, 1000);
  }

  function pause(index: number) {
    const lote = lotes[index];
    clearInterval(lote.intervalo);
    lote.estado = "pausado";
    lotes = [...lotes];
  }

  function stop(index: number) {
    const lote = lotes[index];
    clearInterval(lote.intervalo);
    lote.progreso = 0;
    lote.tiempoRestante = lote.duracion;
    lote.estado = "detenido";
    lotes = [...lotes];
  }

  function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  // Inicializar el primer lote como en progreso
  $: {
    if (lotes[0].estado === "en_progreso" && !lotes[0].intervalo) {
      start(0);
    }
  }
</script>

<main class="flex-1 p-8 ml-64 bg-gray-50 min-h-screen">
  <div class="max-w-6xl mx-auto">
    <!-- Header Mejorado -->
    <header class="mb-8 text-center">
      <div
        class="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-sm border border-gray-200 mb-4"
      >
        <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <h2 class="text-2xl font-bold text-gray-900">
          Control de Mezclado de Masa
        </h2>
      </div>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Monitorea y gestiona el proceso de amasado en tiempo real. Controla el
        progreso, tiempos y estados de cada lote de producción.
      </p>
    </header>

    <!-- Estadísticas Rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <div class="flex items-center gap-2">
          <CookingPot class="w-5 h-5 text-blue-600" />
          <p class="text-sm text-gray-600">Lotes Activos</p>
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-1">
          {lotes.filter((l) => l.estado === "en_progreso").length}
        </p>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <div class="flex items-center gap-2">
          <Clock class="w-5 h-5 text-green-600" />
          <p class="text-sm text-gray-600">En Progreso</p>
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-1">
          {lotes.filter((l) => l.estado === "en_progreso").length}
        </p>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <div class="flex items-center gap-2">
          <Pause class="w-5 h-5 text-yellow-600" />
          <p class="text-sm text-gray-600">Pausados</p>
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-1">
          {lotes.filter((l) => l.estado === "pausado").length}
        </p>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <div class="flex items-center gap-2">
          <Square class="w-5 h-5 text-red-600" />
          <p class="text-sm text-gray-600">Detenidos</p>
        </div>
        <p class="text-2xl font-bold text-gray-900 mt-1">
          {lotes.filter((l) => l.estado === "detenido").length}
        </p>
      </div>
    </div>

    <!-- Lista de Lotes -->
    <div class="space-y-6">
      {#each lotes as lote, index}
        <div
          class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md"
        >
          <div
            class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6"
          >
            <!-- Información Principal -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center">
                    <CookingPot
                      class={`w-8 h-8 text-blue-600 transition-all duration-700 ${
                        lote.estado === "en_progreso" ? "animate-spin-slow" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900">
                      Lote {index + 1}: {lote.receta}
                    </h3>
                    <div class="flex items-center gap-4 mt-2">
                      <div
                        class="flex items-center gap-1 text-sm text-gray-600"
                      >
                        <User class="w-4 h-4" />
                        <span>{lote.operador}</span>
                      </div>
                      <div
                        class="flex items-center gap-1 text-sm text-gray-600"
                      >
                        <Calendar class="w-4 h-4" />
                        <span>Hoy</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Estado -->
                <div class="flex flex-col items-end gap-2">
                  {#if lote.estado === "en_progreso"}
                    <span
                      class="bg-green-100 text-green-800 px-3 py-1 text-sm font-semibold rounded-full border border-green-200 blink"
                    >
                      ● EN PROGRESO
                    </span>
                  {:else if lote.estado === "pausado"}
                    <span
                      class="bg-yellow-100 text-yellow-800 px-3 py-1 text-sm font-semibold rounded-full border border-yellow-200"
                    >
                      ⏸ PAUSADO
                    </span>
                  {:else}
                    <span
                      class="bg-red-100 text-red-800 px-3 py-1 text-sm font-semibold rounded-full border border-red-200"
                    >
                      ◼ DETENIDO
                    </span>
                  {/if}
                </div>
              </div>

              <!-- Barra de Progreso -->
              <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700"
                    >Progreso del Amasado</span
                  >
                  <span class="text-sm font-bold text-blue-600">
                    {Math.min(Number(lote.progreso.toFixed(1)), 100)}%
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div
                    class="bg-blue-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style="width: {Math.min(lote.progreso, 100)}%"
                  ></div>
                </div>
              </div>

              <!-- Información de Tiempo -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div
                  class="text-center p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <p class="text-sm font-medium text-gray-600 mb-1">
                    Hora de Inicio
                  </p>
                  <p class="text-2xl font-bold text-gray-900">
                    {lote.inicio}
                    <span class="text-lg font-normal text-gray-600">AM</span>
                  </p>
                </div>
                <div
                  class="text-center p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <p class="text-sm font-medium text-gray-600 mb-1">
                    Hora de Fin
                  </p>
                  <p class="text-2xl font-bold text-gray-900">
                    {lote.fin}
                    <span class="text-lg font-normal text-gray-600">AM</span>
                  </p>
                </div>
                <div
                  class="text-center p-4 bg-green-50 rounded-xl border border-green-200"
                >
                  <div class="flex items-center justify-center gap-2 mb-1">
                    <Timer class="w-4 h-4 text-green-600" />
                    <p class="text-sm font-medium text-green-700">
                      Tiempo Restante
                    </p>
                  </div>
                  <p class="text-2xl font-bold text-green-800">
                    {formatTime(lote.tiempoRestante)}
                  </p>
                </div>
              </div>
            </div>

            <!-- Controles -->
            <div class="lg:w-48 flex lg:flex-col gap-3 justify-center">
              <button
                on:click={() => start(index)}
                class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md flex-1 lg:flex-none hover:cursor-pointer"
                disabled={lote.estado === "en_progreso"}
              >
                <Play class="w-4 h-4" />
                <span class="lg:hidden xl:inline">Iniciar</span>
              </button>

              <button
                on:click={() => pause(index)}
                class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-yellow-600 text-white font-semibold transition-all hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md flex-1 lg:flex-none hover:cursor-pointer"
                disabled={lote.estado !== "en_progreso"}
              >
                <Pause class="w-4 h-4" />
                <span class="lg:hidden xl:inline">Pausar</span>
              </button>

              <button
                on:click={() => stop(index)}
                class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold transition-all hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md flex-1 lg:flex-none hover:cursor-pointer"
                disabled={lote.estado === "detenido"}
              >
                <Square class="w-4 h-4" />
                <span class="lg:hidden xl:inline">Detener</span>
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Información Adicional -->
    <div class="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <div
            class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
          >
            <Clock class="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div>
          <h4 class="font-semibold text-blue-900 mb-2">
            Información del Proceso
          </h4>
          <p class="text-blue-800 text-sm">
            El sistema de control de amasado monitorea automáticamente el
            progreso de cada lote. Los tiempos se calculan en base a la duración
            programada y el progreso se actualiza en tiempo real.
          </p>
          <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-blue-700">En Progreso: Amasado activo</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span class="text-blue-700">Pausado: Proceso en espera</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-red-500 rounded-full"></div>
              <span class="text-blue-700">Detenido: Proceso finalizado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }

  .blink {
    animation: blink 2s infinite ease-in-out;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
