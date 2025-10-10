<script lang="ts">
  import {
    Search,
    Plus,
    Filter,
    Download,
    Upload,
    Package,
    AlertTriangle,
    CheckCircle,
    Clock,
    Edit,
    Trash2,
    MoreVertical,
    BarChart3,
    ShoppingCart,
    Warehouse,
    TrendingUp,
    Eye,
  } from "lucide-svelte";
  import { onMount } from "svelte";

  // Estado de la aplicación
  let searchQuery = "";
  let selectedCategory = "all";
  let lowStockFilter = false;
  let sortBy = "name";
  let isERPConnected = true;

  // Datos de ejemplo del inventario
  let inventory = [
    {
      id: 1,
      name: "Pechuga de Pollo Premium",
      sku: "POLLO-001",
      category: "Aves",
      currentStock: 45,
      minStock: 20,
      unit: "kg",
      price: 12.99,
      status: "in_stock",
      lastUpdated: "2024-01-15",
      supplier: "Avícola Norte",
    },
    {
      id: 2,
      name: "Filete de Res Angus",
      sku: "RES-001",
      category: "Carnes Rojas",
      currentStock: 8,
      minStock: 15,
      unit: "kg",
      price: 24.99,
      status: "low_stock",
      lastUpdated: "2024-01-14",
      supplier: "Carnes Premium",
    },
    {
      id: 3,
      name: "Salchichas Tradicionales",
      sku: "EMB-001",
      category: "Embutidos",
      currentStock: 120,
      minStock: 50,
      unit: "unidades",
      price: 8.99,
      status: "in_stock",
      lastUpdated: "2024-01-16",
      supplier: "Embutidos Sureños",
    },
    {
      id: 4,
      name: "Mortadela Especial",
      sku: "EMB-002",
      category: "Embutidos",
      currentStock: 5,
      minStock: 25,
      unit: "unidades",
      price: 6.99,
      status: "out_of_stock",
      lastUpdated: "2024-01-10",
      supplier: "Embutidos Sureños",
    },
    {
      id: 5,
      name: "Alitas de Pollo BBQ",
      sku: "POLLO-002",
      category: "Aves",
      currentStock: 32,
      minStock: 30,
      unit: "kg",
      price: 9.99,
      status: "in_stock",
      lastUpdated: "2024-01-15",
      supplier: "Avícola Norte",
    },
    {
      id: 6,
      name: "Lomo de Cerdo",
      sku: "CERDO-001",
      category: "Cerdo",
      currentStock: 28,
      minStock: 20,
      unit: "kg",
      price: 14.99,
      status: "in_stock",
      lastUpdated: "2024-01-13",
      supplier: "Granja Porcina",
    },
  ];

  // KPIs del inventario
  const inventoryKPIs = [
    {
      title: "Total de Productos",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: Package,
      color: "blue",
    },
    {
      title: "Stock Bajo",
      value: "8",
      change: "-2%",
      trend: "down",
      icon: AlertTriangle,
      color: "orange",
    },
    {
      title: "Sin Stock",
      value: "3",
      change: "+1%",
      trend: "up",
      icon: Clock,
      color: "red",
    },
    {
      title: "Valor Total",
      value: "$45,230",
      change: "+8%",
      trend: "up",
      icon: TrendingUp,
      color: "green",
    },
  ];

  // Categorías para filtro
  const categories = [
    { value: "all", label: "Todas las Categorías" },
    { value: "Aves", label: "Aves" },
    { value: "Carnes Rojas", label: "Carnes Rojas" },
    { value: "Cerdo", label: "Cerdo" },
    { value: "Embutidos", label: "Embutidos" },
    { value: "Pescados", label: "Pescados" },
  ];

  // Funciones de utilidad
  function getStatusColor(status: string) {
    switch (status) {
      case "in_stock":
        return "bg-green-100 text-green-800 border-green-200";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "out_of_stock":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case "in_stock":
        return "En Stock";
      case "low_stock":
        return "Stock Bajo";
      case "out_of_stock":
        return "Sin Stock";
      default:
        return "Desconocido";
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "in_stock":
        return CheckCircle;
      case "low_stock":
        return AlertTriangle;
      case "out_of_stock":
        return Clock;
      default:
        return Package;
    }
  }

  // Filtrado y búsqueda
  $: filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesLowStock =
      !lowStockFilter ||
      item.status === "low_stock" ||
      item.status === "out_of_stock";

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  $: sortedInventory = [...filteredInventory].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "stock":
        return a.currentStock - b.currentStock;
      case "category":
        return a.category.localeCompare(b.category);
      case "price":
        return a.price - b.price;
      default:
        return 0;
    }
  });

  // Funciones de acción
  function handleEdit(item: any) {
    console.log("Editar:", item);
  }

  function handleDelete(item: any) {
    if (confirm(`¿Estás seguro de eliminar ${item.name}?`)) {
      console.log("Eliminar:", item);
    }
  }

  function handleView(item: any) {
    console.log("Ver detalles:", item);
  }

  function handleRestock(item: any) {
    console.log("Reabastecer:", item);
  }
