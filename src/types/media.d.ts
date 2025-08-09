// model Media {
//     id              Int            @id @default(autoincrement())
//     name            String
//     type            MediaType
//     url             String
//     durationSeconds Int            @default(10)
//     uploadedById    Int
//     createdAt       DateTime       @default(now())
//     updatedAt       DateTime       @updatedAt
//     uploadedBy      User           @relation(fields: [uploadedById], references: [id])
//     playlistItems   PlaylistItem[]
//   }
export interface MediaData {
    id?: number;
    name: string;
    description?: string;
    type?: string;
    url: string;
    durationSeconds?: number;
    uploadedById?: number;
    createdAt?: string;
    updatedAt?: string;
    uploadedBy?: number;
    playlistItems?: number[];
}