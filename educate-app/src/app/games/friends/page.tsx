'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Navbar } from '@/components/layout/Navbar';
import { getLevelTitle } from '@/lib/xp-client';

interface Friend {
  userId: string;
  displayName: string;
  xp: number;
  level: number;
}

interface PendingRequest {
  friendshipId: string;
  userId: string;
  displayName: string;
}

export default function FriendsPage() {
  const { isSignedIn } = useUser();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incoming, setIncoming] = useState<PendingRequest[]>([]);
  const [outgoing, setOutgoing] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [addInput, setAddInput] = useState('');
  const [addStatus, setAddStatus] = useState<{ msg: string; ok: boolean } | null>(null);
  const [addLoading, setAddLoading] = useState(false);

  const fetchFriends = () => {
    setLoading(true);
    fetch('/api/friends')
      .then(r => r.json())
      .then(data => {
        setFriends(data.friends ?? []);
        setIncoming(data.incoming ?? []);
        setOutgoing(data.outgoing ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isSignedIn) fetchFriends();
    else setLoading(false);
  }, [isSignedIn]);

  const addFriend = async () => {
    if (!addInput.trim()) return;
    setAddLoading(true);
    setAddStatus(null);
    try {
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendCode: addInput.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setAddStatus({ msg: data.message || 'Request sent!', ok: true });
        setAddInput('');
        fetchFriends();
      } else {
        setAddStatus({ msg: data.error || 'Failed', ok: false });
      }
    } catch {
      setAddStatus({ msg: 'Network error', ok: false });
    }
    setAddLoading(false);
  };

  const handleRequest = async (friendshipId: string, action: 'accept' | 'decline') => {
    await fetch('/api/friends', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendshipId, action }),
    });
    fetchFriends();
  };

  const removeFriend = async (friendUserId: string) => {
    await fetch('/api/friends', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendUserId }),
    });
    fetchFriends();
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-2xl mx-auto p-6 text-center mt-20">
          <p className="text-neutral-400 mb-4">Sign in to add friends and compete together.</p>
          <Link href="/login" className="text-indigo-400 underline">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link href="/games" className="text-neutral-500 text-sm hover:text-neutral-300 no-underline">&#8592; Game Zone</Link>

        <div className="text-center mt-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">{'\u{1F465}'} Friends</h1>
        </div>

        {/* Add Friend */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold text-white mb-3">Add a Friend</h3>
          <p className="text-xs text-neutral-500 mb-3">Enter their email address to send a friend request.</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={addInput}
              onChange={e => setAddInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addFriend()}
              placeholder="friend@school.co.uk"
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              onClick={addFriend}
              disabled={addLoading || !addInput.trim()}
              className="bg-indigo-500 text-white border-none rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-400 transition-colors"
            >
              {addLoading ? '...' : 'Add'}
            </button>
          </div>
          {addStatus && (
            <p className={`text-xs mt-2 ${addStatus.ok ? 'text-emerald-400' : 'text-red-400'}`}>{addStatus.msg}</p>
          )}
        </div>

        {/* Incoming Requests */}
        {incoming.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-amber-400 mb-3">Pending Requests ({incoming.length})</h3>
            <div className="flex flex-col gap-2">
              {incoming.map(req => (
                <div key={req.friendshipId} className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0">
                    {req.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="flex-1 text-sm text-white font-medium truncate">{req.displayName}</span>
                  <button
                    onClick={() => handleRequest(req.friendshipId, 'accept')}
                    className="bg-emerald-500 text-white border-none rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-emerald-400"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequest(req.friendshipId, 'decline')}
                    className="bg-neutral-700 text-neutral-300 border-none rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-neutral-600"
                  >
                    Decline
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Outgoing Requests */}
        {outgoing.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-neutral-400 mb-3">Sent Requests ({outgoing.length})</h3>
            <div className="flex flex-col gap-2">
              {outgoing.map(req => (
                <div key={req.friendshipId} className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {req.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="flex-1 text-sm text-white truncate">{req.displayName}</span>
                  <span className="text-xs text-neutral-500">Pending</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends List */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3">
            Your Friends {friends.length > 0 && `(${friends.length})`}
          </h3>
          {loading ? (
            <div className="text-center py-10">
              <div className="w-8 h-8 border-2 border-neutral-600 border-t-indigo-500 rounded-full animate-spin mx-auto" />
            </div>
          ) : friends.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
              <p className="text-neutral-500 text-sm">No friends yet. Add someone above to get started!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {friends.map(f => (
                <div key={f.userId} className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl p-3 sm:p-4">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0">
                    {f.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white m-0 truncate">{f.displayName}</p>
                    <p className="text-xs text-neutral-500 m-0">Lv.{f.level} {getLevelTitle(f.level)} · {f.xp.toLocaleString()} XP</p>
                  </div>
                  <button
                    onClick={() => removeFriend(f.userId)}
                    className="text-xs text-neutral-500 bg-transparent border border-neutral-700 rounded-lg px-2.5 py-1 cursor-pointer hover:text-red-400 hover:border-red-400/50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
