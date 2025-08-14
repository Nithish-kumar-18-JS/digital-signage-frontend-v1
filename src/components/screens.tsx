"use client";

import { useEffect, useState, useMemo } from "react";
import { Screen, ScreenStatus } from "@/types/index";
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
import { Edit, Monitor, Trash2 } from "lucide-react";

// Form validation schema for Screen
const formValidationSchema = z.object({
    id: z.number().nullable().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    deviceId: z.string().min(1, "Device ID is required"),
    status: z.enum(["online", "offline", "inactive"]), // adjust as per your enum
    resolution: z.string().optional(),
    orientation: z.enum(["landscape", "portrait"]), // adjust as per your type
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
            resolution: "",
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
                <div className="w-full h-[500px] overflow-y-auto bg-[#f5f5f5] dark:bg-[#3a3a3a] rounded-lg shadow-lg p-4">
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
                <div className="w-full max-h-[500px] overflow-y-auto bg-[#f5f5f5] dark:bg-[#3a3a3a] rounded-lg shadow-lg">
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
                                                <input {...field} placeholder="Enter screen name" className="input" />
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
                                                <textarea {...field} placeholder="Enter description" className="input" />
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
                                                <input {...field} placeholder="Enter device ID" className="input" />
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
                                                <input {...field} placeholder="e.g. 1920x1080" className="input" />
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
                                    className="btn-primary"
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
          return "bg-green-500/20 text-green-600";
        case "offline":
          return "bg-red-500/20 text-red-600";
        default:
          return "bg-yellow-500/20 text-yellow-600";
      }
    };
  
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {screens.map((screen) => (
          <div
            key={screen.id}
            className="group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-lg border border-gray-200 dark:border-gray-700 p-5 transition-transform hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Monitor size={20} />
                </div>
                <h2 className="text-lg font-semibold truncate">{screen.name}</h2>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  screen.status
                )}`}
              >
                {screen.status}
              </span>
            </div>
  
            {/* Info */}
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-medium">Device ID:</span>{" "}
                {screen.deviceId || "—"}
              </p>
              <p>
                <span className="font-medium">Resolution:</span>{" "}
                {screen.resolution || "—"}
              </p>
              <p>
                <span className="font-medium">Orientation:</span>{" "}
                {screen.orientation}
              </p>
              <p>
                <span className="font-medium">Last Seen:</span>{" "}
                {screen.lastSeen
                  ? new Date(screen.lastSeen).toLocaleString()
                  : "—"}
              </p>
            </div>
  
            {/* Actions */}
            <div className="flex justify-end gap-2 mt-5 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  <div className="flex items-center gap-1">
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
          </div>
        ))}
      </div>
    );
  }
  
