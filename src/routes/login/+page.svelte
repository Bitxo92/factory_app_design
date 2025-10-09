<script>
  import { goto } from "$app/navigation";
  import logo from "$lib/assets/logo.png";
  import "../../app.css";
  import { Eye, EyeOff, UserRound, Lock } from "lucide-svelte";

  let username = "";
  let password = "";
  let error = "";
  let showModal = false;
  let showPassword = false;

  const handleLogin = () => {
    error = "";

    // Check hardcoded credentials
    if (username === "Carlos" && password === "abc123") {
      goto("/dashboard");
    } else {
      error = "Invalid credentials.";
    }
  };
</script>

<div
  class="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4"
>
  <div class="max-w-md w-full space-y-8">
    <div
      class="flex flex-col items-center justify-center gap-3 mb-8 text-center"
    >
      <div class="flex items-center justify-center gap-3 mb-8"></div>
      <!--Company Logo-->
      <img src={logo} alt="Company logo" class="w-50 h-auto mt-2" />
      <!--Login Form Header-->
      <h2
        class="text-3xl font-bold text-background-dark dark:text-background-light"
      >
        Sign in to your account
      </h2>
    </div>

    <form on:submit|preventDefault={handleLogin} class="mt-8 space-y-6">
      <div class="space-y-4">
        <div>
          <label
            for="username"
            class="flex items-center gap-2 text-sm font-medium text-background-dark/80 dark:text-background-light/80 mb-2"
          >
            <UserRound class="w-5 h-5 ml-2 inline-block" />
            Username
          </label>
          <input
            id="username"
            type="text"
            bind:value={username}
            required
            class="w-full rounded-lg border border-primary/30 bg-background-light p-3 text-background-dark focus:border-primary focus:ring-primary dark:border-primary/50 dark:bg-background-dark/50 dark:text-background-light dark:focus:border-primary"
            placeholder="Enter your username"
          />
        </div>
        <label
          for="password"
          class="block text-sm font-medium text-background-dark/80 dark:text-background-light/80 mb-2"
          ><Lock class="w-5 h-auto ml-2 inline-block" />
          Password
        </label>
        <div class="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            bind:value={password}
            required
            placeholder="Enter your password"
            class="w-full rounded-lg border border-primary/30 bg-background-light p-3 pr-10 text-background-dark focus:border-primary focus:ring-primary dark:border-primary/50 dark:bg-background-dark/50 dark:text-background-light dark:focus:border-primary"
          />

          {#if password}
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:cursor-pointer"
              on:click={() => (showPassword = !showPassword)}
            >
              {#if showPassword}
                <EyeOff size={20} />
              {:else}
                <Eye size={20} />
              {/if}
            </button>
          {/if}
        </div>
        <!-- Remember Me + Forgot Password -->
        <div class="flex items-center justify-between text-sm p-5">
          <label
            class="flex items-center gap-2 text-background-dark/80 dark:text-background-light/80"
          >
            <input
              type="checkbox"
              class="rounded border-primary/30 text-primary focus:ring-primary dark:border-primary/50 hover: cursor-pointer"
            />
            Remember me
          </label>

          <button
            type="button"
            class="text-primary hover:underline dark:text-primary/90 hover: cursor-pointer"
            on:click={() => (showModal = true)}
          >
            Forgot password?
          </button>
        </div>
      </div>
      <!-- Error Message-->
      {#if error}
        <div
          class="rounded-lg bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-center"
        >
          {error}
        </div>
      {/if}

      <div>
        <button
          type="submit"
          class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:cursor-pointer dark:text-background-dark"
        >
          <span class="material-symbols-outlined">login</span>
        </button>
      </div>
    </form>
  </div>
  <!-- Modal -->
  {#if showModal}
    <div
      class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
    >
      <div
        class="bg-white dark:bg-background-dark rounded-2xl shadow-xl p-6 w-80 text-center"
      >
        <h3
          class="text-lg font-semibold mb-4 text-background-dark dark:text-background-light"
        >
          Test User Credentials
        </h3>
        <p
          class="text-sm text-background-dark/80 dark:text-background-light/80 mb-2"
        >
          <strong>User:</strong> Carlos
        </p>
        <p
          class="text-sm text-background-dark/80 dark:text-background-light/80 mb-4"
        >
          <strong>Password:</strong> abc123
        </p>
        <button
          class="mt-2 w-full rounded-lg bg-blue-500 text-white py-2 font-medium hover:opacity-90 transition hover: cursor-pointer"
          on:click={() => (showModal = false)}
        >
          Close
        </button>
      </div>
    </div>
  {/if}
</div>