</script>

<main class="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
  <div class="max-w-7xl mx-auto">
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
            <h2 class="text-2xl font-bold text-gray-900">
              Gestión del Inventario
            </h2>
          </div>
          <p class="text-gray-600 max-w-2xl mx-auto mb-5">
            Monitorea y gestiona el stock de productos
          </p>
        </header>

        <!-- Right-aligned scale status -->
        <div class="absolute right-0 flex items-center gap-2 text-sm">
          <div
            class={`flex items-center gap-1 ${isERPConnected ? "text-green-600" : "text-red-600"}`}
          >
            <div
              class={`w-2 h-2 rounded-full ${isERPConnected ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span>
              ERP: {isERPConnected ? "Conectada" : "Desconectada"}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
      {#each inventoryKPIs as kpi}
        <div
          class="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200"
        >
          <div class="flex items-center justify-between mb-3 lg:mb-4">
            <div
              class="p-2 lg:p-3 rounded-xl {kpi.color === 'blue'
                ? 'bg-blue-100'
                : kpi.color === 'orange'
                  ? 'bg-orange-100'
                  : kpi.color === 'red'
                    ? 'bg-red-100'
                    : 'bg-green-100'}"
            >
              <svelte:component
                this={kpi.icon}
                class="w-4 h-4 lg:w-6 lg:h-6 {kpi.color === 'blue'
                  ? 'text-blue-600'
                  : kpi.color === 'orange'
                    ? 'text-orange-600'
                    : kpi.color === 'red'
                      ? 'text-red-600'
                      : 'text-green-600'}"
              />
            </div>
            <div
              class="flex items-center gap-1 px-2 py-1 rounded-full text-xs lg:text-sm font-medium {kpi.trend ===
              'up'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'}"
            >
              {kpi.trend === "up" ? "↗" : "↘"}
              {kpi.change}
            </div>
          </div>
          <h3 class="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
            {kpi.value}
          </h3>
          <p class="text-gray-600 text-xs lg:text-sm">{kpi.title}</p>
        </div>
      {/each}
    </div>

    <!-- Barra de Herramientas -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <!-- Búsqueda y Filtros -->
        <div class="flex flex-col sm:flex-row gap-4 flex-1">
          <!-- Barra de búsqueda -->
          <div class="relative flex-1 max-w-md">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Search class="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              bind:value={searchQuery}
              class="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Buscar productos..."
            />
          </div>

          <!-- Filtros -->
          <div class="flex gap-2">
            <select
              bind:value={selectedCategory}
              class="px-3 pr-8 py-2 min-w-[8rem] rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:cursor-pointer"
            >
              {#each categories as category}
                <option value={category.value}>{category.label}</option>
              {/each}
            </select>

            <label
              class="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                bind:checked={lowStockFilter}
                class="rounded text-blue-600 focus:ring-blue-600"
              />
              <span class="text-sm text-gray-700">Stock Bajo</span>
            </label>
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex gap-2">
          <button
            class="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors hover: cursor-pointer"
          >
            <Plus class="w-4 h-4" />
            <span class="hidden sm:inline">Nuevo Producto</span>
          </button>
          <button
            class="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors hover: cursor-pointer"
          >
            <Download class="w-4 h-4" />
            <span class="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla de Inventario -->
    <div
      class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <!-- Header de la tabla -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            Productos en Inventario
          </h3>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600"
              >{sortedInventory.length} productos</span
            >
            <select
              bind:value={sortBy}
              class="text-sm border-none focus:ring-0 focus:outline-none"
            >
              <option value="name">Ordenar por Nombre</option>
              <option value="stock">Ordenar por Stock</option>
              <option value="category">Ordenar por Categoría</option>
              <option value="price">Ordenar por Precio</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Contenido de la tabla -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >Producto</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >Categoría</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >Stock</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >Precio</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >Estado</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >Acciones</th
              >
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each sortedInventory as item}
              <tr class="hover:bg-gray-50 transition-colors">
                <!-- Información del Producto -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                    >
                      <Package class="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{item.name}</p>
                      <p class="text-sm text-gray-500">{item.sku}</p>
                    </div>
                  </div>
                </td>

                <!-- Categoría -->
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <Warehouse class="w-3 h-3" />
                    {item.category}
                  </span>
                </td>

                <!-- Stock -->
                <td class="px-6 py-4">
                  <div>
                    <p class="font-medium text-gray-900">
                      {item.currentStock}
                      {item.unit}
                    </p>
                    <p class="text-xs text-gray-500">
                      Mín: {item.minStock}
                      {item.unit}
                    </p>
                  </div>
                </td>

                <!-- Precio -->
                <td class="px-6 py-4">
                  <p class="font-medium text-gray-900">${item.price}</p>
                  <p class="text-xs text-gray-500">por {item.unit}</p>
                </td>

                <!-- Estado -->
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border {getStatusColor(
                      item.status
                    )}"
                  >
                    <svelte:component
                      this={getStatusIcon(item.status)}
                      class="w-4 h-4"
                    />
                    {getStatusText(item.status)}
                  </span>
                </td>

                <!-- Acciones -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <button
                      on:click={() => handleView(item)}
                      class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      on:click={() => handleEdit(item)}
                      class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Editar"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    {#if item.status === "low_stock" || item.status === "out_of_stock"}
                      <button
                        on:click={() => handleRestock(item)}
                        class="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        title="Reabastecer"
                      >
                        <ShoppingCart class="w-4 h-4" />
                      </button>
                    {/if}
                    <button
                      on:click={() => handleDelete(item)}
                      class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="6" class="px-6 py-8 text-center">
                  <div class="flex flex-col items-center gap-2 text-gray-500">
                    <Package class="w-12 h-12" />
                    <p class="font-medium">No se encontraron productos</p>
                    <p class="text-sm">
                      Intenta ajustar los filtros de búsqueda
                    </p>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Footer de la tabla -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between text-sm text-gray-600">
          <span
            >Mostrando {Math.min(sortedInventory.length, 10)} de {sortedInventory.length}
            productos</span
          >
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1 rounded border border-gray-300 hover:bg-white hover: cursor-pointer"
              >Anterior</button
            >
            <span>Página 1 de 1</span>
            <button
              class="px-3 py-1 rounded border border-gray-300 hover:bg-white hover:cursor-pointer"
              >Siguiente</button
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Información Adicional -->
    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Productos con Stock Bajo -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            Productos con Stock Bajo
          </h3>
          <AlertTriangle class="w-5 h-5 text-orange-500" />
        </div>
        <div class="space-y-3">
          {#each inventory
            .filter((item) => item.status === "low_stock" || item.status === "out_of_stock")
            .slice(0, 3) as item}
            <div
              class="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
            >
              <div>
                <p class="font-medium text-orange-900">{item.name}</p>
                <p class="text-sm text-orange-700">
                  Stock: {item.currentStock}
                  {item.unit} (Mín: {item.minStock})
                </p>
              </div>
              <button
                on:click={() => handleRestock(item)}
                class="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors"
              >
                Reabastecer
              </button>
            </div>
          {/each}
        </div>
      </div>

      <!-- Acciones Rápidas -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <button
            class="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors hover:cursor-pointer"
          >
            <Plus class="w-6 h-6 text-blue-600" />
            <span class="text-sm font-medium text-blue-900">Nuevo Producto</span
            >
          </button>
          <button
            class="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors hover:cursor-pointer"
          >
            <Upload class="w-6 h-6 text-green-600" />
            <span class="text-sm font-medium text-green-900">Importar CSV</span>
          </button>
          <button
            class="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors hover: cursor-pointer"
          >
            <BarChart3 class="w-6 h-6 text-purple-600" />
            <span class="text-sm font-medium text-purple-900">Reportes</span>
          </button>
          <button
            class="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors hover: cursor-pointer"
          >
            <ShoppingCart class="w-6 h-6 text-orange-600" />
            <span class="text-sm font-medium text-orange-900">Pedidos</span>
          </button>
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

  /* Mejoras para tablas responsive */
  @media (max-width: 768px) {
    table {
      font-size: 0.875rem;
    }

    .px-6 {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .py-4 {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }
  }
</style>
