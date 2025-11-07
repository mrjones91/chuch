import { nip19 } from 'nostr-tools';
import { Link, useParams } from 'react-router-dom';
import { useAuthor } from '@/hooks/useAuthor';
import { useNostr } from '@/hooks/useNostr';
import { useQuery } from '@tanstack/react-query';
import { NoteContent } from '@/components/NoteContent';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { genUserName } from '@/lib/genUserName';
import NotFound from './NotFound';

export function NIP19Page() {
  const { nip19: identifier } = useParams<{ nip19: string }>();

  if (!identifier) {
    return <NotFound />;
  }

  let decoded;
  try {
    decoded = nip19.decode(identifier);
  } catch {
    return <NotFound />;
  }

  const { type } = decoded;

  switch (type) {
    case 'npub':
    case 'nprofile': {
      const pubkey = type === 'npub' ? decoded.data : decoded.data.pubkey;
      return <ProfileView pubkey={pubkey} />;
    }

    case 'note': {
      return <EventView id={decoded.data} />;
    }

    case 'nevent': {
      return <EventView id={decoded.data.id} />;
    }

    case 'naddr': {
      const { kind, pubkey, identifier: d } = decoded.data;
      return <AddressableEventView kind={kind} pubkey={pubkey} identifier={d} />;
    }

    default:
      return <NotFound />;
  }
}

function ProfileView({ pubkey }: { pubkey: string }) {
  const author = useAuthor(pubkey);
  const metadata = author.data?.metadata;
  const displayName = metadata?.name ?? genUserName(pubkey);

  if (author.isLoading) {
    return <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-3 w-16 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </CardHeader>
    </Card>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={metadata?.picture} alt={displayName} />
            <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{displayName}</h2>
              {metadata?.nip05 && (
                <Badge variant="secondary" className="text-xs">
                  ✓ {metadata.nip05}
                </Badge>
              )}
            </div>
            {metadata?.about && (
              <p className="text-sm text-muted-foreground">{metadata.about}</p>
            )}
          </div>
        </div>
      </CardHeader>
      {metadata?.banner && (
        <CardContent>
          <div className="aspect-[3/1] w-full overflow-hidden rounded-lg">
            <img 
              src={metadata.banner} 
              alt="Profile banner" 
              className="h-full w-full object-cover"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function EventView({ id }: { id: string }) {
  const { nostr } = useNostr();
  
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async ({ signal }) => {
      const events = await nostr.query([{ ids: [id] }], { signal });
      return events[0];
    },
  });

  const author = useAuthor(event?.pubkey ?? '');
  const metadata = author.data?.metadata;
  const displayName = metadata?.name ?? (event ? genUserName(event.pubkey) : '');

  if (isLoading) {
    return <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-3 w-16 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-4/5 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>;
  }

  if (!event) {
    return <NotFound />;
  }

  const npub = nip19.npubEncode(event.pubkey);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Link to={`/${npub}`} className="hover:opacity-80 transition-opacity">
            <Avatar className="h-10 w-10">
              <AvatarImage src={metadata?.picture} alt={displayName} />
              <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link to={`/${npub}`} className="hover:underline inline-block">
              <h2 className="font-semibold">{displayName}</h2>
            </Link>
            <time className="text-sm text-muted-foreground block">
              {new Date(event.created_at * 1000).toLocaleString()}
            </time>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap break-words">
          <NoteContent event={event} />
        </div>
      </CardContent>
    </Card>
  );
}

function AddressableEventView({ 
  kind, 
  pubkey, 
  identifier 
}: { 
  kind: number;
  pubkey: string;
  identifier: string;
}) {
  const { nostr } = useNostr();
  
  const { data: event, isLoading } = useQuery({
    queryKey: ['addressable-event', kind, pubkey, identifier],
    queryFn: async ({ signal }) => {
      const events = await nostr.query([{
        kinds: [kind],
        authors: [pubkey],
        '#d': [identifier],
      }], { signal });
      return events[0];
    },
  });

  const author = useAuthor(event?.pubkey ?? '');
  const metadata = author.data?.metadata;
  const displayName = metadata?.name ?? (event ? genUserName(event.pubkey) : '');

  if (isLoading) {
    return <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-3 w-16 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-4/5 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>;
  }

  if (!event) {
    return <NotFound />;
  }

  const npub = nip19.npubEncode(event.pubkey);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Link to={`/${npub}`} className="hover:opacity-80 transition-opacity">
            <Avatar className="h-10 w-10">
              <AvatarImage src={metadata?.picture} alt={displayName} />
              <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link to={`/${npub}`} className="hover:underline inline-block">
              <h2 className="font-semibold">{displayName}</h2>
            </Link>
            <time className="text-sm text-muted-foreground block">
              {new Date(event.created_at * 1000).toLocaleString()}
            </time>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap break-words">
          <NoteContent event={event} />
        </div>
      </CardContent>
    </Card>
  );
}