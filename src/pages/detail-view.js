const DetailView = {
    template: `
    <div class="min-h-screen bg-slate-50 font-sans pb-24 relative">
        <nav class="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
            <div class="flex items-center gap-4">
                <button @click="goBack" class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <h2 class="font-extrabold tracking-tight text-slate-800">Detail Mahasiswa</h2>
            </div>
        </nav>

        <main v-if="loading" class="p-8 flex justify-center items-center min-h-[60vh]">
            <div class="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </main>

        <main v-else class="p-8 max-w-7xl mx-auto space-y-8">
            <!-- Header Profile -->
            <div class="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
                <div class="absolute -right-20 -top-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
                
                <div class="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-emerald-200 shrink-0 z-10">
                    {{ info.nama ? info.nama.charAt(0) : '?' }}
                </div>
                
                <div class="flex-1 text-center md:text-left z-10">
                    <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold mb-3">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Mahasiswa Bimbingan
                    </div>
                    <h1 class="text-3xl font-black text-slate-800 tracking-tight">{{ info.nama }}</h1>
                    <p class="text-lg font-medium text-slate-500 mt-1">{{ info.nim }}</p>
                    
                    <div class="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                        <div class="bg-slate-50 px-4 py-2 rounded-xl">
                            <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Angkatan</p>
                            <p class="font-bold text-slate-700">{{ info.angkatan }}</p>
                        </div>
                        <div class="bg-slate-50 px-4 py-2 rounded-xl">
                            <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Semester</p>
                            <p class="font-bold text-slate-700">{{ info.semester }}</p>
                        </div>
                        <div class="bg-slate-50 px-4 py-2 rounded-xl">
                            <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email</p>
                            <p class="font-bold text-slate-700">{{ info.email }}</p>
                        </div>
                    </div>
                </div>

                <div class="w-full md:w-64 bg-slate-50 rounded-[2rem] p-6 text-center shrink-0 z-10">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Progres Setoran</p>
                    <div v-if="computedInfoDasar?.is_tuntas">
                        <div class="flex items-center justify-center gap-2 mb-3">
                            <span class="text-4xl font-black text-emerald-600">100%</span>
                        </div>
                        <div class="w-full bg-emerald-100 rounded-full h-3 overflow-hidden">
                            <div class="bg-emerald-500 h-3 rounded-full w-full"></div>
                        </div>
                        <p class="text-xs font-bold text-emerald-600 mt-3">Tuntas (Selesai Setoran)</p>
                    </div>
                    <div v-else>
                        <div class="flex items-center justify-center gap-2 mb-3">
                            <span class="text-4xl font-black text-slate-800">{{ computedInfoDasar?.persentase_progres_setor }}%</span>
                        </div>
                        <div class="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                            <div class="bg-emerald-500 h-3 rounded-full" :style="{ width: computedInfoDasar?.persentase_progres_setor + '%' }"></div>
                        </div>
                        <p class="text-xs font-bold text-slate-500 mt-3">{{ computedInfoDasar?.total_sudah_setor }} dari {{ computedInfoDasar?.total_wajib_setor }} Surah</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- List Surah -->
                <div class="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="font-black text-xl text-slate-800 tracking-tight">Daftar Surah Muroja'ah</h3>
                            <p class="text-sm font-medium text-slate-400">Pilih surah yang akan divalidasi hari ini.</p>
                        </div>
                    </div>
                    
                    <div class="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        <label v-for="surah in filteredDetail" :key="surah.id" 
                            class="flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer"
                            :class="[
                                surah.sudah_setor 
                                    ? 'bg-slate-50 border-slate-100 opacity-80' 
                                    : (selectedSurahs.some(s => s.id === surah.id) ? 'bg-emerald-50 border-emerald-500 shadow-md' : 'bg-white border-slate-100 hover:border-emerald-200')
                            ]"
                        >
                            <div class="flex items-center gap-4">
                                <div v-if="!surah.sudah_setor" class="relative flex items-center justify-center">
                                    <input type="checkbox" :value="surah" v-model="selectedSurahs" class="w-6 h-6 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer appearance-none checked:bg-emerald-500 transition-colors">
                                    <svg v-if="selectedSurahs.some(s => s.id === surah.id)" class="absolute pointer-events-none w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div v-else class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>

                                <div>
                                    <div class="flex items-center gap-2">
                                        <p class="font-bold text-slate-800" :class="{'text-slate-500 line-through': surah.sudah_setor}">{{ surah.nama }}</p>
                                        <span class="px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest text-white" 
                                            :class="surah.label === 'KP' ? 'bg-blue-500' : (surah.label === 'SEMPRO' ? 'bg-amber-500' : 'bg-slate-700')">
                                            {{ surah.label }}
                                        </span>
                                    </div>
                                    <p class="text-xs font-semibold text-slate-400 mt-0.5">Surah ke-{{ surah.external_id }} • {{ surah.nama_arab }}</p>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-4">
                                <div v-if="surah.sudah_setor" class="text-right">
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Disetor</p>
                                    <p class="text-xs font-bold text-emerald-600">{{ surah.info_setoran.tgl_setoran }}</p>
                                </div>
                                <button v-if="surah.sudah_setor" @click.prevent="deleteSetoran(surah)" class="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors" title="Batalkan Setoran">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </button>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Form Setoran Action -->
                <div class="lg:col-span-1">
                    <div class="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm sticky top-32">
                        <h3 class="font-black text-xl text-slate-800 tracking-tight mb-6">Validasi Setoran</h3>
                        
                        <div class="space-y-6">
                            <div>
                                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tanggal Setoran</label>
                                <input type="date" v-model="tglSetoran" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-inner">
                            </div>

                            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Surah Terpilih ({{ selectedSurahs.length }})</p>
                                <div v-if="selectedSurahs.length > 0" class="flex flex-wrap gap-2">
                                    <span v-for="s in selectedSurahs" :key="s.id" class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                                        {{ s.nama }}
                                    </span>
                                </div>
                                <p v-else class="text-xs font-medium text-slate-400 italic">Belum ada surah yang dipilih.</p>
                            </div>

                            <button @click="submitSetoran" :disabled="selectedSurahs.length === 0 || isSubmitting" 
                                class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex justify-center items-center gap-2">
                                <span v-if="isSubmitting" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <span>{{ isSubmitting ? 'Memproses...' : 'Simpan Validasi' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        
        <style>
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        </style>
    </div>`,
    setup() {
        const route = VueRouter.useRoute();
        const router = VueRouter.useRouter();
        const nim = route.params.nim;
        
        const loading = Vue.ref(true);
        const isSubmitting = Vue.ref(false);
        const info = Vue.ref({});
        const info_dasar = Vue.ref({});
        const detail = Vue.ref([]);
        const selectedSurahs = Vue.ref([]);
        
        // Default tglSetoran is today in YYYY-MM-DD
        const today = new Date();
        const tglSetoran = Vue.ref(today.toISOString().split('T')[0]);

        const fetchData = async () => {
            loading.value = true;
            try {
                const res = await api.get('/mahasiswa/setoran/' + nim);
                info.value = res.data.data.info;
                info_dasar.value = res.data.data.setoran.info_dasar;
                detail.value = res.data.data.setoran.detail;
                selectedSurahs.value = []; // reset selection
            } catch (e) {
                console.error("Gagal ambil data mahasiswa", e);
                Swal.fire('Error', 'Data mahasiswa tidak ditemukan', 'error');
                router.push('/dashboard');
            } finally {
                loading.value = false;
            }
        };

        const submitSetoran = async () => {
            if (selectedSurahs.value.length === 0) return;
            isSubmitting.value = true;
            
            const payload = {
                data_setoran: selectedSurahs.value.map(s => ({
                    nama_komponen_setoran: s.nama,
                    id_komponen_setoran: s.id
                })),
                tgl_setoran: tglSetoran.value
            };

            try {
                await api.post('/mahasiswa/setoran/' + nim, payload);
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Validasi setoran berhasil disimpan.', showConfirmButton: false, timer: 2000 });
                await fetchData(); // refresh data
            } catch (e) {
                console.error(e);
                Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan data.', 'error');
            } finally {
                isSubmitting.value = false;
            }
        };

        const deleteSetoran = async (surah) => {
            const result = await Swal.fire({
                title: 'Batalkan Setoran?',
                text: "Anda yakin ingin membatalkan setoran untuk surah " + surah.nama + "?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#94a3b8',
                confirmButtonText: 'Ya, Batalkan!'
            });

            if (result.isConfirmed) {
                try {
                    const payload = {
                        data_setoran: [{
                            id: surah.info_setoran.id,
                            id_komponen_setoran: surah.id,
                            nama_komponen_setoran: surah.nama
                        }]
                    };
                    await api.delete('/mahasiswa/setoran/' + nim, { data: payload });
                    Swal.fire({ icon: 'success', title: 'Dibatalkan!', text: 'Setoran berhasil dibatalkan.', showConfirmButton: false, timer: 1500 });
                    await fetchData(); // refresh data
                } catch (e) {
                    console.error(e);
                    Swal.fire('Gagal', 'Gagal membatalkan setoran.', 'error');
                }
            }
        };

        const goBack = () => {
            router.push('/dashboard');
        };

        const filteredDetail = Vue.computed(() => {
            if (!detail.value.length) return detail.value;
            // Semua angkatan 23 surah
            return detail.value.slice(-23);
        });

        const computedInfoDasar = Vue.computed(() => {
            const rawInfo = info_dasar.value || {};
            
            // SEMUA angkatan 23 surah
            const total_wajib = 23;
            
            const sudah = rawInfo.total_sudah_setor || 0;
            
            let progress = Math.round((sudah / total_wajib) * 100);
            if (progress > 100) progress = 100;
            if (isNaN(progress)) progress = 0;

            const isTuntas = sudah >= total_wajib;

            return {
                ...rawInfo,
                is_tuntas: isTuntas,
                total_wajib_setor: total_wajib,
                total_sudah_setor: sudah,
                total_belum_setor: Math.max(0, total_wajib - sudah),
                persentase_progres_setor: progress
            };
        });

        Vue.onMounted(fetchData);

        return { 
            loading, info, info_dasar: computedInfoDasar, detail, filteredDetail, computedInfoDasar, selectedSurahs, tglSetoran, isSubmitting, 
            submitSetoran, deleteSetoran, goBack 
        };
    }
};
