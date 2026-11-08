<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2">
          <span class="inline-flex p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </span>
          <h2 class="text-xl font-bold text-slate-800 tracking-tight">Hardware Telemático & Almacén</h2>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          Gestión de stock en bodega (GPS, SIMs, sensores BLE, MDVRs) y certificación de hardware instalado en flota.
        </p>
      </div>

      <div class="flex items-center space-x-2.5">
        <button
          v-if="activeMainTab === 'stock'"
          @click="isAddStockModalOpen = true"
          class="px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 active:bg-teal-700 rounded-lg transition-colors shadow-xs flex items-center space-x-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Registrar en Bodega</span>
        </button>

        <button
          @click="loadAllData"
          class="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-2xs flex items-center space-x-1.5"
        >
          <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Actualizar</span>
        </button>
      </div>
    </div>

    <!-- Pestañas Principales: Flota Monitoreada vs Almacén de Bodega -->
    <div class="flex items-center space-x-2 border-b border-slate-200 pb-2">
      <button
        @click="activeMainTab = 'fleet'"
        class="px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-2"
        :class="activeMainTab === 'fleet' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'"
      >
        <span>🚛 Flota Monitoreada ({{ telematicsStore.vehicles.length }})</span>
      </button>

      <button
        @click="activeMainTab = 'stock'"
        class="px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 relative"
        :class="activeMainTab === 'stock' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'"
      >
        <span>📦 Almacén de Bodega (Stock)</span>
        <span
          v-if="telematicsStore.stockMetrics.available_total > 0"
          class="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
          :class="activeMainTab === 'stock' ? 'bg-white text-teal-800' : 'bg-teal-100 text-teal-800'"
        >
          {{ telematicsStore.stockMetrics.available_total }} disponibles
        </span>
      </button>
    </div>

    <!-- Toast de Notificación -->
    <div
      v-if="toastMsg"
      class="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs transition-all"
    >
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>{{ toastMsg }}</span>
      </div>
      <button @click="toastMsg = ''" class="text-emerald-700 hover:text-emerald-900 text-sm font-bold">×</button>
    </div>

    <!-- ========================================== -->
    <!-- PESTAÑA 1: FLOTA MONITOREADA Y CERTIFICADA -->
    <!-- ========================================== -->
    <div v-if="activeMainTab === 'fleet'" class="space-y-6">
      <!-- Fila de Métricas / KPIs Telemáticos -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <!-- 1. Total Monitoreados -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">GPS Certificados</span>
          <div class="flex items-baseline space-x-2 mt-1">
            <span class="text-2xl font-black text-slate-800">{{ telematicsStore.metrics.total_tracked }}</span>
            <span class="text-xs text-slate-500 font-medium">de {{ telematicsStore.metrics.total_vehicles || telematicsStore.vehicles.length }}</span>
          </div>
        </div>

        <!-- 2. Pendientes de Instalación -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pendientes Montaje</span>
          <div class="flex items-baseline space-x-2 mt-1">
            <span class="text-2xl font-black text-amber-600">{{ telematicsStore.metrics.pending_install || 0 }}</span>
            <span class="inline-flex items-center text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
              En Patio
            </span>
          </div>
        </div>

        <!-- 3. GPS Online -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Transmitiendo 4G</span>
          <div class="flex items-baseline space-x-2 mt-1">
            <span class="text-2xl font-black text-teal-600">{{ telematicsStore.metrics.online_gps }}</span>
            <span class="inline-flex items-center text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded">
              <span class="w-1.5 h-1.5 rounded-full bg-teal-500 mr-1 animate-pulse"></span> Online
            </span>
          </div>
        </div>

        <!-- 4. Sensores Combustible -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Sensores BLE</span>
          <div class="flex items-baseline space-x-2 mt-1">
            <span class="text-2xl font-black text-slate-700">{{ telematicsStore.metrics.calibrated_fuel }}</span>
            <span class="text-xs text-slate-500 font-medium">calibrados</span>
          </div>
        </div>

        <!-- 5. Cámaras MDVR -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Video MDVR 4G</span>
          <div class="flex items-baseline space-x-2 mt-1">
            <span class="text-2xl font-black text-indigo-600">{{ telematicsStore.metrics.active_mdvr }}</span>
            <span class="text-xs text-slate-500 font-medium">cámaras</span>
          </div>
        </div>
      </div>

      <!-- Buscador & Filtros de Flota -->
      <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="relative w-full sm:w-80">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por placa, IMEI, SIM o modelo..."
            class="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Filtro Rápido por Equipo -->
        <div class="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          <button
            @click="filterType = 'all'"
            class="px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0"
            :class="filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
          >
            Todos
          </button>
          <button
            @click="filterType = 'gps'"
            class="px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0"
            :class="filterType === 'gps' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
          >
            Solo GPS
          </button>
          <button
            @click="filterType = 'fuel'"
            class="px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0"
            :class="filterType === 'fuel' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
          >
            Con Sensor BLE
          </button>
          <button
            @click="filterType = 'mdvr'"
            class="px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0"
            :class="filterType === 'mdvr' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
          >
            Con MDVR 4G
          </button>
        </div>
      </div>

      <!-- Grid de Vehículos con Hardware Telemático -->
      <div v-if="telematicsStore.isLoading" class="p-12 text-center text-slate-400">
        <svg class="animate-spin h-8 w-8 text-teal-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-xs font-semibold">Cargando inventario telemático de la flota...</span>
      </div>

      <div v-else-if="filteredVehicles.length === 0" class="bg-white p-8 rounded-xl border border-slate-200 text-center">
        <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 class="text-sm font-bold text-slate-700">No se encontraron unidades</h4>
        <p class="text-xs text-slate-500 mt-1">Intenta con otro término de búsqueda o limpia los filtros.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
          v-for="item in filteredVehicles"
          :key="item.vehicle_id"
          class="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow p-5 flex flex-col justify-between space-y-4"
        >
          <!-- Top: Info de la Unidad -->
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-mono text-base font-black text-slate-800 tracking-wide">
                  {{ item.plate_number }}
                </span>
                <span
                  class="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase"
                  :class="item.telematics?.has_telematics && item.telematics?.gps?.installed ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
                >
                  {{ item.telematics?.has_telematics && item.telematics?.gps?.installed ? 'Certificado' : 'Pendiente Instalación' }}
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                {{ item.brand }} {{ item.model }} ({{ item.year }}) • {{ item.vehicle_type }}
              </p>
            </div>

            <!-- Indicador Online/Offline -->
            <div class="flex items-center space-x-1.5">
              <span
                class="w-2.5 h-2.5 rounded-full"
                :class="item.telematics?.gps?.status === 'online' ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-slate-300'"
              ></span>
              <span class="text-[11px] font-bold capitalize text-slate-600">
                {{ item.telematics?.gps?.status || 'Inactivo' }}
              </span>
            </div>
          </div>

          <!-- Módulos de Hardware Instalado -->
          <div class="space-y-3 pt-1">
            <!-- 1. GPS Tracker -->
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-700 flex items-center space-x-1">
                  <span>🛰️ GPS 4G:</span>
                  <span class="text-slate-900 font-semibold">{{ item.telematics?.gps?.model || 'No configurado' }}</span>
                </span>
                <span v-if="item.telematics?.gps?.installed" class="text-[10px] text-teal-600 font-bold bg-teal-50 px-1.5 py-0.5 rounded">
                  Instalado
                </span>
              </div>
              <div v-if="item.telematics?.gps?.installed" class="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-mono">
                <div>IMEI: <span class="font-bold text-slate-800">{{ item.telematics.gps.imei }}</span></div>
                <div>SIM: <span class="font-semibold text-slate-800">{{ item.telematics.gps.sim_number }}</span></div>
              </div>
              <div v-else class="text-[11px] text-slate-400 italic">
                Pendiente de asignación de terminal GPS
              </div>
            </div>

            <!-- 2. Sensor de Combustible -->
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-700 flex items-center space-x-1">
                  <span>⛽ Sensor Combustible:</span>
                  <span class="text-slate-900 font-semibold">{{ item.telematics?.fuel_sensor?.installed ? item.telematics.fuel_sensor.model : 'No instalado' }}</span>
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  :class="item.telematics?.fuel_sensor?.installed ? 'bg-amber-50 text-amber-700' : 'bg-slate-200 text-slate-500'"
                >
                  {{ item.telematics?.fuel_sensor?.installed ? 'Calibrado' : 'Opcional' }}
                </span>
              </div>
              <div v-if="item.telematics?.fuel_sensor?.installed" class="flex items-center justify-between text-[11px] text-slate-600 font-mono">
                <span>ID: {{ item.telematics.fuel_sensor.sensor_id }}</span>
                <span>Calib: {{ item.telematics.fuel_sensor.last_calibration || 'Reciente' }}</span>
              </div>
            </div>

            <!-- 3. Video MDVR -->
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-700 flex items-center space-x-1">
                  <span>📹 Video MDVR:</span>
                  <span class="text-slate-900 font-semibold">{{ item.telematics?.mdvr?.installed ? item.telematics.mdvr.model : 'No instalado' }}</span>
                </span>
                <span
                  v-if="item.telematics?.mdvr?.installed"
                  class="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded"
                >
                  {{ item.telematics.mdvr.channels }} Ch
                </span>
              </div>
              <div v-if="item.telematics?.mdvr?.installed" class="text-[11px] text-slate-600 font-mono">
                S/N: {{ item.telematics.mdvr.serial }}
              </div>
              <div v-else class="text-[11px] text-slate-400 italic">
                Sin cámaras configuradas
              </div>
            </div>

            <!-- 4. Periféricos de Seguridad -->
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
              <div class="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>🛡️ Periféricos de Patio</span>
                <span class="text-[10px] text-slate-400 font-mono">{{ item.telematics?.certified_at ? item.telematics.certified_at.split(' ')[0] : 'Certificado' }}</span>
              </div>
              <div class="flex flex-wrap gap-1.5 text-[10px]">
                <span
                  class="px-2 py-0.5 rounded font-semibold"
                  :class="item.telematics?.panic_button?.installed ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-200 text-slate-400'"
                >
                  Pánico: {{ item.telematics?.panic_button?.installed ? 'Conectado' : 'No' }}
                </span>
                <span
                  class="px-2 py-0.5 rounded font-semibold"
                  :class="item.telematics?.relay?.installed ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-slate-200 text-slate-400'"
                >
                  Relé Corte: {{ item.telematics?.relay?.installed ? '12V/24V' : 'No' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Acciones Footer -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              v-if="item.telematics?.gps?.installed"
              @click="openPingModal(item)"
              class="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 rounded-lg transition-colors border border-emerald-200 flex items-center space-x-1.5 shadow-2xs"
            >
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Ping Diagnóstico</span>
            </button>
            <span v-else class="text-[11px] text-slate-400 italic">
              Ping no disponible
            </span>

            <button
              @click="openEditModal(item)"
              class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1 shadow-2xs"
              :class="item.telematics?.gps?.installed ? 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200' : 'text-white bg-teal-600 hover:bg-teal-500'"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>{{ item.telematics?.gps?.installed ? 'Gestionar Hardware' : '+ Instalar Hardware' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- PESTAÑA 2: ALMACÉN DE BODEGA (STOCK)       -->
    <!-- ========================================== -->
    <div v-else-if="activeMainTab === 'stock'" class="space-y-6">
      <!-- Fila de KPIs de Bodega -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <!-- 1. GPS Trackers -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">🛰️ GPS Trackers 4G</span>
            <span class="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
              {{ telematicsStore.stockMetrics.available_gps }} Disponibles
            </span>
          </div>
          <div class="flex items-baseline space-x-2 mt-2">
            <span class="text-2xl font-black text-slate-800">{{ telematicsStore.stock.gps.length }}</span>
            <span class="text-xs text-slate-500 font-medium">en almacén ({{ telematicsStore.stockMetrics.installed_gps }} instalados)</span>
          </div>
        </div>

        <!-- 2. SIM Cards -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">📶 Chips SIM IoT</span>
            <span class="text-[10px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">
              {{ telematicsStore.stockMetrics.available_sims }} Disponibles
            </span>
          </div>
          <div class="flex items-baseline space-x-2 mt-2">
            <span class="text-2xl font-black text-slate-800">{{ telematicsStore.stock.sims.length }}</span>
            <span class="text-xs text-slate-500 font-medium">chips ({{ telematicsStore.stockMetrics.installed_sims }} instalados)</span>
          </div>
        </div>

        <!-- 3. Sensores BLE -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">⛽ Sensores BLE</span>
            <span class="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
              {{ telematicsStore.stockMetrics.available_fuel }} Disponibles
            </span>
          </div>
          <div class="flex items-baseline space-x-2 mt-2">
            <span class="text-2xl font-black text-slate-800">{{ telematicsStore.stock.fuel_sensors.length }}</span>
            <span class="text-xs text-slate-500 font-medium">varas ({{ telematicsStore.stockMetrics.installed_fuel }} instaladas)</span>
          </div>
        </div>

        <!-- 4. Grabadores MDVR -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">📹 Cámaras MDVR</span>
            <span class="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              {{ telematicsStore.stockMetrics.available_mdvrs }} Disponibles
            </span>
          </div>
          <div class="flex items-baseline space-x-2 mt-2">
            <span class="text-2xl font-black text-slate-800">{{ telematicsStore.stock.mdvrs.length }}</span>
            <span class="text-xs text-slate-500 font-medium">equipos ({{ telematicsStore.stockMetrics.installed_mdvrs }} instalados)</span>
          </div>
        </div>
      </div>

      <!-- Buscador y Filtros de Almacén -->
      <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="relative w-full sm:w-80">
          <input
            v-model="stockSearchTerm"
            type="text"
            placeholder="Buscar por IMEI, SIM, modelo, serial o placa instalada..."
            class="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Categoría de Hardware -->
        <div class="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          <button
            @click="stockCategoryFilter = 'all'"
            class="px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0"
            :class="stockCategoryFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
          >
            Todos ({{ allStockFlatList.length }})
          </button>
          <button
            @click="stockCategoryFilter = 'gps'"
            class="px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0"
            :class="stockCategoryFilter === 'gps' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
          >
            GPS ({{ telematicsStore.stock.gps.length }})
          </button>
          <button
            @click="stockCategoryFilter = 'sim'"
            class="px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0"
            :class="stockCategoryFilter === 'sim' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
          >
            SIMs ({{ telematicsStore.stock.sims.length }})
          </button>
          <button
            @click="stockCategoryFilter = 'fuel_sensor'"
            class="px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0"
            :class="stockCategoryFilter === 'fuel_sensor' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
          >
            Sensores BLE ({{ telematicsStore.stock.fuel_sensors.length }})
          </button>
          <button
            @click="stockCategoryFilter = 'mdvr'"
            class="px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0"
            :class="stockCategoryFilter === 'mdvr' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
          >
            MDVR ({{ telematicsStore.stock.mdvrs.length }})
          </button>
        </div>
      </div>

      <!-- Tabla de Almacén de Stock -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th class="py-3 px-4">Componente / Tipo</th>
                <th class="py-3 px-4">Modelo / Detalle</th>
                <th class="py-3 px-4">Identificador Único</th>
                <th class="py-3 px-4">Estado en Bodega</th>
                <th class="py-3 px-4">Asignación / Unidad</th>
                <th class="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="filteredStockList.length === 0">
                <td colspan="6" class="py-8 text-center text-slate-400 italic">
                  No se encontraron elementos en el almacén con los filtros seleccionados.
                </td>
              </tr>
              <tr
                v-for="item in filteredStockList"
                :key="item.unique_key || item.id"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <!-- Tipo con Icono -->
                <td class="py-3 px-4">
                  <div class="flex items-center space-x-2">
                    <span
                      class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                      :class="getItemTypeBadgeClass(item.type)"
                    >
                      {{ getItemTypeIcon(item.type) }}
                    </span>
                    <span class="font-bold text-slate-800 capitalize">{{ getItemTypeLabel(item.type) }}</span>
                  </div>
                </td>

                <!-- Modelo / Detalle -->
                <td class="py-3 px-4">
                  <div class="font-semibold text-slate-800">{{ item.model || item.operator }}</div>
                  <div v-if="item.channels" class="text-[10px] text-slate-400">{{ item.channels }} canales de grabación</div>
                </td>

                <!-- Identificador Único -->
                <td class="py-3 px-4 font-mono">
                  <span class="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {{ item.imei || item.number || item.sensor_id || item.serial }}
                  </span>
                </td>

                <!-- Estado -->
                <td class="py-3 px-4">
                  <span
                    v-if="item.status === 'available'"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                    Disponible en Bodega
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-sky-500 mr-1.5"></span>
                    Instalado en Unidad
                  </span>
                </td>

                <!-- Asignación / Placa -->
                <td class="py-3 px-4">
                  <div v-if="item.installed_in" class="flex items-center space-x-1.5">
                    <span class="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                      {{ item.installed_in.plate_number }}
                    </span>
                    <span class="text-[10px] text-slate-500 truncate max-w-[120px]">
                      {{ item.installed_in.brand }} {{ item.installed_in.model }}
                    </span>
                  </div>
                  <div v-else class="text-[11px] text-slate-400 italic">
                    Sin asignar (Listo para montaje)
                  </div>
                </td>

                <!-- Acciones -->
                <td class="py-3 px-4 text-right">
                  <button
                    v-if="item.installed_in"
                    @click="viewVehicleInFleet(item.installed_in.plate_number)"
                    class="px-2.5 py-1 text-[11px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
                  >
                    Ver Unidad ↗
                  </button>
                  <button
                    v-else
                    @click="promptAssignStockItem(item)"
                    class="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    Asignar a Flota →
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <TelematicsModal
      :show="isEditModalOpen"
      :vehicle="selectedVehicle"
      @close="isEditModalOpen = false"
      @saved="handleSavedHardware"
    />

    <TelematicsPingModal
      :show="isPingModalOpen"
      :vehicle="selectedVehicle"
      @close="isPingModalOpen = false"
    />

    <AddStockItemModal
      :show="isAddStockModalOpen"
      @close="isAddStockModalOpen = false"
      @saved="handleSavedStockItem"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTelematicsStore } from '../../stores/telematics'
import TelematicsModal from '../../components/admin/TelematicsModal.vue'
import TelematicsPingModal from '../../components/admin/TelematicsPingModal.vue'
import AddStockItemModal from '../../components/admin/AddStockItemModal.vue'

const route = useRoute()
const telematicsStore = useTelematicsStore()

const activeMainTab = ref('fleet') // 'fleet' | 'stock'
const searchTerm = ref('')
const filterType = ref('all')
const toastMsg = ref('')

// Filtros para Stock de Bodega
const stockSearchTerm = ref('')
const stockCategoryFilter = ref('all')

const isEditModalOpen = ref(false)
const isPingModalOpen = ref(false)
const isAddStockModalOpen = ref(false)
const selectedVehicle = ref(null)

const loadAllData = () => {
  telematicsStore.fetchInventory()
  telematicsStore.fetchStock()
}

const openEditModal = (vehicle) => {
  selectedVehicle.value = vehicle
  isEditModalOpen.value = true
}

const openPingModal = (vehicle) => {
  selectedVehicle.value = vehicle
  isPingModalOpen.value = true
}

const handleSavedHardware = async ({ vehicleId, data, setLoading, setError }) => {
  const res = await telematicsStore.assignHardware(vehicleId, data)
  setLoading(false)
  if (res.success) {
    isEditModalOpen.value = false
    toastMsg.value = `Hardware telemático certificado correctamente para la unidad.`
    // Refrescar también stock
    telematicsStore.fetchStock()
    setTimeout(() => { toastMsg.value = '' }, 5000)
  } else {
    setError(res.message)
  }
}

const handleSavedStockItem = async ({ data, setLoading, setError, resetForm }) => {
  const res = await telematicsStore.addStockItem(data)
  setLoading(false)
  if (res.success) {
    isAddStockModalOpen.value = false
    resetForm()
    toastMsg.value = `Equipo registrado exitosamente en el almacén de bodega.`
    setTimeout(() => { toastMsg.value = '' }, 5000)
  } else {
    setError(res.message || 'Error al guardar el equipo en almacén.')
  }
}

const filteredVehicles = computed(() => {
  return telematicsStore.vehicles.filter((v) => {
    if (searchTerm.value) {
      const q = searchTerm.value.toLowerCase()
      const plate = (v.plate_number || '').toLowerCase()
      const brand = (v.brand || '').toLowerCase()
      const model = (v.model || '').toLowerCase()
      const imei = (v.telematics?.gps?.imei || '').toLowerCase()
      const sim = (v.telematics?.gps?.sim_number || '').toLowerCase()

      if (!plate.includes(q) && !brand.includes(q) && !model.includes(q) && !imei.includes(q) && !sim.includes(q)) {
        return false
      }
    }

    if (filterType.value === 'gps') {
      return !!v.telematics?.gps?.installed
    }
    if (filterType.value === 'fuel') {
      return !!v.telematics?.fuel_sensor?.installed
    }
    if (filterType.value === 'mdvr') {
      return !!v.telematics?.mdvr?.installed
    }

    return true
  })
})

// Lista aplanada de todos los ítems de stock para la tabla de bodega
const allStockFlatList = computed(() => {
  const list = []
  const stock = telematicsStore.stock || {}

  ;(stock.gps || []).forEach((g) => {
    list.push({ ...g, type: 'gps', unique_key: `gps_${g.id}_${g.imei}` })
  })
  ;(stock.sims || []).forEach((s) => {
    list.push({ ...s, type: 'sim', unique_key: `sim_${s.id}_${s.number}` })
  })
  ;(stock.fuel_sensors || []).forEach((f) => {
    list.push({ ...f, type: 'fuel_sensor', unique_key: `fuel_${f.id}_${f.sensor_id}` })
  })
  ;(stock.mdvrs || []).forEach((m) => {
    list.push({ ...m, type: 'mdvr', unique_key: `mdvr_${m.id}_${m.serial}` })
  })

  return list
})

const totalStockItems = computed(() => allStockFlatList.value.length)

// Filtro de Almacén de Bodega
const filteredStockList = computed(() => {
  return allStockFlatList.value.filter((item) => {
    if (stockCategoryFilter.value !== 'all' && item.type !== stockCategoryFilter.value) {
      return false
    }

    if (stockSearchTerm.value) {
      const q = stockSearchTerm.value.toLowerCase()
      const model = (item.model || '').toLowerCase()
      const operator = (item.operator || '').toLowerCase()
      const imei = (item.imei || '').toLowerCase()
      const number = (item.number || '').toLowerCase()
      const sensorId = (item.sensor_id || '').toLowerCase()
      const serial = (item.serial || '').toLowerCase()
      const plate = (item.installed_in?.plate_number || '').toLowerCase()

      if (
        !model.includes(q) &&
        !operator.includes(q) &&
        !imei.includes(q) &&
        !number.includes(q) &&
        !sensorId.includes(q) &&
        !serial.includes(q) &&
        !plate.includes(q)
      ) {
        return false
      }
    }

    return true
  })
})

const getItemTypeBadgeClass = (type) => {
  switch (type) {
    case 'gps': return 'bg-teal-100 text-teal-800'
    case 'sim': return 'bg-sky-100 text-sky-800'
    case 'fuel_sensor': return 'bg-amber-100 text-amber-800'
    case 'mdvr': return 'bg-indigo-100 text-indigo-800'
    default: return 'bg-slate-100 text-slate-800'
  }
}

const getItemTypeIcon = (type) => {
  switch (type) {
    case 'gps': return '🛰️'
    case 'sim': return '📶'
    case 'fuel_sensor': return '⛽'
    case 'mdvr': return '📹'
    default: return '📦'
  }
}

const getItemTypeLabel = (type) => {
  switch (type) {
    case 'gps': return 'GPS 4G'
    case 'sim': return 'SIM IoT'
    case 'fuel_sensor': return 'Sensor BLE'
    case 'mdvr': return 'MDVR 4G'
    default: return type
  }
}

const viewVehicleInFleet = (plate) => {
  activeMainTab.value = 'fleet'
  searchTerm.value = plate
}

const promptAssignStockItem = (item) => {
  activeMainTab.value = 'fleet'
  toastMsg.value = `Selecciona la unidad en la flota y haz clic en "Instalar Hardware". El componente ${item.model || item.number || item.imei} estará disponible en el selector de bodega.`
  setTimeout(() => { toastMsg.value = '' }, 6000)
}

onMounted(() => {
  if (route.query.search) {
    searchTerm.value = String(route.query.search)
  }
  loadAllData()
})
</script>