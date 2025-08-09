'use client';

import { useEffect, useState } from "react";
import { MediaData } from "@/types/media";
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
import { addMedia, getAllMedia, uploadMedia } from "@/api/media/media";
import { z } from "zod";

const MediaType = z.enum(["IMAGE", "VIDEO", "AUDIO", "HTML"]);

const formValidationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: MediaType,
    description: z.string().optional(),
    url: z.string().url("Invalid URL").optional(),
});

type FormValues = z.infer<typeof formValidationSchema>;

export default function Media() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            name: "",
            type: "IMAGE",
            description: "",
            url: "",
        },
    });

    const [mediaData, setMediaData] = useState<MediaData[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [backendError, setBackendError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchMedia = async () => {
        try {
            const result = await getAllMedia();
            setMediaData(result);
        } catch (error: any) {
            console.error("Error getting media:", error?.response || error);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

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
            // Remove empty url if no file uploaded
            if (!previewUrl) {
                delete data.url;
            }

            console.log("Submitting data:", data);

            await addMedia(data as MediaData);
            setPreviewUrl(null);
            form.reset();
            fetchMedia();
        } catch (error: any) {
            const errMsg = error?.response?.data?.message || "Failed to upload media";
            setBackendError(errMsg);
            console.error("Error uploading media:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (media: MediaData) => {
        // form.reset(media);
        setPreviewUrl(media.url);
    };

    const handleDelete = async (id: string) => {
        try {
            // await deleteMedia(id);
            fetchMedia();
        } catch (error: any) {
            console.error("Error deleting media:", error?.response || error);
        }
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
                    {mediaData.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 dark:text-gray-400">
                                No media available
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {mediaData.map((media) => (
                                <div
                                    key={media.id}
                                    className="flex flex-col bg-white dark:bg-[#2a2a2a] rounded-lg shadow hover:shadow-lg transition-shadow p-4"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden mb-3">
                                        <img
                                            src={media.url}
                                            alt={media.name}
                                            className="object-contain max-h-full"
                                        />
                                    </div>

                                    {/* Name & Type */}
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            {media.name}
                                        </h3>
                                        <span
                                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${media.type === "IMAGE"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                    : media.type === "VIDEO"
                                                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                        : media.type === "AUDIO"
                                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                            : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                                }`}
                                        >
                                            {media.type}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    {media.description && (
                                        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {media.description}
                                        </p>
                                    )}

                                    {/* Action buttons */}
                                    <div className="mt-auto flex justify-between gap-2 pt-3">
                                        <button
                                            // onClick={() => handleEdit(media)}
                                            className="w-1/2 px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            // onClick={() => handleDelete(media.id)}
                                            className="w-1/2 px-3 py-1 text-xs font-medium bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

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
                                {/* Name */}
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

                                {/* Description */}
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

                                {/* Type */}
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

                                {/* Drag & Drop Upload */}
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

                                {/* Backend Error */}
                                {backendError && (
                                    <p className="text-red-500 text-sm">{backendError}</p>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
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
