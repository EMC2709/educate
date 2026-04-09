'use client';

import { useEffect, useState } from 'react';

interface Organisation {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  country: string;
  created_at: string;
}

type Toast = { type: 'success' | 'error'; message: string } | null;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminPage() {
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [toast, setToast] = useState<Toast>(null);

  // Create org form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [orgCountry, setOrgCountry] = useState('England');
  const [creatingOrg, setCreatingOrg] = useState(false);

  // Role assignment form
  const [targetUserId, setTargetUserId] = useState('');
  const [newRole, setNewRole] = useState('student');
  const [assignOrgId, setAssignOrgId] = useState('');
  const [assigningRole, setAssigningRole] = useState(false);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function loadOrgs() {
    setLoadingOrgs(true);
    try {
      const res = await fetch('/api/organisations');
      const data = await res.json() as { organisations?: Organisation[] };
      setOrgs(data.organisations ?? []);
    } catch {
      showToast('error', 'Failed to load organisations');
    } finally {
      setLoadingOrgs(false);
    }
  }

  useEffect(() => {
    loadOrgs();
  }, []);

  function handleOrgNameChange(value: string) {
    setOrgName(value);
    setOrgSlug(slugify(value));
  }

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault();
    if (!orgName.trim() || !orgSlug.trim()) return;
    setCreatingOrg(true);
    try {
      const res = await fetch('/api/organisations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgName.trim(), slug: orgSlug.trim(), country: orgCountry.trim() || 'England' }),
      });
      const data = await res.json() as { organisation?: Organisation; error?: string };
      if (!res.ok) {
        showToast('error', data.error ?? 'Failed to create organisation');
      } else {
        showToast('success', `Organisation "${data.organisation?.name}" created`);
        setOrgName('');
        setOrgSlug('');
        setOrgCountry('England');
        setShowCreateForm(false);
        await loadOrgs();
      }
    } catch {
      showToast('error', 'Network error creating organisation');
    } finally {
      setCreatingOrg(false);
    }
  }

  async function handleAssignRole(e: React.FormEvent) {
    e.preventDefault();
    if (!targetUserId.trim()) return;
    setAssigningRole(true);
    try {
      const body: { targetUserId: string; newRole: string; orgId?: string } = {
        targetUserId: targetUserId.trim(),
        newRole,
      };
      if (assignOrgId) body.orgId = assignOrgId;

      const res = await fetch('/api/admin/roles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) {
        showToast('error', data.error ?? 'Failed to assign role');
      } else {
        showToast('success', `Role "${newRole}" assigned successfully`);
        setTargetUserId('');
        setNewRole('student');
        setAssignOrgId('');
      }
    } catch {
      showToast('error', 'Network error assigning role');
    } finally {
      setAssigningRole(false);
    }
  }

  return (
    <main className="flex-1 p-6 md:p-8 overflow-y-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg border ${
            toast.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/15 border-red-500/30 text-red-400'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Super Admin Panel</h1>
          <p className="text-neutral-400 text-sm mt-1">Manage organisations and user roles.</p>
        </div>

        {/* Organisations Section */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Organisations</h2>
            <button
              onClick={() => setShowCreateForm(p => !p)}
              className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors"
            >
              {showCreateForm ? 'Cancel' : '+ New Org'}
            </button>
          </div>

          {/* Inline create form */}
          {showCreateForm && (
            <form onSubmit={handleCreateOrg} className="mb-6 p-4 bg-neutral-800 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white">Create Organisation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">School Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={e => handleOrgNameChange(e.target.value)}
                    placeholder="Oakwood Academy"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Slug</label>
                  <input
                    type="text"
                    value={orgSlug}
                    onChange={e => setOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="oakwood-academy"
                    required
                    pattern="[a-z0-9-]+"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Country</label>
                  <input
                    type="text"
                    value={orgCountry}
                    onChange={e => setOrgCountry(e.target.value)}
                    placeholder="England"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={creatingOrg}
                  className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                >
                  {creatingOrg ? 'Creating...' : 'Create Organisation'}
                </button>
              </div>
            </form>
          )}

          {/* Orgs list */}
          {loadingOrgs ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orgs.length === 0 ? (
            <p className="text-neutral-500 text-sm text-center py-6">No organisations yet.</p>
          ) : (
            <div className="space-y-2">
              {orgs.map(org => (
                <div
                  key={org.id}
                  className="flex items-center justify-between px-4 py-3 bg-neutral-800 rounded-xl"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{org.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{org.slug} &middot; {org.country}</p>
                  </div>
                  <span className="ml-4 text-xs text-neutral-600 shrink-0 font-mono">{org.id.slice(0, 8)}&hellip;</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Role Assignment Section */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">User Role Assignment</h2>
          <form onSubmit={handleAssignRole} className="space-y-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">User ID (Clerk)</label>
              <input
                type="text"
                value={targetUserId}
                onChange={e => setTargetUserId(e.target.value)}
                placeholder="user_2abc..."
                required
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Role</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="school_admin">School Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Organisation (optional)</label>
                <select
                  value={assignOrgId}
                  onChange={e => setAssignOrgId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                >
                  <option value="">None</option>
                  {orgs.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={assigningRole}
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              >
                {assigningRole ? 'Assigning...' : 'Assign Role'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
