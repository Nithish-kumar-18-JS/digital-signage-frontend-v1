'use client';

import { useEffect, useState, useMemo } from "react";
import { Schedule } from "@/types/index";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import debounce from 'lodash/debounce';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux"; 
import type { RootState, AppDispatch } from "@/lib/store/store";
import { Button } from "./ui/button";
import { GlobalDialog } from "./modals/globalDialog";
import { fetchScheduleSlice, searchScheduleSlice, updateScheduleSlice, deleteScheduleSlice, addScheduleSlice } from "@/lib/store/scheduleSlice";

const formValidationSchema = z.object({
    id: z.number().nullable().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    daysOfWeek: z.string().optional(),
    repeatDaily: z.boolean().optional(),
    priority: z.number().optional(),
    playlistId: z.number().optional(),
    screenId: z.number().optional(),
});

type FormValues = z.infer<typeof formValidationSchema>;

export default function MediaPage() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            name: "",
            description: "",
            startTime: "",
            endTime: "",
            daysOfWeek: "",
            repeatDaily: false,
            priority: 0,
            playlistId: 0,
            screenId: 0,
        },
    });

    const [backendError, setBackendError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const dispatch: AppDispatch = useDispatch();
    const schedule = useSelector((state: RootState) => state.schedule.items);

    // Fetch on mount
    useEffect(() => {
        dispatch(fetchScheduleSlice());
    }, [dispatch]);

    // Debounced search
    const debouncedSearch = useMemo(
        () => debounce((value: string) => {
            dispatch(searchScheduleSlice(value));
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
            const scheduleData: Partial<Schedule> = {
                ...data,
                id: data.id ?? undefined,
                startTime: data.startTime ? new Date(data.startTime) : undefined,
                endTime: data.endTime ? new Date(data.endTime) : undefined,
                daysOfWeek: data.daysOfWeek || undefined,
            };

            if (data.id) {
                await dispatch(updateScheduleSlice(scheduleData as Schedule));
            } else {
                await dispatch(addScheduleSlice(scheduleData as Schedule));
            }
            form.reset();
            dispatch(fetchScheduleSlice());
        } catch (error: any) {
            const errMsg = error?.response?.data?.message || "Failed to upload media";
            setBackendError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (schedule: Schedule) => {
        const { id, startTime, endTime, daysOfWeek, ...rest } = schedule;
        form.reset({
            id,
            startTime: startTime ? new Date(startTime).toISOString().slice(0, 16) : "",
            endTime: endTime ? new Date(endTime).toISOString().slice(0, 16) : "",
            daysOfWeek: daysOfWeek || "",
            ...rest,
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await dispatch(deleteScheduleSlice(id));
            dispatch(fetchScheduleSlice());
        } catch (error: any) {
            console.error("Error deleting media:", error?.response || error);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        debouncedSearch(e.target.value);
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold dark:text-white">Media Library</h1>
            <div className="grid [grid-template-columns:2fr_1fr] gap-6 mt-6">
                {/* Left column */}
                <div className="w-full h-[500px] max-h-[500px] overflow-y-auto bg-[#f5f5f5] dark:bg-[#3a3a3a] rounded-lg shadow-lg p-4">
                    <h1 className="text-xl font-semibold dark:text-white border-b border-[#dcdcdc] dark:border-gray-600 pb-2">
                        Media
                    </h1>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search media..."
                                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] px-3 py-2 text-sm"
                                onChange={handleSearch}
                                value={searchQuery}
                            />
                        </div>
                    </div>
                    {schedule.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 dark:text-gray-400">
                                No schedule available
                            </p>
                        </div>
                    ) : (
                        <ScheduleTable
                            schedule={schedule}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>

                {/* Right column */}
                <div className="w-full max-h-[500px] overflow-y-auto bg-[#f5f5f5] dark:bg-[#3a3a3a] rounded-lg shadow-lg">
                    <div className="p-4 border-b border-[#dcdcdc] dark:border-gray-600">
                        <h1 className="text-xl font-semibold dark:text-white">Upload Media</h1>
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
                                                <input
                                                    type="text"
                                                    placeholder="Enter media name"
                                                    {...field}
                                                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] px-3 py-2 text-sm"
                                                />
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
                                                <textarea
                                                    placeholder="Enter media description"
                                                    {...field}
                                                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] px-3 py-2 text-sm"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="screenId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Screen</FormLabel>
                                            <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                                                <FormControl>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Screen" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {/* Dynamically map your screens here */}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="startTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Time</FormLabel>
                                            <FormControl>
                                                <input
                                                    type="datetime-local"
                                                    {...field}
                                                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] px-3 py-2 text-sm"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Time</FormLabel>
                                            <FormControl>
                                                <input
                                                    type="datetime-local"
                                                    {...field}
                                                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] px-3 py-2 text-sm"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="daysOfWeek"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Days of Week</FormLabel>
                                            <FormControl>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Monday,Wednesday,Friday"
                                                    {...field}
                                                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] px-3 py-2 text-sm"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="repeatDaily"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Repeat Daily</FormLabel>
                                            <FormControl>
                                                <input
                                                    type="checkbox"
                                                    checked={field.value || false}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="priority"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Priority</FormLabel>
                                            <FormControl>
                                                <input
                                                    type="number"
                                                    {...field}
                                                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] px-3 py-2 text-sm"
                                                />
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
                                    {loading ? "Uploading..." : "Upload"}
                                </button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ScheduleTable({
    schedule,
    handleEdit,
    handleDelete,
}: {
    schedule: Schedule[];
    handleEdit: (schedule: Schedule) => void;
    handleDelete: (id: number) => void;
}) {
    return (
        <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">S.No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Screen</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Repeat Daily</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Days of Week</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {schedule.length > 0 ? (
                        schedule.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.description || "—"}</TableCell>
                                <TableCell>{item.screen?.name || "—"}</TableCell>
                                <TableCell>{item.priority ?? "—"}</TableCell>
                                <TableCell>{item.repeatDaily ? "Yes" : "No"}</TableCell>
                                <TableCell>
                                    {item.startTime ? new Date(item.startTime).toLocaleString() : "—"}
                                </TableCell>
                                <TableCell>
                                    {item.endTime ? new Date(item.endTime).toLocaleString() : "—"}
                                </TableCell>
                                <TableCell>{item.daysOfWeek || "—"}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </Button>
                                        <GlobalDialog
                                            children="Delete"
                                            title="Delete Media"
                                            description="Delete media details"
                                            action={() => item.id && handleDelete(item.id)}
                                            confirmText="Delete"
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center py-6 text-gray-500">
                                No media available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
