/**
 * Tests for EditJobDrawer focused on the migration-fallback path.
 *
 * EditJobDrawer.tsx:114-125 — when the reply_tracking migration hasn't
 * been applied yet, PostgREST returns code 42703 ("column does not
 * exist"). The drawer retries with a base payload that omits the new
 * columns, and surfaces a toast warning. This test covers:
 *
 *   1. Happy path — full update succeeds; both salary_low and reply
 *      tracking fields are passed through.
 *   2. Migration fallback — first update returns 42703, second update
 *      with base-only payload succeeds, toast.warning fires.
 *   3. Validation guard — empty company or title aborts before any
 *      Supabase call.
 *
 * Per the 2026-04-29 cleanup plan (S9 — youngalgy.vercel.app Code
 * Standards: ≥1 test per critical-path file). This is the deferred
 * test originally noted as the highest-cost test setup gap.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { Job } from "@/lib/types";

// --- Mocks set BEFORE the component import so they bind to the SUT's references ---

const updateSpy = vi.fn();
const eqSpy = vi.fn();
const fromSpy = vi.fn(() => ({ update: updateSpy }));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (table: string) => fromSpy(table),
  },
}));

const toastSuccess = vi.fn();
const toastError = vi.fn();
const toastWarning = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: (msg: string) => toastSuccess(msg),
    error: (msg: string) => toastError(msg),
    warning: (msg: string) => toastWarning(msg),
  },
}));

// Import AFTER mocks so the component's `import { supabase } from "@/lib/supabase"`
// resolves to the mock above.
import { EditJobDrawer } from "@/components/EditJobDrawer";

const baseJob: Job = {
  id: "abc123",
  company: "AdeptID",
  position: "Healthcare Recruiter",
  location: "United States (Remote)",
  salary: "$65,000",
  salaryRaw: 65000,
  status: "applied",
  appliedDate: "2026-04-29T05:30:00Z",
  notes: "Submitted with youngalgy@gmail.com",
  url: "https://www.linkedin.com/jobs/view/4407170012/",
  source: "linkedin",
  score: 9,
  firstReplyAt: null,
  replyKind: null,
};

/** Wire up update().eq() to return the given supabase response. */
function setSupabaseResponses(...responses: Array<{ error: { code?: string } | null }>) {
  // Each call to update() should return an object with eq() that returns one of our responses.
  let i = 0;
  updateSpy.mockReset();
  eqSpy.mockReset();
  fromSpy.mockReset();
  fromSpy.mockImplementation(() => ({ update: updateSpy }));
  updateSpy.mockImplementation(() => ({
    eq: (...args: unknown[]) => {
      eqSpy(...args);
      const r = responses[i] ?? responses[responses.length - 1] ?? { error: null };
      i += 1;
      return Promise.resolve(r);
    },
  }));
}

beforeEach(() => {
  toastSuccess.mockClear();
  toastError.mockClear();
  toastWarning.mockClear();
});

describe("EditJobDrawer — happy path", () => {
  it("posts the full update including reply tracking fields and calls onSaved", async () => {
    setSupabaseResponses({ error: null });
    const onClose = vi.fn();
    const onSaved = vi.fn();

    render(<EditJobDrawer job={baseJob} onClose={onClose} onSaved={onSaved} />);
    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => expect(toastSuccess).toHaveBeenCalledWith("Saved"));

    expect(fromSpy).toHaveBeenCalledWith("opportunities");
    expect(updateSpy).toHaveBeenCalledTimes(1);
    const payload = updateSpy.mock.calls[0][0];
    expect(payload).toMatchObject({
      company: "AdeptID",
      title: "Healthcare Recruiter",
      salary_low: 65000,
      source: "linkedin",
      status: "applied",
    });
    // Reply tracking fields should be present even if null (full payload).
    expect(payload).toHaveProperty("first_reply_at", null);
    expect(payload).toHaveProperty("reply_kind", null);

    expect(eqSpy).toHaveBeenCalledWith("id", "abc123");
    expect(toastWarning).not.toHaveBeenCalled();
    expect(toastError).not.toHaveBeenCalled();
    expect(onSaved).toHaveBeenCalledWith("abc123", expect.objectContaining({ company: "AdeptID" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("EditJobDrawer — migration-not-applied fallback (PostgREST 42703)", () => {
  it("retries with base payload (no reply fields) when first update returns 42703", async () => {
    setSupabaseResponses({ error: { code: "42703" } }, { error: null });
    const onClose = vi.fn();
    const onSaved = vi.fn();

    // Use a job WITH a reply timestamp so the warning toast fires
    // (it only fires when reply data was attempted but skipped).
    const jobWithReply: Job = {
      ...baseJob,
      firstReplyAt: "2026-04-29T18:00:00Z",
      replyKind: "rejection",
    };
    render(<EditJobDrawer job={jobWithReply} onClose={onClose} onSaved={onSaved} />);
    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => expect(toastSuccess).toHaveBeenCalledWith("Saved"));

    // Two updates: full payload first, base-only payload on retry.
    expect(updateSpy).toHaveBeenCalledTimes(2);

    const fullPayload = updateSpy.mock.calls[0][0];
    expect(fullPayload).toHaveProperty("first_reply_at");
    expect(fullPayload).toHaveProperty("reply_kind");

    const retryPayload = updateSpy.mock.calls[1][0];
    expect(retryPayload).not.toHaveProperty("first_reply_at");
    expect(retryPayload).not.toHaveProperty("reply_kind");
    expect(retryPayload).toMatchObject({
      company: "AdeptID",
      status: "applied",
    });

    // Warning surfaces because reply fields were attempted on a 42703 retry.
    expect(toastWarning).toHaveBeenCalledTimes(1);
    expect(toastWarning.mock.calls[0][0]).toMatch(/migration not yet applied/i);

    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not warn on 42703 retry when no reply fields were set", async () => {
    setSupabaseResponses({ error: { code: "42703" } }, { error: null });
    const onClose = vi.fn();
    const onSaved = vi.fn();

    // baseJob has firstReplyAt=null and replyKind=null → no warning expected.
    render(<EditJobDrawer job={baseJob} onClose={onClose} onSaved={onSaved} />);
    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => expect(toastSuccess).toHaveBeenCalledWith("Saved"));

    expect(updateSpy).toHaveBeenCalledTimes(2);
    expect(toastWarning).not.toHaveBeenCalled();
  });
});

describe("EditJobDrawer — validation guard", () => {
  it("aborts before any Supabase call when company is empty", async () => {
    setSupabaseResponses({ error: null });
    const onClose = vi.fn();
    const onSaved = vi.fn();

    render(<EditJobDrawer job={baseJob} onClose={onClose} onSaved={onSaved} />);
    // Clear the company field via fireEvent.change.
    const companyInput = screen.getByLabelText(/^company$/i);
    fireEvent.change(companyInput, { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith("Company and title required"),
    );

    expect(updateSpy).not.toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
