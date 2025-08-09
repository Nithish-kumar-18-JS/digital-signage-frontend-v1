'use client';

import Dashboard from '@/components/dashboard';
import Media from '@/components/media';
import Playlist from '@/components/playlist';
import Screens from '@/components/screens';
import Schedule from '@/components/schedule';
import Users from '@/components/users';
import { useParams } from 'next/navigation';

const COMPONENT_MAP = {
  dashboard: Dashboard,
  media: Media,
  playlists: Playlist,
  screens: Screens,
  schedule: Schedule,
  users: Users
};

export default function Page() {
  const { type } = useParams();
  const Component = COMPONENT_MAP[type] || Dashboard;

  return (
    <div className="w-full mt-[6%] pl-[3%] pr-[3%]">
      <Component />
    </div>
  );
}
