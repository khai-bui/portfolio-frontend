import { useEffect, useState } from "react";
import { api } from "../api/client";

const EMPTY = { title: "", description: "", githubUrl: "", demoUrl: "", imageUrl: "" };

export default function Admin({ onExpired }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function handleError(err) {
    if (err.status === 401) return onExpired(); 
    if (err.status === 403) {
      setError("This account has no right to do this.");
    } else {
      setError("Error: " + String(err.message).slice(0, 200));
    }
  }

  async function load() {
    try {
      setProjects(await api.get("/api/projects"));
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
      if (editingId) await api.put(`/api/projects/${editingId}`, form);
      else await api.post("/api/projects", form);
      setForm(EMPTY);
      setEditingId(null);
      await load();
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setError(null);
    setForm({
      title: p.title ?? "",
      description: p.description ?? "",
      githubUrl: p.githubUrl ?? "",
      demoUrl: p.demoUrl ?? "",
      imageUrl: p.imageUrl ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleDelete(p) {
    if (!window.confirm(`Xóa project "${p.title}"?`)) return;
    setError(null);
    try {
      await api.delete(`/api/projects/${p.id}`);
      if (editingId === p.id) cancelEdit();
      await load();
    } catch (err) {
      handleError(err);
    }
  }

  return (
    <main className="site">
      <h2>Projects Management</h2>

      <form onSubmit={handleSubmit} className="form">
        <h3>{editingId ? "Edit project" : "Add project"}</h3>
        <label>
          Title
          <input name="title" value={form.title} onChange={change} required />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={change} rows={3} />
        </label>
        <label>
          GitHub URL
          <input name="githubUrl" value={form.githubUrl} onChange={change} />
        </label>
        <label>
          Demo URL
          <input name="demoUrl" value={form.demoUrl} onChange={change} />
        </label>
        <label>
          Image URL
          <input name="imageUrl" value={form.imageUrl} onChange={change} />
        </label>
        {error && <p className="error-inline">{error}</p>}
        <div className="row">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button type="button" className="secondary" onClick={cancelEdit}>
              Hủy
            </button>
          )}
        </div>
      </form>

      <h3>List ({projects.length})</h3>
      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p className="muted">No project.</p>
      ) : (
        <ul className="admin-list">
          {projects.map((p) => (
            <li key={p.id}>
              <span>{p.title}</span>
              <span className="row">
                <button className="secondary" onClick={() => startEdit(p)}>Sửa</button>
                <button className="danger" onClick={() => handleDelete(p)}>Xóa</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}