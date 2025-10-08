<script lang="ts">
  import { CookingPot, Timer, Play, Pause, Square } from "lucide-svelte";

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
      receta: "Pollo al Curry",
      operador: "Carlos García",
      inicio: "10:30",
      fin: "11:15",
      duracion: 45 * 60,
      progreso: 0,
      tiempoRestante: 45 * 60,
      estado: "detenido",
    },
    {
      receta: "Fajitas de Pollo",
      operador: "Carlos García",
      inicio: "12:00",
      fin: "12:45",
      duracion: 45 * 60,
      progreso: 0,
      tiempoRestante: 45 * 60,
      estado: "detenido",
    },
    {
      receta: "Estofado de Pollo",
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
</script>

<main class="flex-1 p-8 ml-64">
  <div class="max-w-4xl mx-auto">
    <header class="mb-8 text-center">
      <h2 class="text-3xl font-bold text-[#1c1c1c]">
        Control de Mezclado de Masa
      </h2>
      <p class="text-gray-700 mt-1">
        Monitorea y gestiona el proceso de amasado de la masa.
      </p>
    </header>

    <div class="bg-gray-100 p-6 rounded-xl shadow-lg space-y-8">
      {#each lotes as lote, index}
        <div
          class="relative space-y-6 border-b border-gray-300 last:border-b-0 pb-6 text-center"
        >
          <!-- Etiqueta de estado -->
          <div class="absolute top-3 right-4">
            {#if lote.estado === "en_progreso"}
              <span
                class="blink bg-green-600 text-white px-3 py-1 text-xs font-bold rounded-lg shadow"
              >
                EN PROGRESO
              </span>
            {:else if lote.estado === "pausado"}
              <span
                class="bg-yellow-500 text-white px-3 py-1 text-xs font-bold rounded-lg shadow"
              >
                PAUSADO
              </span>
            {:else}
              <span
                class="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-lg shadow"
              >
                DETENIDO
              </span>
            {/if}
          </div>

          <!-- Icono -->
          <div class="flex justify-center">
            <CookingPot
              class={`w-16 h-16 text-blue-600 transition-transform duration-700${
                lote.estado === "en_progreso" ? " animate-spin-slow" : ""
              }`}
            />
          </div>

          <!-- Título -->
          <h3 class="text-xl font-bold mb-2 text-[#1c1c1c]">
            Lote {index + 1}: {lote.receta}
          </h3>

          <!-- Información del proceso -->
          <div class="space-y-2">
            <div>
              <label class="text-sm font-medium text-gray-700">Receta</label>
              <p class="text-lg font-semibold text-[#1c1c1c] mt-1">
                {lote.receta}
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700"
                >Operador Asignado</label
              >
              <p class="text-lg font-semibold text-[#1c1c1c] mt-1">
                {lote.operador}
              </p>
            </div>
          </div>

          <!-- Horarios -->
          <div class="grid grid-cols-2 gap-4 text-center mt-4">
            <div>
              <p class="text-sm font-medium text-gray-700">Hora de Inicio</p>
              <p class="text-3xl font-bold text-[#1c1c1c] mt-1">
                {lote.inicio} <span class="text-lg">AM</span>
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">Hora de Fin</p>
              <p class="text-3xl font-bold text-[#1c1c1c] mt-1">
                {lote.fin} <span class="text-lg">AM</span>
              </p>
            </div>
          </div>
          <!-- Tiempo restante -->
          <div class="flex flex-col justify-center items-center">
            <Timer class="w-5 h-auto mb-2" />
            <p class="text-green-700 text-2xl font-bold">
              {formatTime(lote.tiempoRestante)}
            </p>
          </div>

          <!-- Barra de progreso -->
          <div class="mt-4">
            <div class="w-full bg-gray-300 rounded-full h-2.5">
              <div
                class="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style="width: {Math.min(lote.progreso, 100)}%"
              ></div>
            </div>
            <p class="text-center mt-2 text-sm font-medium text-gray-800">
              {Math.min(Number(lote.progreso.toFixed(1)), 100)}% completado
            </p>
          </div>

          <!-- Botones -->
          <div class="flex gap-4 mt-4 justify-center flex-wrap">
            <button
              on:click={() => start(index)}
              class="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 transition-colors hover: cursor-pointer"
            >
              <Play class="h-5 w-auto" />
              Iniciar
            </button>
            <button
              on:click={() => pause(index)}
              class="flex items-center gap-2 px-6 py-3 rounded-lg bg-yellow-100 text-yellow-700 font-bold hover:bg-yellow-200 transition-colors hover: cursor-pointer"
            >
              <Pause class="h-5 w-auto" />
              Pausar
            </button>
            <button
              on:click={() => stop(index)}
              class="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-100 text-red-700 font-bold hover:bg-red-200 transition-colors hover: cursor-pointer"
            >
              <Square class="h-5 w-auto" />
              Detener
            </button>
          </div>
        </div>
      {/each}
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
      opacity: 0.5;
    }
  }
  .blink {
    animation: blink 1.5s infinite ease-in-out;
  }

  .animate-spin-slow {
    animation: spin 3s linear infinite;
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
