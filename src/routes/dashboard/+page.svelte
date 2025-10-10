<script lang="ts">
  import { onMount } from "svelte";
  import {
    User,
    Package,
    Scale,
    Clock,
    CookingPot,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Play,
    Pause,
    Square,
  } from "lucide-svelte";
  import type { Chart, ChartItem } from "chart.js";

  //############################################## Mock DATA #####################################################

  // Datos del usuario
  const usuario = {
    nombre: "Carlos García",
    rol: "Operador Principal",
    turno: "Matutino",
    ultimoAcceso: "Hoy 08:30 AM",
  };

  // KPIs principales
  const kpis = [
    {
      titulo: "Lotes Completados",
      valor: "24",
      cambio: "+12%",
      tendencia: "positiva",
      icono: Package,
      color: "blue",
    },
    {
      titulo: "Peso Total Procesado",
      valor: "1,245.5",
      unidad: "kg",
      cambio: "+8%",
      tendencia: "positiva",
      icono: Scale,
      color: "green",
    },
    {
      titulo: "Eficiencia de Producción",
      valor: "94.2",
      unidad: "%",
      cambio: "+2.1%",
      tendencia: "positiva",
      icono: TrendingUp,
      color: "purple",
    },
    {
      titulo: "Tiempo Promedio",
      valor: "42",
      unidad: "min",
      cambio: "-5%",
      tendencia: "positiva",
      icono: Clock,
      color: "orange",
    },
  ];

  // Datos de amasadoras
  let amasadoras = [
    {
      id: 1,
      nombre: "Amasadora Principal",
      estado: "en_progreso",
      receta: "Pollo al Curry Premium",
      tiempoRestante: 1245, // segundos
      progreso: 65,
      temperatura: 24,
      velocidad: "Media",
    },
    {
      id: 2,
      nombre: "Amasadora Secundaria",
      estado: "pausado",
      receta: "Fajitas de Pollo Especial",
      tiempoRestante: 1800,
      progreso: 30,
      temperatura: 22,
      velocidad: "Baja",
    },
    {
      id: 3,
      nombre: "Amasadora de Reserva",
      estado: "detenido",
      receta: "Esperando asignación",
      tiempoRestante: 0,
      progreso: 0,
      temperatura: 20,
      velocidad: "Apagada",
    },
  ];

  let chartProduccion: Chart | null = null;
  let chartEficiencia: Chart | null = null;

  onMount(async () => {
    // NOTE: Importar Chart.js dinámicamente para evitar problemas de SSR
    const ChartJS = await import("chart.js/auto");
    const Chart = ChartJS.default;

    // Gráfica de Producción Semanal
    const ctxProduccion = document.getElementById(
      "chartProduccion"
    ) as HTMLCanvasElement;
    if (ctxProduccion) {
      chartProduccion = new Chart(ctxProduccion, {
        type: "bar",
        data: {
          labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
          datasets: [
            {
              label: "Peso (kg)",
              data: [320, 450, 380, 520, 610, 480, 390],
              backgroundColor: "#2563eb",
              borderColor: "#2563eb",
              borderWidth: 2,
              borderRadius: 6,
            },
            {
              label: "Lotes",
              data: [8, 12, 10, 15, 18, 14, 11],
              backgroundColor: "#7c3aed",
              borderColor: "#7c3aed",
              borderWidth: 2,
              borderRadius: 6,
              yAxisID: "y1",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              type: "linear",
              display: true,
              position: "left",
              title: {
                display: true,
                text: "Peso (kg)",
              },
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
            y1: {
              type: "linear",
              display: true,
              position: "right",
              title: {
                display: true,
                text: "Lotes",
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Producción Semanal",
            },
          },
        },
      });
    }

    // Gráfica de Eficiencia
    const ctxEficiencia = document.getElementById(
      "chartEficiencia"
    ) as HTMLCanvasElement;
    if (ctxEficiencia) {
      chartEficiencia = new Chart(ctxEficiencia, {
        type: "line",
        data: {
          labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
          datasets: [
            {
              label: "Eficiencia (%)",
              data: [88.5, 91.2, 93.8, 94.2],
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              min: 85,
              max: 100,
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Eficiencia Mensual",
            },
          },
        },
      });
    }
  });

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

  function startAmasadora(id: number) {
    const amasadora = amasadoras.find((a) => a.id === id);
    if (amasadora) {
      amasadora.estado = "en_progreso";
      amasadora.tiempoRestante = amasadora.tiempoRestante || 2700; // 45 minutos por defecto
      amasadoras = [...amasadoras];
    }
  }

  function pauseAmasadora(id: number) {
    const amasadora = amasadoras.find((a) => a.id === id);
    if (amasadora) {
      amasadora.estado = "pausado";
      amasadoras = [...amasadoras];
    }
  }

  function stopAmasadora(id: number) {
    const amasadora = amasadoras.find((a) => a.id === id);
    if (amasadora) {
      amasadora.estado = "detenido";
      amasadora.progreso = 0;
      amasadora.tiempoRestante = 0;
      amasadoras = [...amasadoras];
    }
  }

  function getEstadoColor(estado: string) {
    switch (estado) {
      case "en_progreso":
        return "bg-green-100 text-green-800 border-green-200";
      case "pausado":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "detenido":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }

  function getEstadoTexto(estado: string) {
    switch (estado) {
      case "en_progreso":
        return "EN PROGRESO";
      case "pausado":
        return "PAUSADO";
      case "detenido":
        return "DETENIDO";
      default:
        return "DESCONOCIDO";
    }
  }

  // Simular progreso en tiempo real para amasadoras activas
  onMount(() => {
    const interval = setInterval(() => {
      amasadoras.forEach((amasadora) => {
        if (
          amasadora.estado === "en_progreso" &&
          amasadora.tiempoRestante > 0
        ) {
          amasadora.tiempoRestante -= 1;
          amasadora.progreso = Math.min(
            100,
            ((2700 - amasadora.tiempoRestante) / 2700) * 100
          );

          if (amasadora.tiempoRestante <= 0) {
            amasadora.estado = "detenido";
            amasadora.progreso = 100;
          }

          amasadoras = [...amasadoras];
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  });
</script>

<main class="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
  <div class="max-w-7xl mx-auto">
    <!-- Header de Bienvenida -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {usuario.nombre}!
          </h1>
          <p class="text-gray-600 mt-2">
            {usuario.rol} • Turno {usuario.turno} • Último acceso: {usuario.ultimoAcceso}
          </p>
        </div>
        <div
          class="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-sm border border-gray-200"
        >
          <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-sm font-medium text-gray-700"
            >Sistema Operativo</span
          >
        </div>
      </div>
    </div>

    <!-- KPIs Principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {#each kpis as kpi}
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div
              class="p-3 rounded-xl {kpi.color === 'blue'
                ? 'bg-blue-100'
                : kpi.color === 'green'
                  ? 'bg-green-100'
                  : kpi.color === 'purple'
                    ? 'bg-purple-100'
                    : 'bg-orange-100'}"
            >
              <svelte:component
                this={kpi.icono}
                class="w-6 h-6 {kpi.color === 'blue'
                  ? 'text-blue-600'
                  : kpi.color === 'green'
                    ? 'text-green-600'
                    : kpi.color === 'purple'
                      ? 'text-purple-600'
                      : 'text-orange-600'}"
              />
            </div>
            <div
              class="flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium {kpi.tendencia ===
              'positiva'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'}"
            >
              {kpi.tendencia === "positiva" ? "↗" : "↘"}
              {kpi.cambio}
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">
            {kpi.valor}
            {#if kpi.unidad}
              <span class="text-lg text-gray-600">{kpi.unidad}</span>
            {/if}
          </h3>
          <p class="text-gray-600 text-sm">{kpi.titulo}</p>
        </div>
      {/each}
    </div>

    <!-- Gráficas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Gráfica de Producción -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div class="h-80">
          <canvas id="chartProduccion"></canvas>
        </div>
      </div>

      <!-- Gráfica de Eficiencia -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div class="h-80">
          <canvas id="chartEficiencia"></canvas>
        </div>
      </div>
    </div>

    <!-- Estado de Amasadoras -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">Estado de Amasadoras</h2>
        <div class="flex items-center gap-4 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span
              >En Operación: {amasadoras.filter(
                (a) => a.estado === "en_progreso"
              ).length}</span
            >
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span
              >Pausadas: {amasadoras.filter((a) => a.estado === "pausado")
                .length}</span
            >
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <span
              >Detenidas: {amasadoras.filter((a) => a.estado === "detenido")
                .length}</span
            >
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {#each amasadoras as amasadora}
          <div
            class="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
          >
            <!-- Header de la Amasadora -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div
                  class="p-2 rounded-lg {amasadora.estado === 'en_progreso'
                    ? 'bg-green-100'
                    : amasadora.estado === 'pausado'
                      ? 'bg-yellow-100'
                      : 'bg-gray-100'}"
                >
                  <CookingPot
                    class="w-5 h-5 {amasadora.estado === 'en_progreso'
                      ? 'text-green-600'
                      : amasadora.estado === 'pausado'
                        ? 'text-yellow-600'
                        : 'text-gray-600'}"
                  />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">
                    {amasadora.nombre}
                  </h3>
                  <p class="text-sm text-gray-600">ID: AM{amasadora.id}</p>
                </div>
              </div>
              <span
                class="px-3 py-1 text-xs font-bold rounded-full border {getEstadoColor(
                  amasadora.estado
                )}"
              >
                {getEstadoTexto(amasadora.estado)}
              </span>
            </div>

            <!-- Información del Proceso -->
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-600 mb-1">Receta Actual</p>
                <p class="font-medium text-gray-900">{amasadora.receta}</p>
              </div>

              <!-- Barra de Progreso -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-gray-600">Progreso</span>
                  <span class="text-sm font-bold text-blue-600"
                    >{amasadora.progreso.toFixed(0)}%</span
                  >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style="width: {amasadora.progreso}%"
                  ></div>
                </div>
              </div>

              <!-- Métricas -->
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-600">Tiempo Restante</p>
                  <p class="font-semibold text-green-600">
                    {amasadora.tiempoRestante > 0
                      ? formatTime(amasadora.tiempoRestante)
                      : "--:--:--"}
                  </p>
                </div>
                <div>
                  <p class="text-gray-600">Temperatura</p>
                  <p class="font-semibold text-orange-600">
                    {amasadora.temperatura}°C
                  </p>
                </div>
                <div>
                  <p class="text-gray-600">Velocidad</p>
                  <p class="font-semibold text-purple-600">
                    {amasadora.velocidad}
                  </p>
                </div>
                <div>
                  <p class="text-gray-600">Estado</p>
                  <p class="font-semibold text-gray-900 capitalize">
                    {amasadora.estado.replace("_", " ")}
                  </p>
                </div>
              </div>

              <!-- Controles -->
              <div class="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  on:click={() => startAmasadora(amasadora.id)}
                  class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium transition-colors hover:bg-blue-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={amasadora.estado === "en_progreso"}
                >
                  <Play class="w-4 h-4" />
                  Iniciar
                </button>
                <button
                  on:click={() => pauseAmasadora(amasadora.id)}
                  class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-yellow-600 text-white text-sm font-medium transition-colors hover:bg-yellow-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={amasadora.estado !== "en_progreso"}
                >
                  <Pause class="w-4 h-4" />
                  Pausar
                </button>
                <button
                  on:click={() => stopAmasadora(amasadora.id)}
                  class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium transition-colors hover:bg-red-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={amasadora.estado === "detenido"}
                >
                  <Square class="w-4 h-4" />
                  Detener
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Información Adicional -->
    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Próximos Lotes -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Próximos Lotes Programados
        </h3>
        <div class="space-y-3">
          {#each [1, 2, 3] as i}
            <div
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <p class="font-medium text-gray-900">
                  Lote {i} - Pollo Marinado
                </p>
                <p class="text-sm text-gray-600">
                  Programado: 10:{30 + i * 15} AM
                </p>
              </div>
              <span
                class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
              >
                Pendiente
              </span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Alertas del Sistema -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Alertas del Sistema
        </h3>
        <div class="space-y-3">
          <div
            class="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
          >
            <AlertCircle class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p class="font-medium text-yellow-800">
                Mantenimiento Preventivo
              </p>
              <p class="text-sm text-yellow-700">
                Amasadora Secundaria requiere calibración
              </p>
            </div>
          </div>
          <div
            class="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <CheckCircle2 class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p class="font-medium text-green-800">Sistema Óptimo</p>
              <p class="text-sm text-green-700">
                Todas las amasadoras operando correctamente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
