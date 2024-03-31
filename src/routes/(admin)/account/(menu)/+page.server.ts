// src/routes/(admin)/account/(menu)/+page.server.ts
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// Load function to fetch and return product details for the current user
export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
  const session = await getSession();

  if (!session) {
    throw redirect(303, "/login"); // Redirects to login if no active session
  }

  // Fetching products from the 'products' table where 'profile_id' matches the user's ID
  const { data: products, error } = await supabase
  .from("products")
  .select("*")
  .eq("profile_id", session.user.id);

if (error) {
  console.error("Error fetching products:", error);
  // Consider returning an error state to the client for debugging
  return { products: [], error: error.message };
} else if (products.length === 0) {
  // This helps distinguish between "no data" and "query not run" scenarios
}

return { products };
};

// Action to handle sign-outs
export const actions = {
  signout: async ({ locals: { supabase, getSession } }) => {
    const session = await getSession();
    if (session) {
      await supabase.auth.signOut();
      throw redirect(303, "/"); // Redirects to the home page after sign out
    }
  },
};
