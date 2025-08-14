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
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'    
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
import clsx from "clsx";
import { GripVertical } from "lucide-react";
import { fetchMediaSlice } from "@/lib/store/mediaSlice";


const formValidationSchema = z.object({
    id: z.number().nullable().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    items: z.array(z.number()).optional(),
});

type FormValues = z.infer<typeof formValidationSchema>;

export default function PlaylistPage() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            name: "",
            description: "",
            items: []
        },
    });
    const [backendError, setBackendError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMediaIds, setSelectedMediaIds] = useState<number[]>(form?.getValues()?.items?.map((item) => Number(item)) ?? [])
    const sensors = useSensors(
        useSensor(PointerSensor)
    )
    const [isSubmitting, setIsSubmitting] = useState(false)
    const dispatch: AppDispatch = useDispatch();
    const playlist = useSelector((state: RootState) => state.playlist.items);
    const mediaList = useSelector((state: RootState) => state.media.items);
    // Fetch on mount
    useEffect(() => {
        dispatch(fetchPlaylistSlice());
        dispatch(fetchMediaSlice());
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
        setIsSubmitting(true)
        data.items = selectedMediaIds;
        console.log("data :",data)
        try {
            if (data.id) {
                await dispatch(updatePlaylistSlice(data as unknown as Playlist));
            } else {
                await dispatch(addPlaylistSlice(data as unknown as Playlist));
            }
            form.reset();
            dispatch(fetchPlaylistSlice());
        } catch (error: any) {
            const errMsg = error?.response?.data?.message || "Failed to upload playlist";
            setBackendError(errMsg);
        } finally {
            setLoading(false);
            setIsSubmitting(false)
        }
    };

    const handleEdit = (playlist: Playlist) => {
        const { id, ...rest } = playlist;
        form.reset({
            id, // keep id explicitly
            ...rest,
            items: rest.items?.map((item) => item.id),
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

    const handleDragEnd = (event: any) => {
        const { active, over } = event
        if (active.id !== over?.id) {
          const oldIndex = selectedMediaIds.indexOf(active.id)
          const newIndex = selectedMediaIds.indexOf(over.id)
          setSelectedMediaIds(arrayMove(selectedMediaIds, oldIndex, newIndex))
        }
      }
    
      const toggleMedia = (id: number) => {
        setSelectedMediaIds((prev) =>
          prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        )
      }

    console.log(loading , !form.formState.isValid)

    return (
        <div>
            <h1 className="text-2xl font-semibold dark:text-white">Playlists Library</h1>
            <div className="grid [grid-template-columns:2fr_1fr] gap-6 mt-6">
                {/* Left column */}
                <div className="w-full h-[600px] max-h-[600px] overflow-y-auto custom-background border custom-border rounded-lg shadow-lg p-4 custom-scroll">
                    <h1 className="text-xl font-semibold dark:text-white border-b border-[#dcdcdc] dark:border-gray-600 pb-2">
                        Playlists
                    </h1>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search playlist..."
                                className="block w-full rounded-md border custom-border fields-background fields-background px-3 py-2 text-sm"
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
                <div className="w-full max-h-[600px] custom-scroll overflow-y-auto custom-background border custom-border rounded-lg shadow-lg ">
                    <div className="p-4 border-b border-[#dcdcdc] dark:border-gray-600">
                        <h1 className="text-xl font-semibold dark:text-white">Playlist Form</h1>
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
                                                    placeholder="Enter playlist name"
                                                    {...field}
                                                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 fields-background px-3 py-2 text-sm"
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
                                                    placeholder="Enter playlist description"
                                                    {...field}
                                                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 fields-background px-3 py-2 text-sm"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid gap-2">
                                    <Label>Select Media *</Label>
                                    <Command>
                                        <CommandInput placeholder="Search media..." />
                                        <CommandEmpty>No media found.</CommandEmpty>
                                        <CommandGroup>
                                            <ScrollArea className="h-40 rounded-md border p-1">
                                                {mediaList?.map((media:Media) => (
                                                    <CommandItem
                                                        key={media.id}
                                                        onSelect={() => toggleMedia(media.id)}
                                                        className={clsx(
                                                            'cursor-pointer px-2 py-2 rounded-md flex items-center gap-3 mt-3',
                                                            selectedMediaIds.includes(media.id)
                                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                                                                : ''
                                                        )}
                                                    >
                                                        {media.url && (media.type === 'VIDEO' || media.type === 'IMAGE') ? (
                                                            <img
                                                                src={media.url}
                                                                alt={media.name}
                                                                className="w-10 h-10 object-cover rounded-md border"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 text-gray-500 text-xs uppercase">
                                                                {media.type.charAt(0)}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col text-left">
                                                            <span className="font-medium truncate">{media.name}</span>
                                                            <span className="text-xs text-muted-foreground capitalize">{media.type}</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </ScrollArea>
                                        </CommandGroup>
                                    </Command>
                                </div>

                                {selectedMediaIds.length > 0 && (
                                    <div className="grid gap-2">
                                        <Label>Reorder Selected Media</Label>
                                        <ScrollArea className="h-40 border rounded-md p-2 bg-muted">
                                            <DndContext
                                                sensors={sensors}
                                                collisionDetection={closestCenter}
                                                onDragEnd={handleDragEnd}
                                            >
                                                <SortableContext
                                                    items={selectedMediaIds}
                                                    strategy={verticalListSortingStrategy}
                                                >
                                                    <div className="flex flex-col gap-2">
                                                        {selectedMediaIds.map((id) => {
                                                            const media = mediaList?.find((m:Media) => m.id === id)
                                                            return media ? (
                                                                <SortableItem key={id} media={media} />
                                                            ) : null
                                                        })}
                                                    </div>
                                                </SortableContext>
                                            </DndContext>
                                        </ScrollArea>
                                    </div>
                                )}

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

function SortableItem({ media }: { media: Media }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id: media.id,
    })
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }
  
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="p-2 rounded-md border flex items-center gap-3"
      >
        <div {...listeners} className="cursor-grab text-gray-400">
          <GripVertical size={18} />
        </div>
        <div className="flex-1 truncate text-sm">
          <div className='flex items-center gap-2'>
          <span className="font-medium">{media.name}</span>{' '}
          <img src={media.url} alt={media.name} className="w-10 h-10 object-cover rounded-md border" /> 
          </div>
          <span className="text-xs text-muted-foreground capitalize">({media.type})</span>
        </div>
      </div>
    )
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
        <div className="rounded-md mt-6 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">S.No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {playlist.length > 0 ? (
                        playlist.map((item,index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
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