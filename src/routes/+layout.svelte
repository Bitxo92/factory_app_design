<script>
  // @ts-nocheck

  import { user } from "../stores/auth";
  import { page } from "$app/stores";
  import { redirect } from "@sveltejs/kit";
  import "../app.css";

  $: if ($page.url.pathname !== "/login" && !$user) {
    redirect(302, "/login");
  }

  $: if ($page.url.pathname === "/login" && $user) {
    redirect(302, "/dashboard");
  }
</script>

<svelte:head>
  <title>Señor Pollo</title>
</svelte:head>

<div
  class="min-h-screen bg-background-light dark:bg-background-dark font-display"
>
  <slot />
</div>
