<script>
  // @ts-nocheck

  import "../../app.css";
  import { page } from "$app/stores";
  import { Gauge, NotepadText, CookingPot, Tags, Package } from "lucide-svelte";
  import logo from "$lib/assets/logo.png";
  export let data;

  // Helper to determine if a link is active
  const isActive = (path) => $page.url.pathname === path;
</script>

<div class="flex min-h-screen">
  <!-- Sidebar -->
  <aside class="w-64 bg-neutral-50 p-6 flex flex-col justify-between">
    <div>
      <!--Company Logo-->
      <div class="flex items-center gap-2 mb-10">
        <img src={logo} alt="Company logo" class="w-50 h-auto mt-2" />
      </div>

      <nav class="flex flex-col gap-2">
        <!--Dashboard-->
        <a
          href="/dashboard"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
      {$page.url.pathname === '/dashboard'
            ? 'bg-gray-400 text-white'
            : 'text-gray-500 hover:bg-gray-200'}"
        >
          <span class="inline-flex items-center space-x-2">
            <Gauge class="w-4 h-auto" />
            <span>Dashboard</span>
          </span>
        </a>
        <!--Recipes-->
        <a
          href="/dashboard/recipes"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
      {$page.url.pathname === '/dashboard/recipes'
            ? 'bg-gray-400 text-white'
            : 'text-gray-500 hover:bg-gray-200'}"
        >
          <span class="inline-flex items-center space-x-2">
            <NotepadText class="w-4 h-auto" />
            <span>Recetas</span>
          </span>
        </a>
        <!--Mixing-->
        <a
          href="/dashboard/mixing"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
      {$page.url.pathname === 'dashboard/mixing'
            ? 'bg-gray-400 text-white'
            : 'text-gray-500 hover:bg-gray-200'}"
        >
          <span class="inline-flex items-center space-x-2">
            <CookingPot class="w-4 h-auto" />
            <span>Amasado</span>
          </span>
        </a>
        <!--Labeling-->
        <a
          href="/dashboard/labeling"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
      {$page.url.pathname === '/dashboard/labeling'
            ? 'bg-gray-400 text-white'
            : 'text-gray-500 hover:bg-gray-200'}"
        >
          <span class="inline-flex items-center space-x-2">
            <Tags class="w-4 h-auto" />
            <span>Etiquetado</span>
          </span>
        </a>
        <!--Inventory-->
        <a
          href="/dashboard/inventory"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
      {$page.url.pathname === '/dashboard/inventory'
            ? 'bg-gray-400 text-white'
            : 'text-gray-500 hover:bg-gray-200'}"
        >
          <span class="inline-flex items-center space-x-2">
            <Package class="w-4 h-auto" />
            <span>Inventario</span>
          </span>
        </a>
      </nav>
    </div>

    <!-- User Account info -->
    <div class="flex items-center gap-4 p-3 bg-gray-400 rounded-lg">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfkSYOYrjcCFL05MsCdv0VIT4ouQkc0Thp3pUTnYhYXHmKTNxoWtdo8-4awXrnrQeDB9RYS1dEmZ4r1UXHcZ9mnQuQ9CARfn1MF8i5iimzVoGIvj-4VhpsST-Jl45IsfqTVWfnOkq_0Mef7OKm1UVA2xx0uSnZaXyPIpMANd3aQzKgA8_OJdBWlMpoMW1i2svIMtOAc0bCXLxY_YV3EGeNSeJd4qEvb50i1G_EY8bo3yWSBrQKWFoPnADJv5YsDsdo4oWz_OdFhDV8"
        alt="Operator"
        class="w-10 h-10 rounded-full"
      />
      <div>
        <p class="font-bold text-sm">Carlos Garcia</p>
        <p class="text-xs text-primary/70 dark:text-white/70">Operario</p>
      </div>
    </div>
  </aside>

  <!-- Main content -->
  <main class="flex-1 p-8">
    <slot />
  </main>
</div>
