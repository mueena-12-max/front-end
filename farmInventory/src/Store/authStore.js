import {create} from "zustand"
import {devtools,persist} from "zustand/middleware"

const authStore = (set, get) => ({
    login: false,
    logout: true,
    token: null,
    refreshToken: null,

    loginFunc: (data, refreshToken) => {
        set({
            token: data,
            refreshToken: refreshToken,
            login: true,
            logout: false
        })
    },

    // Function to refresh the access token
    refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
            return false;
        }

        try {
            const res = await fetch(`http://localhost:5000/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
            });

            const data = await res.json();

            if (res.ok && data.token) {
                set({ token: data.token });
                return true;
            }
            
            // If refresh failed, logout user
            get().logoutFunc();
            return false;
        } catch (error) {
            console.error("Failed to refresh token:", error);
            get().logoutFunc();
            return false;
        }
    },

    logoutFunc: () => {
        set({
            token: null,
            refreshToken: null,
            login: false,
            logout: true
        })
    }
});


const useAuthStore = create(
    devtools(
        persist(authStore, {
            name: "auth",
        })
    )
);
export default useAuthStore;
