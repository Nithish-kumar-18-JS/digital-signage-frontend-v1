'use client';

import { useEffect, useState, useMemo } from "react";
import { Media } from "@/types/index";
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
import { addMediaSlice, deleteMediaSlice, fetchMediaSlice, searchMediaSlice, updateMediaSlice } from "@/lib/store/mediaSlice";
import { uploadMedia } from "@/api/media/media";
import type { RootState, AppDispatch } from "@/lib/store/store";
import { Button } from "./ui/button";
import { GlobalDialog } from "./modals/globalDialog";
import { formatDate } from "@/lib/utils";

const MediaType = z.enum(["IMAGE", "VIDEO", "AUDIO", "HTML"]);

const formValidationSchema = z.object({
    id: z.number().nullable().optional(),
    name: z.string().min(1, "Name is required"),
    type: MediaType.optional(),
    description: z.string().optional(),
    url: z.string().url("Invalid URL").optional(),
});

type FormValues = z.infer<typeof formValidationSchema>;

export default function MediaPage() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            name: "",
            type: "IMAGE",
            description: "",
            url: "",
        },
    });

    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [backendError, setBackendError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const dispatch: AppDispatch = useDispatch();
    const media = useSelector((state: RootState) => state.media.items);

    // Fetch on mount
    useEffect(() => {
        dispatch(fetchMediaSlice());
    }, [dispatch]);

    // Debounced search
    const debouncedSearch = useMemo(
        () => debounce((value: string) => {
            dispatch(searchMediaSlice(value));
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file) {
                const result = await uploadMedia(file);
                setPreviewUrl(result.url);
                form.setValue("url", result.url, { shouldValidate: true });
            }
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const file = e.target.files[0];
            if (file) {
                const result = await uploadMedia(file);
                setPreviewUrl(result.url);
                form.setValue("url", result.url, { shouldValidate: true });
            }
        }
    };

    const onSubmit = async (data: FormValues) => {
        setBackendError(null);
        setLoading(true);
        try {
            if (!previewUrl) {
                delete (data as any).url;
            }
            if(data.id){
                await dispatch(updateMediaSlice(data as Media));
            }else{
                await dispatch(addMediaSlice(data as Media));
            }
            setPreviewUrl(null);
            form.reset();
            dispatch(fetchMediaSlice());
        } catch (error: any) {
            const errMsg = error?.response?.data?.message || "Failed to upload media";
            setBackendError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (media: Media) => {
        setPreviewUrl(media.url || null);
        const { id, ...rest } = media;
        form.reset({
          id, // keep id explicitly
          ...rest,
          type: media.type as "IMAGE" | "VIDEO" | "AUDIO" | "HTML" | undefined
        });
      };

    const handleDelete = async (id: number) => {
        try {
            await dispatch(deleteMediaSlice(id));
            dispatch(fetchMediaSlice());
        } catch (error: any) {
            console.error("Error deleting media:", error?.response || error);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        debouncedSearch(e.target.value);
    };

    <MediaTable
        media={media}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
    />

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
                    {media.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 dark:text-gray-400">
                                No media available
                            </p>
                        </div>
                    ) : (
                        <MediaTable
                            media={media}
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
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {["IMAGE", "VIDEO", "AUDIO", "HTML"].map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${isDragging
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                        : "border-gray-300 dark:border-gray-600"
                                        }`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() =>
                                        document.getElementById("fileInput")?.click()
                                    }
                                >
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-h-40 mx-auto"
                                        />
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Drag & drop a file here or click to select
                                        </p>
                                    )}
                                    <input
                                        id="fileInput"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                </div>

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

export function MediaTable({
    media,
    handleEdit,
    handleDelete,
}: {
    media: Media[];
    handleEdit: (media: Media) => void;
    handleDelete: (id: number) => void;
}) {
    return (
        <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">S.No</TableHead>
                        <TableHead className="w-[80px]">Preview</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {media.length > 0 ? (
                        media.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    {item.url ? (
                                        <img
                                            src={item.url}
                                            alt={item.name}
                                            className="h-12 w-12 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-600 rounded" />
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.type}</TableCell>
                                <TableCell className="truncate max-w-xs">
                                    {item.description}
                                </TableCell>
                                <TableCell>{formatDate(item.createdAt)}</TableCell>
                                <TableCell>{formatDate(item.updatedAt)}</TableCell>
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
                            <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                                No media available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}