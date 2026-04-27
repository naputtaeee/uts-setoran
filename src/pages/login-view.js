const LoginView = {
    template: `
    <div class="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div class="w-full max-w-md bg-white border border-white shadow-2xl rounded-[3rem] p-10">
            <div class="text-center mb-8">
                <div class="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-white font-bold text-2xl font-mono">H</div>
                <h1 class="text-2xl font-bold">Selamat Siang/h1>
                <p class="text-slate-400 text-sm">Dashboard DPA Pak Fikry</p>
            </div>
            <form @submit.prevent="handleLogin" class="space-y-4">
                <input v-model="form.username" type="text" placeholder="Username / Email" class="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" required>
                <input v-model="form.password" type="password" placeholder="Password" class="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" required>
                <button :disabled="loading" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50">
                    {{ loading ? 'Memverifikasi...' : 'Sign In' }}
                </button>
            </form>
        </div>
    </div>`,
    setup() {
        const form = Vue.ref({ 
            username: 'muhammad.fikri@uin-suska.ac.id', 
            password: 'muhammad.fikri' 
        });
        const loading = Vue.ref(false);
        const router = VueRouter.useRouter();

        const handleLogin = async () => {
            loading.value = true;
            try {
                const res = await axios.post('https://id.tif.uin-suska.ac.id/realms/dev/protocol/openid-connect/token', {
                    client_id: 'setoran-mobile-dev',
                    client_secret: 'aqJp3xnXKudgC7RMOshEQP7ZoVKWzoSl',
                    grant_type: 'password',
                    username: form.value.username,
                    password: form.value.password,
                    scope: 'openid profile email'
                }, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                
                if (res.data.access_token) {
                    localStorage.setItem('access_token', res.data.access_token);
                    Swal.fire({ icon: 'success', title: 'Berhasil!', showConfirmButton: false, timer: 1500 });
                    router.push('/dashboard');
                }
            } catch (e) {
                console.error(e);
                Swal.fire('Gagal!', 'Cek jaringan atau kredensial salah.', 'error');
            } finally { 
                loading.value = false; 
            }
        };
        return { form, loading, handleLogin };
    }
};