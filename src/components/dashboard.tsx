'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getDashboardData } from '@/api/dashboard/dashboard';
import CountUp from 'react-countup';

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        "screens": {
            "total": 0,
            "recentlyAdded": 0,
            "active": 0,
            "inactive": 0
        },
        "playlists": {
            "total": 0,
            "online": 0
        },
        "media": {
            "total": 0,
            "recentlyAdded": 0
        }
    });
    const fechDashboardData = async () => {
        try {
            const response = await getDashboardData();
            setDashboardData(response);
        } catch (error) {
            console.log(error);
        }
    }
   useEffect(() => {
        fechDashboardData();
    }, []);
    
    const insights = [
        {
            name: "Total Screens",
            value: dashboardData.screens.total,
            icon: "/icons/screens.png",
            change: `${dashboardData.screens.recentlyAdded} Recently Added`,
            valueChange: dashboardData.screens.recentlyAdded
        },
        {
            name: "Active Screens",
            value: dashboardData.screens.active,
            icon: "/icons/checked.png",
            change: `${dashboardData.screens.inactive} Inactive`,
            valueChange: dashboardData.screens.inactive
        },
        {
            name: "Total Playlists",
            value: dashboardData.playlists.total,
            icon: "/icons/playlist.png",
            change: `${dashboardData.playlists.online} Online`,
            valueChange: dashboardData.playlists.online
        },
        {
            name: "Total Media",
            value: dashboardData.media.total,
            icon: "/icons/media.png",
            change: `${dashboardData.media.recentlyAdded} Recently Added`,
            valueChange: dashboardData.media.recentlyAdded
        }
    ];

    return (
        <div className='w-full'>
            {/* Dashboard insights */}
            <div className="grid grid-cols-4 gap-6">
                {insights.map((insight, index) => (
                     <motion.div
                     key={index}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{
                       duration: 0.4,
                       delay: index * 0.1, // staggered effect
                       ease: "easeOut",
                     }}
                   >
                    <div
                        className="rounded-lg border dark:border-slate-500 shadow-lg p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                    >
                        <div className="w-[80px] h-[80px] flex items-center justify-center rounded-full">
                            <Image src={insight.icon} alt={insight.name} width={40} height={40} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-sm">{insight.name}</h1>
                            <p className="text-3xl font-bold"><CountUp end={Number(insight.value)} /></p>
                            <p className="text-sm dark:text-white">{insight.change}</p>
                        </div>
                    </div>
                    </motion.div>
                ))}
            </div>
            {/* Container 2 */}
            
            <div className="grid gap-6 mt-6 [grid-template-columns:2fr_1fr]">
                {/* Left column */}
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 2 * 0.1, // staggered effect
                  ease: "easeOut",
                }}
                >
                <div className="w-full h-[450px] border dark:border-slate-500 rounded-lg shadow-lg custom-scroll transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                    {/* Recent Activity content */}
                    <div className="p-4">
                        <h1 className="text-xl font-semibold dark:text-white border-b border-[#dcdcdc] dark:border-gray-600 pb-2">Recent Activity</h1>
                        {/* empty state */}
                    </div>
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                    </div>
                </div>
                </motion.div>
                {/* Right column */}
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 2 * 0.1, // staggered effect
                  ease: "easeOut",
                }}
                >
                <div className="w-full h-[450px] border dark:border-slate-500 rounded-lg shadow-lg custom-scroll transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                    {/* System Health content */}
                    <div className="p-4">
                        <h1 className="text-xl font-semibold dark:text-white border-b border-[#dcdcdc] dark:border-gray-600 pb-2">System Health</h1>
                        {/* empty state */}
                    </div>
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-100 dark:text-gray-400">No system health data available</p>
                    </div>
                </div>
                </motion.div>
            </div>

        </div>
    );
}
