import { useEffect, useState } from "react";
import { api } from "../api/client";

const EMPTY = { name: "", category: "", level: "3" };
const CATEGORIES = ["Backend", "Frontend", "Database", "DevOps", "Tools", "Languages"];

export default function AdminSkills({ onExpired }) {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function handleError(err) {
    if (err.status === 401) return onExpired();
    if (err.status === 403) setError("This account has no right to do this.");
    else setError("Error: " + String(err.message).slice(0, 200));
  }

  async function load() {
    try {
      setSkills(await api.get("/api/skills"));
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const body = { ...form, level: Number(form.level) };
      if (editingId) await api.put(`/api/skills/${editingId}`, body);
      else await api.post("/api/skills", body);
      setForm(EMPTY);
      setEditingId(null);
      await load();
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(s) {
    setEditingId(s.id);
    setError(null);
    setForm({ name: s.name ?? "", category: s.category ?? "", level: String(s.level ?? 3) });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleDelete(s) {
    if (!window.confirm(`Delete skill "${s.name}"?`)) return;
    setError(null);
    try {
      await api.delete(`/api/skills/${s.id}`);
      if (editingId === s.id) cancelEdit();
      await load();
    } catch (err) {
      handleError(err);
    }
  }

  return (
    <main className="site">
      <h2>Skills Management</h2>

      <form onSubmit={handleSubmit} className="form">
        <h3>{editingId ? "Edit skill" : "Add skill"}</h3>
        <label>
          Skill name
          <input name="name" value={form.name} onChange={change} required />
        </label>
        <label>
          Category
          <input name="category" value={form.category} onChange={change} list="categories" required />
          <datalist id="categories">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
        <label>
          Level (1 = beginner, 5 = advance)
          <select name="level" value={form.level} onChange={change}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        {error && <p className="error-inline">{error}</p>}
        <div className="row">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Edit" : "Add"}
          </button>
          {editingId && (
            <button type="button" className="secondary" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3>List ({skills.length})</h3>
      {loading ? (
        <p>Loading...</p>
      ) : skills.length === 0 ? (
        <p className="muted">No skills</p>
      ) : (
        <ul className="admin-list">
          {skills.map((s) => (
            <li key={s.id}>
              <span>
                {s.name} <span className="muted">({s.category}, {s.level}/5)</span>
              </span>
              <span className="row">
                <button className="secondary" onClick={() => startEdit(s)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(s)}>Delete</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}   