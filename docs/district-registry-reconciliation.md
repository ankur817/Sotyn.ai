# District registry — reconciliation

Covers `src/data/locations/districts.json`. Retrieved **2026-09-23**.

## Read this first

**No fully official LGD district export was reachable.** Every district listing on
lgdirectory.gov.in — the primary source and the authority for LGD codes — is behind an image
CAPTCHA. That was not bypassed, so the district **names and LGD codes in this registry did not
come from LGD directly.** They come from the Government of India Open Government Data mirror of
LGD, which is published by the same ministry but is **demonstrably out of date**.

The registry is therefore **partial**, and labelled `"completeness": "partial — see reconciliation"`.
Its *shape* reconciles exactly to LGD's official figures — 36 states/UTs, 784 active districts —
but that agreement was reached by correcting the stale mirror against state gazettes, not by
reading LGD. **11 of the 784 active districts have no LGD code at all.** Treat this as a working
registry that still needs one CAPTCHA-gated download to become authoritative.

## Sources actually used

| # | Source | Used for | Status |
|---|---|---|---|
| 1 | `https://lgdirectory.gov.in/reportonStatewiseEntityDetails.do` — "Report on State wise Administrative Units & Panchayati Raj Institutions" | The **state/UT list** and the **authoritative per-state district counts** (36 states/UTs, 784 districts) | **HTTP 200**, no CAPTCHA |
| 2 | `https://www.data.gov.in/resource/local-government-directory-lgd-districts` — OGD resource `37231365-78ba-44d5-ac22-3deec40b9197`, publisher **Ministry of Panchayati Raj**, `reference_url` `https://lgdirectory.gov.in/` | **District names and LGD codes** (785 rows) | **HTTP 200** via `api.data.gov.in`; resource metadata `updated_date` `2026-09-23T03:02:42Z` |
| 3 | `https://lgdirectory.gov.in/globalviewdistrictforcitizen.do` | State dropdown only — the **36 LGD state codes**, cross-checked against source 2 | **HTTP 200** for the form; the district data behind it is CAPTCHA-gated |
| 4 | State gazettes and official state/UT portals (listed per district below) | Resolving the 9 states where sources 1 and 2 disagreed | Per-case; see table |
| 5 | `https://igod.gov.in` — NIC Integrated Government Online Directory | Corroborating district rosters and the Ahilyanagar rename | **HTTP 200** |

**No non-official mirror was used. No record is `unverified-mirror`. Zero records came from
Wikipedia, a scraped copy or any commercial dataset.**

Note on source 2: `api.data.gov.in` requires an API key. The key used is the one data.gov.in
itself embeds in the public resource page (`field_datafile_url`), not a private credential. The
key is **not** stored in `districts.json`.

## Counts

| Measure | Value |
|---|---|
| Official state/UT count (LGD, source 1) | **36** (28 states + 8 UTs) |
| Official district count (LGD, source 1) | **784** |
| **Active district records imported** | **784** — reconciles exactly, per state |
| Total records in file (incl. abolished/disputed) | 796 |
| Records with a real LGD code | 785 |
| **Records with NO LGD code** (placeholder `PENDING-LGD-…`) | **11** |

Confidence, across all 796 records:

| `geo_confidence` | Records | Meaning |
|---|---|---|
| `cross-checked` | **617** | Two independent official sources agree (LGD count + OGD export, or OGD export + state gazette) |
| `official` | **179** | Official source only, currency not independently confirmed |
| `unverified-mirror` | **0** | — |

The 179 `official` records are the active districts in the nine states where the two sources
disagreed and which were not individually re-verified name-by-name, plus the two disputed
Puducherry records. Each carries a note saying so.

## The core problem: the OGD mirror is stale

The data.gov.in export says it is refreshed monthly, and its metadata timestamp is today. Its
**content is not current.** Compared against LGD's own live counts it is wrong for 9 of 36
states/UTs. In every one of the nine, **LGD was right and the mirror was wrong** — confirmed
case-by-case against state gazettes:

