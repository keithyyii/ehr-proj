import React, { useEffect, useCallback, useState } from 'react';
// FIX: Explicitly check path from pages/Dashboard to context/NavigationContext
import { useNavigation } from '../context/NavigationContext.jsx';
// FIX: Explicitly check path from pages/Dashboard to supabase/supabaseClient
import { useSupabaseClient } from '../supabase/supabaseClient.js';
// FIX: Explicitly check path from pages/Dashboard to components/StatCard
import StatCard from '../components/StatCard.jsx';
// FIX: Explicitly check path from pages/Dashboard to components/RecentEncounters
import RecentEncounters from '../components/RecentEncounters.jsx';

const Dashboard = () => {
    const { navigate } = useNavigation();
    const { supabase, isReady: isSupabaseReady } = useSupabaseClient();
    
    // State management for data
    const [encounters, setEncounters] = useState([]); 
    const [stats, setStats] = useState({
      patientsCheckedIn: null,
      encountersToday: null,
      pendingReferrals: null,
    });

    // Fixed Button Handlers
    const handleRegisterPatient = () => navigate('patients', { action: 'register' });
    const handleRecordVitals = () => navigate('encounter', { action: 'vitals' });
    const handleExportCensus = () => console.log('Exporting Census (Client-side CSV demo)'); // Retained console log functionality

    // Data Fetching Logic (Identical to previous logic, but using the hook)
    const fetchDashboardData = useCallback(async () => {
        if (!isSupabaseReady || !supabase) {
            console.log("Supabase client not ready. Skipping fetch.");
            return;
        }

        try {
            // Fetch Key Stats
            const { data: statsData, error: statsError } = await supabase
                .from('dashboard_stats')
                .select('patients_checked_in, encounters_today, pending_referrals')
                .limit(1)
                .single();
            
            if (statsError) {
                console.error('Error fetching stats:', statsError);
            } else {
                setStats({
                    patientsCheckedIn: statsData?.patients_checked_in || 0,
                    encountersToday: statsData?.encounters_today || 0,
                    pendingReferrals: statsData?.pending_referrals || 0,
                });
            }

            // Fetch Recent Encounters
            const { data: encountersData, error: encountersError } = await supabase
                .from('recent_encounters')
                .select('id, patient_name, complaint, encounter_time') 
                .order('encounter_time', { ascending: false })
                .limit(4);

            if (encountersError) {
                console.error('Error fetching encounters:', encountersError);
            } else {
                const formattedEncounters = encountersData.map(e => ({
                    id: e.id,
                    patient: e.patient_name,
                    complaint: e.complaint,
                    time: new Date(e.encounter_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                }));
                setEncounters(formattedEncounters);
            }

        } catch (error) {
            console.error('Network or unknown error during data fetch:', error);
        }
    }, [isSupabaseReady, supabase]);

    // Effect Hooks: Fetch data when client is ready and set up real-time listener
    useEffect(() => {
        if (!isSupabaseReady || !supabase) {
            return;
        }

        fetchDashboardData();

        // Supabase Realtime Subscription
        const encountersChannel = supabase
            .channel('public:recent_encounters')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'recent_encounters' },
                (payload) => {
                    console.log('Realtime change detected:', payload.new);
                    fetchDashboardData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(encountersChannel);
        };
    }, [isSupabaseReady, fetchDashboardData, supabase]);

    return (
        <div className="flex flex-1 overflow-auto">
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <StatCard title="Patients checked-in today" value={stats.patientsCheckedIn} />
                        <StatCard title="Encounters today" value={stats.encountersToday} />
                        <StatCard title="Pending referrals" value={stats.pendingReferrals} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-64 hover:shadow-md transition-shadow duration-200">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Visits Over Time</h3>
                                <div className="flex items-center justify-center h-40 text-gray-300 text-sm font-medium">
                                    [Line chart placeholder]
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-48 hover:shadow-md transition-shadow duration-200">
                                    <h3 className="text-base font-semibold text-gray-900 mb-4">Diagnoses Distribution</h3>
                                    <div className="flex items-center justify-center h-24 text-gray-300 text-sm font-medium">
                                        [Pie chart placeholder]
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-48 hover:shadow-md transition-shadow duration-200">
                                    <h3 className="text-base font-semibold text-gray-900 mb-4">Top 5 Chief Complaints</h3>
                                    <div className="flex items-center justify-center h-24 text-gray-300 text-sm font-medium">
                                        [Bar chart placeholder]
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Vitals Quick View</h3>
                                <div className="flex items-center justify-center h-20 text-gray-300 text-sm font-medium">
                                    [Sparklines / mini-cards]
                                </div>
                            </div>

                            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={handleRegisterPatient}
                                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200 text-sm shadow-sm hover:shadow"
                                    >
                                        Register Patient
                                    </button>
                                    <button
                                        onClick={handleRecordVitals}
                                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200 text-sm shadow-sm hover:shadow"
                                    >
                                        Record Vitals
                                    </button>
                                    <button
                                        onClick={handleExportCensus}
                                        className="w-full py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition duration-200 text-sm shadow-sm hover:shadow"
                                    >
                                        Export Census
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <aside className="w-80 flex-shrink-0 border-l border-gray-200 bg-gray-50 p-4 space-y-4 overflow-y-auto">
                <RecentEncounters encounters={encounters} />

                <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Alerts</h3>
                    <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <span className="text-lg text-amber-600 flex-shrink-0">⚠️</span>
                            <p className="text-sm text-gray-700">Low stock: Paracetamol (20 left)</p>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <span className="text-lg text-blue-600 flex-shrink-0">ℹ️</span>
                            <p className="text-sm text-gray-700">Correction request: Jane Doe chart</p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Dashboard;