import React, { useState } from "react";
import API from "../api/axios";
import { Button, Field, Input, Textarea } from "../components/UI";

const Support = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setOk("");
    if (!title || !description) return alert("Fill all fields");
    try {
      setLoading(true);
      await API.post("/grievances", { title, description });
      setOk("Ticket submitted. We'll get back soon.");
      setTitle("");
      setDescription("");
    } catch {
      alert("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section center">
      <div className="card form-card maxw-600">
        <h1 style={{ marginTop: 0 }}>Support</h1>
        <form className="form" onSubmit={submit}>
          <Field label="Title">
            <Input
              placeholder="Short summary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Field>
          <Field label="Description">
            <Textarea
              rows={6}
              placeholder="Describe your issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Field>
          <div className="form-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setTitle("");
                setDescription("");
              }}
            >
              Clear
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Submit
            </Button>
          </div>
          {ok && (
            <div
              className="mt-3"
              style={{ color: "var(--success)", fontWeight: 700 }}
            >
              {ok}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default Support;