| State/UT | LGD | OGD mirror | What the mirror got wrong | Resolution |
|---|---|---|---|---|
| Rajasthan | 41 | 50 | Still lists 9 districts cancelled by the State Government | 9 records kept with `status: "abolished"` |
| Andhra Pradesh | 28 | 26 | Missing Markapuram, Polavaram | 2 records added, no LGD code |
| Arunachal Pradesh | 27 | 25 | Missing Keyi Panyor, Bichom | 2 records added, no LGD code |
| Delhi | 13 | 11 | Pre-reorganisation list; has Shahdara, missing 3 new districts | Shahdara `abolished`; 3 added, no LGD code |
| Nagaland | 17 | 16 | Missing Meluri | 1 record added, no LGD code |
| Gujarat | 34 | 33 | Missing Vav-Tharad | 1 record added, no LGD code |
| Haryana | 23 | 22 | Missing Hansi | 1 record added, no LGD code |
| Goa | 3 | 2 | Missing Kushavati | 1 record added, no LGD code |
| Puducherry | 2 | 4 | Lists Mahe and Yanam as districts | 2 records set to `status: "disputed"` |

### Districts created recently — added here, with no LGD code

These 11 are real, currently-active districts that LGD counts but the OGD export does not
contain. Because the LGD code is the identity and **no reachable source gives their LGD code**,
each carries an explicit placeholder `PENDING-LGD-<STATE>-<DISTRICT>`. **These placeholders are
not LGD codes and must be replaced** from LGD's district export before any of these records is
treated as canonical.

| District | State/UT | Effective | Official source |
|---|---|---|---|
| Keyi Panyor | Arunachal Pradesh | 2024-02-23 | AP Gazette Extraordinary No. 108 Vol. XXXI, Notification Law/Legn-5/2024 — Arunachal Pradesh (Re-Organisation of Districts) (Amendment) Act, 2024 (Act No. 2 of 2024) |
| Bichom | Arunachal Pradesh | 2024-02-23 | Same Act and gazette as Keyi Panyor |
| Meluri | Nagaland | 2024-11-02 | `ipr.nagaland.gov.in` — notified by the Chief Secretary; 17th district, from Phek |
| Vav-Tharad | Gujarat | 2025-10-02 | `vavtharad.nic.in/about-district/` ("the newly existing thirty-fourth district"); `cmogujarat.gov.in` |
| Hansi | Haryana | 2025-12-22 | `hansi.haryana.gov.in` — 23rd district, from Hisar |
| Markapuram | Andhra Pradesh | 2025-12-31 | G.O.Ms.No. 517, Revenue (Lands.IV), 30.12.2025; G.O.Rt.No. 2498 GAD (SC.A) |
| Polavaram | Andhra Pradesh | 2025-12-31 | G.O.Ms.No. 524, Revenue (Lands.IV), 30.12.2025; G.O.Rt.No. 2498 GAD (SC.A) |
| Old Delhi | Delhi | 2025-12-25 | Notification F.223/SDM-II(HQ)/Land/2025/285; Div. Commissioner order …/306747 |
| Central North | Delhi | 2025-12-25 | Same notification |
| Outer North | Delhi | 2025-12-25 | Same notification |
| Kushavati | Goa | 2025-12-31 | Revenue Dept notification 16/29/1/2023-Rev-I/3259 — from South Goa; HQ Quepem |

### Districts abolished — kept, marked, never published

Retained with their real LGD codes so old URLs and historic records stay resolvable. They are
`status: "abolished"`, are excluded from the 784, and the publication gate refuses to build a
page for any non-active district (enforced by `tests/locations.test.mjs`).

**Rajasthan (9):** Anupgarh (776), Dudu (769), Gangapurcity (771), Jaipur (Gramin) (783),
Jodhpur (Gramin) (778), Kekri (781), Neem Ka Thana (773), Sanchore (779), Shahpura (780).

