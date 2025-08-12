'use client';

import { useEffect, useState, useMemo } from "react";
import { Media, Playlist } from "@/types/index";
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
import { addPlaylistSlice, deletePlaylistSlice, fetchPlaylistSlice, searchPlaylistSlice, updatePlaylistSlice } from "@/lib/store/playlistSlice";
import type { RootState, AppDispatch } from "@/lib/store/store";
import { Button } from "./ui/button";
import { GlobalDialog } from "./modals/globalDialog";

const MediaType = z.enum(["IMAGE", "VIDEO", "AUDIO", "HTML"]);

const formValidationSchema = z.object({
    id: z.number().nullable().optional(),
    name: z.string().min(1, "Name is required"),
    type: MediaType.optional(),
    description: z.string().optional(),
    url: z.string().url("Invalid URL").optional(),
});

type FormValues = z.infer<typeof formValidationSchema>;

export default function PlaylistPage() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            name: "",
            type: "IMAGE",
            description: "",
            url: "",
        },
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [backendError, setBackendError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const dispatch: AppDispatch = useDispatch();
    const playlist = useSelector((state: RootState) => state.playlist.items);

    // Fetch on mount
    useEffect(() => {
        dispatch(fetchPlaylistSlice());
    }, [dispatch]);

    // Debounced search
    const debouncedSearch = useMemo(
        () => debounce((value: string) => {
            dispatch(searchPlaylistSlice(value));
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
            if (!previewUrl) {
                delete (data as any).url;
            }
            if(data.id){
                await dispatch(updatePlaylistSlice(data as Playlist));
            }else{
                await dispatch(addPlaylistSlice(data as Playlist));
            }
            setPreviewUrl(null);
            form.reset();
            dispatch(fetchPlaylistSlice());
        } catch (error: any) {
            const errMsg = error?.response?.data?.message || "Failed to upload media";
            setBackendError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (playlist: Playlist) => {
        const { id, ...rest } = playlist;
        form.reset({
          id, // keep id explicitly
          ...rest,
        });
      };

    const handleDelete = async (id: number) => {
        try {
            await dispatch(deletePlaylistSlice(id));
            dispatch(fetchPlaylistSlice());
        } catch (error: any) {
            console.error("Error deleting playlist:", error?.response || error);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        debouncedSearch(e.target.value);
    };

    <PlaylistTable
        playlist={playlist}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
    />

    return (
        <div>
            <h1 className="text-2xl font-semibold dark:text-white">Playlists</h1>
            <div className="grid [grid-template-columns:2fr_1fr] gap-6 mt-6">
                {/* Left column */}
                <div className="w-full h-[500px] max-h-[500px] overflow-y-auto bg-[#f5f5f5] dark:bg-[#3a3a3a] rounded-lg shadow-lg p-4">
                    <h1 className="text-xl font-semibold dark:text-white border-b border-[#dcdcdc] dark:border-gray-600 pb-2">
                        Playlists
                    </h1>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search playlist..."
                                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] px-3 py-2 text-sm"
                                onChange={handleSearch}
                                value={searchQuery}
                            />
                        </div>
                    </div>
                    {playlist.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 dark:text-gray-400">
                                No playlist available
                            </p>
                        </div>
                    ) : (
                        <PlaylistTable
                            playlist={playlist}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>

                {/* Right column */}
                <div className="w-full max-h-[500px] overflow-y-auto bg-[#f5f5f5] dark:bg-[#3a3a3a] rounded-lg shadow-lg">
                    <div className="p-4 border-b border-[#dcdcdc] dark:border-gray-600">
                        <h1 className="text-xl font-semibold dark:text-white">Add Playlist</h1>
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

                                {backendError && (
                                    <p className="text-red-500 text-sm">{backendError}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !form.formState.isValid}
                                    className="inline-flex justify-center rounded-md border border-transparent bg-[#2563eb] px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2563eb]/80 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/80"
                                >
                                    {loading ? "Adding..." : "Add"}
                                </button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function PlaylistTable({
    playlist,
    handleEdit,
    handleDelete,
}: {
    playlist: Playlist[];
    handleEdit: (playlist: Playlist) => void;
    handleDelete: (id: number) => void;
}) {
    return (
        <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {playlist.length > 0 ? (
                        playlist.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="truncate max-w-xs">
                                    {item.description}
                                </TableCell>
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
                                            title="Delete Playlist"
                                            description="Delete playlist details"
                                            action={() => item.id && handleDelete(item.id)}
                                            confirmText="Delete"
                                        />
                                    </div>
                                </TableCell>

                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                                No playlist available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}