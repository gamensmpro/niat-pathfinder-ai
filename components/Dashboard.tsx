
async function deleteStudent(id: string) {
  const confirmed = window.confirm(
    "Are you sure you want to permanently delete this student lead?"
  );

  if (!confirmed) return;

  setDeletingId(id);
  setError("");

  try {
    const response = await fetch(
      `/api/admin/students/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || "Unable to delete student"
      );
    }

    // Immediately remove deleted student from the UI
    setData((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        leads: previous.leads.filter(
          (lead) => lead.id !== id
        ),
      };
    });

    // Fetch updated analytics from Supabase
    await loadDashboard();

    setError("");

  } catch (e: unknown) {
    setError(
      e instanceof Error
        ? e.message
        : "Unable to delete student."
    );
  } finally {
    setDeletingId(null);
  }
}
