import { useEffect, useState } from "react";
import { api } from "../api/client";

const PROFILE_PATH = "/api/profile";

const FIELDS = [
  ["name", "Name"],
  ["headline", "Headline (Example: Java Backend Intern)"],
  ["location", "Location"],
  ["email", "Email"],
  ["github", "GitHub URL"],
  ["linkedin", "LinkedIn URL"],
];

export default function AdminProfile({ onExpired }) {
  const [form, setForm] = useState(null);
  const [profileId, setProfileId] = useState(null); // null = no profile in the database yet
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleError(err) {
    if (err.status === 401) return onExpired();
    if (err.status === 403) setError("This account has no permission to do this.");
    else setError("Something went wrong: " + String(err.message).slice(0, 200));
  }

  useEffect(() => {
    api
      .get(PROFILE_PATH)
      .then((data) => {
        // The API returns a list; an empty list means no profile exists yet
        const p = (Array.isArray(data) ? data[0] : data) ?? {};
        setProfileId(p.id ?? null);
        setForm({
          name: p.name ?? "",
          headline: p.headline ?? "",
          location: p.location ?? "",
          email: p.email ?? "",
          github: p.github ?? "",
          linkedin: p.linkedin ?? "",
          bio: p.bio ?? "",
        });
      })
      .catch(handleError);
  }, []);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (profileId) {
        await api.put(`${PROFILE_PATH}/${profileId}`, form);
      } else {
        const created = await api.post(PROFILE_PATH, form);
        setProfileId(created?.id ?? null);
      }
      setSaved(true);
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  }

  if (!form)
    return (
      <main className="container">
        {error ? <p className="error-inline">{error}</p> : <p>Loading...</p>}
      </main>
    );

  return (
    <main className="site">
      <h2>{profileId ? "Edit Profile" : "Create Profile"}</h2>
      <form onSubmit={handleSubmit} className="form">
        {FIELDS.map(([name, label]) => (
          <label key={name}>
            {label}
            <input name={name} value={form[name]} onChange={change} />
          </label>
        ))}
        <label>
          Info (bio)
          <textarea name="bio" value={form.bio} onChange={change} rows={5} />
        </label>
        {error && <p className="error-inline">{error}</p>}
        {saved && <p className="ok">Saved.</p>}
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </main>
  );
}