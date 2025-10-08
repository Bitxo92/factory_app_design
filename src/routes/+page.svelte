<script>
  import { redirect } from "@sveltejs/kit";
  import { user } from "../stores/auth";

  redirect(302, $user ? "/dashboard" : "/login");
</script>