Authority: Rajasthan Finance Department order **No. F.6(2)FD/Rules/2020 Pt.II dated 30 Jan 2025**,
which revises the area-wise annexure to *"41 districts"*, and the Board of Revenue roster
*"ALL DIVISION & DISTRICTS as on 29-01-2025"*, which enumerates 7 divisions and exactly 41
districts and contains none of the nine names above. The eight Gehlot-era districts that were
**retained** (Balotra, Beawar, Deeg, Didwana-Kuchaman, Khairthal-Tijara, Kotputli-Behror,
Phalodi, Salumbar) remain active in this registry.

**Delhi (1):** Shahdara (671) — removed in the 25 Dec 2025 reorganisation; now a sub-registrar
office under North East.

### Disputed — two official sources contradict each other

**Puducherry: Mahe (599) and Yanam (601).** The OGD LGD export lists both as districts with LGD
codes. The Government of Puducherry's own page states the UT *"comprises of two distinct
districts of Puducherry and Karaikal"*, treating Mahe and Yanam as outlying administrative units;
LGD's own state-wise report likewise counts **2**. Marked `status: "disputed"`, excluded from the
active count, `geo_confidence: "official"`. **Unresolved** — needs LGD's district export to settle.

### Renames — and why counts cannot catch them

**Maharashtra: Ahmednagar → Ahilyanagar** (LGD code 466). The OGD export still carries the old
spelling. `igod.gov.in` lists the district as **Ahilyanagar** among Maharashtra's 36. Corrected
here, with `former_names: ["Ahmednagar"]`.

This is the most important caveat in this document. Maharashtra's district **count matches LGD
exactly**, so the count-based reconciliation that caught the other nine states was blind to it.
It was found by spot-check, not systematically. **Other stale spellings may remain in the 607
`cross-checked` active records.** A rename does not change any count, so nothing in this process
would detect one. Renames already reflected correctly in the export (Chhatrapati Sambhajinagar,
Dharashiv) show it is post-2023, but that is not proof of currency for any other name.

## Duplicate district names across states

Three district names occur in two states each. Slugs are intentionally identical — the state
qualifies them, and the URL is always `/locations/<state-slug>/<district-slug>`, so the pairs
never collide. `getDistrictByCode()` resolves by LGD code, not name.

| Slug | States | Distinct LGD codes |
|---|---|---|
| `bilaspur` | Chhattisgarh, Himachal Pradesh | yes |
| `hamirpur` | Himachal Pradesh, Uttar Pradesh | yes |
| `pratapgarh` | Rajasthan, Uttar Pradesh | yes |

No slug collides *within* a state, and every district code in the file is unique — both enforced
by `tests/locations.test.mjs`.

## Access limitations hit

