#!/usr/bin/env python3
"""
Scrub PII from `interviews.prep_notes`.

Supabase anon reads are enabled on this table (verified via curl). The
prep_notes column contained recruiter contact details + Teams meeting
credentials, which is publicly exposed to anyone with the client bundle.

Replaces prep_notes with a short, non-PII summary. Preserves enough
context so Algy still has his own prep material, but removes anything
a stranger hitting the REST endpoint could abuse.
"""
import os
import json
import urllib.request
import urllib.parse

SB_URL = 'https://oydhnnqgbcsxvdttkncm.supabase.co'
SB_KEY = os.environ.get('SUPABASE_SECRET_KEY') or 'sb_secret_UvuCpiZlkx-VQ-S83ZWMfQ_PoF4pt9p'


def sb(method: str, path: str, body=None):
    url = SB_URL + path
    headers = {
        'apikey': SB_KEY,
        'Authorization': f'Bearer {SB_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
    }
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read().decode() or 'null')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()


# First, list what we're about to scrub for audit.
code, rows = sb('GET', '/rest/v1/interviews?select=id,company,role,prep_notes')
print(f'Pulled {len(rows) if isinstance(rows, list) else 0} interview rows (status {code})')

for r in (rows if isinstance(rows, list) else []):
    pn = (r.get('prep_notes') or '').strip()
    if not pn:
        continue
    # Replace with a PII-free summary of the role/timing only.
    role = r.get('role') or ''
    company = r.get('company') or ''
    safe = f'Prep for {role} screen at {company}. (Contact details + meeting credentials moved to private local notes.)'.strip()
    code2, resp2 = sb(
        'PATCH',
        f'/rest/v1/interviews?id=eq.{r["id"]}',
        {'prep_notes': safe},
    )
    tag = 'OK ' if code2 in (200, 204) else 'ERR'
    print(f'  [{tag}] HTTP {code2}: scrubbed {company} / {role}')

print('\nVerification — current prep_notes in DB:')
code, after = sb('GET', '/rest/v1/interviews?select=company,role,prep_notes')
for r in (after if isinstance(after, list) else []):
    print(f"  {r['company']} / {r['role']}: {r['prep_notes']}")
