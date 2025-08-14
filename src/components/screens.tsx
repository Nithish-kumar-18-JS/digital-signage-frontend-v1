"use client";

import { useEffect, useState, useMemo } from "react";
import { Screen, ScreenStatus } from "@/types/index";
import { motion } from "framer-motion";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import debounce from "lodash/debounce";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store/store";
import { Button } from "./ui/button";
import { GlobalDialog } from "./modals/globalDialog";
import {
    fetchScreenSlice,
    searchScreenSlice,
    updateScreenSlice,
    deleteScreenSlice,
    addScreenSlice,
} from "@/lib/store/screenSlice";
import { Clock, Cpu, Edit, Maximize2, Monitor, Repeat, Trash2 } from "lucide-react";

// Form validation schema for Screen
const formValidationSchema = z.object({
    id: z.number().nullable().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    deviceId: z.string().min(1, "Device ID is required"),
    status: z.enum(["online", "offline", "inactive"]), // adjust as per your enum
    resolution: z.string().optional(),
    orientation: z.string().optional(),
});

type FormValues = z.infer<typeof formValidationSchema>;

export default function ScreenPage() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            name: "",
            description: "",
            deviceId: "",
            status: "offline",
            resolution: "1920x1080",
            orientation: "landscape",
        },
    });

    const [backendError, setBackendError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const dispatch: AppDispatch = useDispatch();
    const screens = useSelector((state: RootState) => state.screen.items) as Screen[];

    // Fetch on mount
    useEffect(() => {
        dispatch(fetchScreenSlice());
    }, [dispatch]);

    // Debounced search
    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                dispatch(searchScreenSlice(value));
            }, 500),
        [dispatch]
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const onSubmit = async (data: FormValues) => {
        setBackendError(null);
        setLoading(true);
        try {
            if (data.id) {
                await dispatch(updateScreenSlice(data as unknown as Screen));
            } else {
                await dispatch(addScreenSlice(data as unknown as Screen));
            }
            form.reset();
            dispatch(fetchScreenSlice());
        } catch (error: any) {
            const errMsg =
                error?.response?.data?.message || "Failed to save screen";
            setBackendError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (screen: Screen) => {
        form.reset({
            id: screen.id,
            name: screen.name,
            description: screen.description || "",
            deviceId: screen.deviceId,
            status: screen.status as unknown as "online" | "offline" | "inactive",
            resolution: screen.resolution || "",
            orientation: screen.orientation as unknown as "landscape" | "portrait",
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await dispatch(deleteScreenSlice(id));
            dispatch(fetchScreenSlice());
        } catch (error: any) {
            console.error("Error deleting screen:", error?.response || error);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.trim()) {
            debouncedSearch(value);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold dark:text-white">
                Screens
            </h1>
            <div className="grid [grid-template-columns:2fr_1fr] gap-6 mt-6">
                {/* Left column */}
                <div className="w-full h-[500px] overflow-y-auto custom-background border custom-border rounded-lg shadow-lg p-4 custom-scroll">
                    <h1 className="text-xl font-semibold dark:text-white border-b pb-2">
                        Screen List
                    </h1>
                    <div className="flex items-center gap-2 mt-4">
                        <input
                            type="text"
                            placeholder="Search screens..."
                            className="block w-full rounded-md border px-3 py-2 text-sm"
                            onChange={handleSearch}
                            value={searchQuery}
                        />
                    </div>
                    {screens.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 dark:text-gray-400">
                                No screens available
                            </p>
                        </div>
                    ) : (
                        <ScreenGrid
                            screens={screens}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>

                {/* Right column */}
                <div className="w-full max-h-[500px] overflow-y-auto custom-background border custom-border rounded-lg shadow-lg custom-scroll">
                    <div className="p-4 border-b">
                        <h1 className="text-xl font-semibold dark:text-white">
                            Create / Edit Screen
                        </h1>
                    </div>
                    <div className="p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <input className="border custom-border rounded-lg h-10 p-2" {...field} placeholder="Enter screen name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <textarea {...field} placeholder="Enter description" className="border custom-border rounded-lg h-30 p-2" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="deviceId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Device ID</FormLabel>
                                            <FormControl>
                                                <input {...field} placeholder="Enter device ID" className="border custom-border rounded-lg h-10 p-2" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="online">Online</SelectItem>
                                                    <SelectItem value="offline">Offline</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="orientation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Orientation</FormLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select orientation" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="landscape">Landscape</SelectItem>
                                                    <SelectItem value="portrait">Portrait</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="resolution"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Resolution</FormLabel>
                                            <FormControl>
                                                <input {...field} placeholder="e.g. 1920x1080" className="border custom-border rounded-lg h-10 p-2" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {backendError && (
                                    <p className="text-red-500 text-sm">{backendError}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !form.formState.isValid}
                                    className="inline-flex justify-center rounded-md border border-transparent bg-[#2563eb] px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2563eb]/80 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/80"
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ScreenGrid({
    screens,
    handleEdit,
    handleDelete,
  }: {
    screens: Screen[];
    handleEdit: (screen: Screen) => void;
    handleDelete: (id: number) => void;
  }) {
    const getStatusColor = (status: string) => {
      switch (status?.toLowerCase()) {
        case "online":
          return "bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]";
        case "offline":
          return "bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]";
        default:
          return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.3)]";
      }
    };
  
    return (
      <div className="grid mt-6 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {screens.map((screen, index) => (
          <motion.div
            key={screen.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1, // staggered effect
              ease: "easeOut",
            }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/40 to-white/10 dark:from-gray-800/40 dark:to-gray-900/10 backdrop-blur-lg shadow-lg border border-white/20 dark:border-gray-700 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Monitor size={20} />
                </div>
                <h2 className="text-lg font-semibold tracking-tight truncate">
                  {screen.name}
                </h2>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  screen.status
                )}`}
              >
                {screen.status}
              </span>
            </div>
  
            {/* Info */}
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p className="flex items-center gap-1">
                <Cpu size={14} className="text-gray-500" />
                <span className="font-medium">Device ID:</span> {screen.deviceId || "—"}
              </p>
              <p className="flex items-center gap-1">
                <Maximize2 size={14} className="text-gray-500" />
                <span className="font-medium">Resolution:</span> {screen.resolution || "—"}
              </p>
              <p className="flex items-center gap-1">
                <Repeat size={14} className="text-gray-500" />
                <span className="font-medium">Orientation:</span> {screen.orientation}
              </p>
              <p className="flex items-center gap-1">
                <Clock size={14} className="text-gray-500" />
                <span className="font-medium">Last Seen:</span>{" "}
                {screen.lastSeen ? new Date(screen.lastSeen).toLocaleString() : "—"}
              </p>
            </div>
  
            {/* Actions */}
            <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-white/20 dark:border-gray-700">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleEdit(screen)}
                className="flex items-center gap-1"
              >
                <Edit size={16} />
                Edit
              </Button>
              <GlobalDialog
                children={
                  <div className="flex items-center gap-1 text-red-500">
                    <Trash2 size={16} />
                    Delete
                  </div>
                }
                title="Delete Screen"
                description="Are you sure you want to delete this screen?"
                action={() => screen.id && handleDelete(screen.id)}
                confirmText="Delete"
              />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }
  