| Path | Exact blocker |
|---|---|
| `lgdirectory.gov.in/globalviewdistrictforcitizen.do` | HTTP 200, but the form requires an image CAPTCHA. Field label: *"Enter CAPTCHA image code as shown above"*; validation message: *"Please enter the text shown above."*; error text: *"Please Enter CAPTCHA in the textbox"*. **Stopped here — not bypassed, not solved.** |
| `lgdirectory.gov.in/downloadDirectory.do` | HTTP 200. The download form is CAPTCHA-gated (16 references to `captchaAnswer`). This is the export that would have given every district code authoritatively. **Stopped.** |
| `lgdirectory.gov.in/districtWiseDetailReport.do` | HTTP 200, CAPTCHA-gated: *"Enter CAPTCHA in the textbox"*. **Stopped.** |
| `lgdirectory.gov.in/districtWiseLBReport.do`, `aspirationalDistrictWiseVillage.do`, `consolidatePostalReport.do`, `rptDistrictWiseInvalidatedVillage.do`, `exceptionalReportOnStateSelection.do` | All HTTP 200, all CAPTCHA-gated. **Stopped.** |
| `lgdirectory.gov.in/globalviewDistrictForCitizen.do` (capitalised) | **HTTP 404** — the working path is all-lowercase |
| `lgdirectory.gov.in/dwr/interface/lgdDwrInitialService.js` | A DWR remote-procedure endpoint referenced by `showGisView.do`, apparently unauthenticated. **Deliberately not used.** Calling it would be a way around the CAPTCHA that LGD puts on the same data. Recorded, not exercised. |
| `lgdirectory.gov.in/lgd_entity_count.json` | **HTTP 404** (`Lable.badrequesterror`) |
| `www.data.gov.in/files/ogdpv2dms/s3fs-public/datafile/lgd_districts.csv` | **HTTP 403**, zero bytes — the direct CSV is not publicly downloadable |
| `api.data.gov.in` without a key | **HTTP 400** — `{"error": "Authorization field missing"}` |
| `api.data.gov.in` with a truncated key | **HTTP 403** — `{"error": "Key not authorised"}` |
| `rajasthan.gov.in/Districts.aspx?menu_id=5` | HTTP 200 but JS-rendered; no district content in the response body. Unusable. |
| `keyipanyor.nic.in` | `getaddrinfo ENOTFOUND keyipanyor.nic.in` — domain does not resolve |
| `ahilyanagar.nic.in` | `curl: (6) Could not resolve host: ahilyanagar.nic.in` |
| `revenue.delhi.gov.in/.../reorganised_jurisdiction_of_registrars.pdf` | `ETIMEDOUT: connection timed out, read` via fetcher; retrieved at **HTTP 200** via `curl` |
| `gad.ap.gov.in/.../2025gad_39723_rt2498_e.pdf` | `unable to verify the first certificate` via fetcher; retrieved at **HTTP 200** via `curl` |
| `igod.gov.in` listings | Truncate after ~25 rows. Only the explicit totals ("41 Results", "34 Results") were relied on; absence of a name past the cut-off was **not** treated as evidence. |

## Dates I could not verify officially

- **Rajasthan cabinet decision, 28 Dec 2024.** The *outcome* (41 districts) is officially proven
  by the Finance Department order and the Board of Revenue roster. The 28 Dec 2024 decision date
  appears only in press reporting; no official portal copy was retrieved. `source_effective_date`
  for the nine abolished records is therefore set to **2025-01-30**, the date of the order that
  is actually citable.
- **Meluri inauguration date.** The 2 Nov 2024 notification is stated in the IPR Nagaland text and
  is what is recorded. A later inauguration date circulating elsewhere is **unverified** and not used.
- **Vav-Tharad gazette number.** Neither `vavtharad.nic.in` nor `cmogujarat.gov.in` cites a
  notification number. The date and the fact are official; the instrument number is unknown.
- **Why LGD counts Puducherry as 2.** The four-region convention in the OGD export is most likely
  a Census-style split, but that explanation is inference and is **not** recorded as fact.

## What is deliberately absent

- **No sub-districts, tehsils, taluks, blocks or metropolitan regions.** Districts only.
- **No invented districts.** Nothing was added because a well-known city exists. Every one of the
  796 records traces to LGD, the OGD LGD export, or a named state gazette/portal.
- **`aliases` and `former_names` are empty except where officially sourced.** Only
  Ahilyanagar carries a `former_names` entry. No city-inside-a-district aliases were added,
  because no official source for them was reachable without the CAPTCHA-gated LGD export. Empty
  is correct here; guessed aliases would be worse than none.

## To make this authoritative

1. Download LGD's district export from `downloadDirectory.do` or `globalviewdistrictforcitizen.do`
   in a browser session where a human completes the CAPTCHA. That single file resolves almost
   everything below.
2. Replace the **11 `PENDING-LGD-…` placeholder codes** with real LGD codes.
3. Settle **Mahe and Yanam** — district or administrative unit.
4. Run a full **name-by-name diff** against LGD. The count reconciliation cannot detect renames;
   Ahilyanagar proves at least one slipped through, and there may be more.
5. Re-verify the 179 `official` records and promote them to `cross-checked`.

Until step 1 happens, `"completeness"` must stay `"partial — see reconciliation"`. It should not
be changed to `"complete"` on the strength of the 784 total matching — that total was assembled,
not downloaded.
