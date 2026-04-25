const DashboardView = {
    template: `
    <div class="min-h-screen bg-slate-50 font-sans pb-12">
        <nav class="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
            <div class="flex items-center gap-3">
                <div class="bg-emerald-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-md text-white font-bold text-sm font-mono">H</div>
                <h2 class="font-extrabold tracking-tight text-slate-800">Dashboard Dosen PA</h2>
            </div>
            <div class="flex items-center gap-6">
                <div class="text-right">
                    <p class="text-sm font-bold text-slate-700">{{ dosenName }}</p>
                    <p class="text-[10px] font-bold tracking-widest uppercase text-emerald-600">Dosen Pembimbing</p>
                </div>
                <button @click="logout" class="bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-all font-bold text-xs px-4 py-2 rounded-xl">LOGOUT</button>
            </div>
        </nav>

        <main class="p-8 max-w-7xl mx-auto space-y-8">
            <!-- Overview Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Wajib</p>
                    <p class="text-4xl font-black text-slate-800">{{ ringkasan.wajib }} <span class="text-sm font-bold text-slate-400">Surah</span></p>
                </div>
                <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 shadow-lg shadow-emerald-200 hover:-translate-y-1 transition-transform">
                    <p class="text-xs font-bold text-emerald-100 uppercase tracking-wider mb-2">Sudah Setor</p>
                    <p class="text-4xl font-black text-white">{{ ringkasan.sudah }} <span class="text-sm font-bold text-emerald-100">Surah</span></p>
                </div>
                <div class="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Belum Setor</p>
                    <p class="text-4xl font-black text-rose-500">{{ ringkasan.belum }} <span class="text-sm font-bold text-slate-400">Surah</span></p>
                </div>
                <div class="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-center">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Progress Total</p>
                    <div class="flex items-end gap-2">
                        <p class="text-4xl font-black text-slate-800">{{ ringkasan.progress }}%</p>
                    </div>
                    <div class="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                        <div class="bg-emerald-500 h-2 rounded-full transition-all duration-1000" :style="{ width: ringkasan.progress + '%' }"></div>
                    </div>
                </div>
            </div>

            <!-- Mahasiswa List -->
            <div class="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h3 class="font-black text-2xl text-slate-800 tracking-tight">Mahasiswa Bimbingan</h3>
                        <p class="text-sm font-medium text-slate-400 mt-1">Daftar mahasiswa yang berada di bawah bimbingan Anda.</p>
                    </div>
                    <div class="relative">
                        <input v-model="search" placeholder="Cari nama atau NIM..." class="bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all w-64 shadow-inner">
                        <span class="absolute left-4 top-3 text-xl text-slate-400">🔍</span>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead class="text-slate-400 text-[11px] font-black uppercase tracking-widest border-b-2 border-slate-100">
                            <tr>
                                <th class="pb-4 pl-4">Mahasiswa</th>
                                <th class="pb-4">Angkatan / Smt</th>
                                <th class="pb-4">Progress Setoran</th>
                                <th class="pb-4 text-right pr-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="m in filteredList" :key="m.nim" class="hover:bg-slate-50 transition-colors group cursor-pointer" @click="openAction(m)">
                                <td class="py-4 pl-4">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm shadow-sm">{{ m.nama.charAt(0) }}</div>
                                        <div>
                                            <p class="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{{ m.nama }}</p>
                                            <p class="text-xs font-semibold text-slate-400">{{ m.nim }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-4">
                                    <p class="font-bold text-slate-600">{{ m.angkatan }}</p>
                                    <p class="text-xs font-semibold text-slate-400">Semester {{ m.semester }}</p>
                                </td>
                                <td class="py-4">
                                    <div v-if="m.is_tuntas">
                                        <div class="flex items-center gap-3">
                                            <div class="flex-1 max-w-[120px] bg-emerald-100 rounded-full h-2 overflow-hidden">
                                                <div class="bg-emerald-500 h-2 rounded-full w-full"></div>
                                            </div>
                                            <span class="text-xs font-bold text-emerald-600">100%</span>
                                        </div>
                                        <p class="text-[10px] font-bold text-emerald-600 mt-1">Tuntas (Selesai Setoran)</p>
                                    </div>
                                    <div v-else>
                                        <div class="flex items-center gap-3">
                                            <div class="flex-1 max-w-[120px] bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div class="bg-emerald-500 h-2 rounded-full" :style="{ width: m.info_setoran.persentase_progres_setor + '%' }"></div>
                                            </div>
                                            <span class="text-xs font-bold text-slate-500">{{ m.info_setoran.persentase_progres_setor }}%</span>
                                        </div>
                                        <p class="text-[10px] font-bold text-slate-400 mt-1">{{ m.info_setoran.total_sudah_setor }} dari {{ m.info_setoran.total_wajib_setor }} surah</p>
                                    </div>
                                </td>
                                <td class="py-4 text-right pr-4">
                                    <button @click.stop="openAction(m)" class="bg-white border-2 border-slate-200 text-slate-600 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white text-[10px] font-black px-4 py-2.5 rounded-xl transition-all shadow-sm">
                                        LIHAT DETAIL
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="filteredList.length === 0">
                                <td colspan="4" class="py-12 text-center text-slate-400 font-medium">
                                    Tidak ada mahasiswa yang ditemukan.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>`,
    setup() {
        const search = Vue.ref('');
        const mhsList = Vue.ref([]);
        const dosenName = Vue.ref('Dosen PA');
        const router = VueRouter.useRouter();

        const fetchData = async () => {
            try { 
                const res = await api.get('/dosen/pa-saya'); 
                dosenName.value = res.data.data.nama;
                mhsList.value = res.data.data.info_mahasiswa_pa.daftar_mahasiswa; 
            } catch (e) {
                console.error("Gagal ambil data", e);
                Swal.fire('Gagal', 'Tidak dapat mengambil data mahasiswa', 'error');
            }
        };

        const logout = () => { 
            localStorage.removeItem('access_token'); 
            router.push('/');
        };

        const openAction = (m) => {
            router.push('/mahasiswa/' + m.nim);
        };

        const processedList = Vue.computed(() => {
            return mhsList.value.map(m => {
                const info = m.info_setoran || {};
                
                // SEMUA angkatan 23 surah
                const total_wajib = 23;
                
                const sudah = info.total_sudah_setor || 0;
                
                let progress = Math.round((sudah / total_wajib) * 100);
                if (progress > 100) progress = 100;
                if (isNaN(progress)) progress = 0;

                const isTuntas = sudah >= total_wajib;

                return {
                    ...m,
                    is_tuntas: isTuntas,
                    info_setoran: {
                        ...info,
                        total_wajib_setor: total_wajib,
                        total_sudah_setor: sudah,
                        total_belum_setor: Math.max(0, total_wajib - sudah),
                        persentase_progres_setor: progress
                    }
                };
            });
        });

        const ringkasan = Vue.computed(() => {
            let wajib = 0, sudah = 0, belum = 0;
            processedList.value.forEach(m => {
                if (m.info_setoran) {
                    wajib += m.info_setoran.total_wajib_setor || 0;
                    sudah += m.info_setoran.total_sudah_setor || 0;
                    belum += m.info_setoran.total_belum_setor || 0;
                }
            });
            const progress = wajib === 0 ? 0 : Math.round((sudah / wajib) * 100);
            return { wajib, sudah, belum, progress };
        });

        const filteredList = Vue.computed(() => 
            processedList.value.filter(m => m.nim.includes(search.value) || m.nama.toLowerCase().includes(search.value.toLowerCase()))
        );

        Vue.onMounted(fetchData);
        return { search, mhsList, dosenName, filteredList, ringkasan, logout, openAction };
    }
};