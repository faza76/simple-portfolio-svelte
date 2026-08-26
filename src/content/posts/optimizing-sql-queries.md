---
title: "Optimizing SQL Queries for Real-time Hospital Systems"
date: "Oct 24, 2024"
category: "Healthcare Informatics"
description: "Analyzing the execution plans of complex join operations in legacy EHR databases, and the index-tuning and memory-optimization strategies that keep patient-monitoring dashboards under a second."
tags: ["SQL Server", "Performance", "EHR", "Indexing"]
author: "SYS_ARCHITECT"
readingTime: "8 min"
featured: true
image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfdMKQpw_d5XorfEXgGYABmLrr6ZxAuJD7ws98yD_IkIkSmGsqLZbVlCFYNj2IKgttV9wF-09poDchZeYS5It3S5d3RItEor5yzIprNj5OfeTxwkCqfswA791pmb0837RILNu9cMCVmkcPDHDDYsFt0b7-K9rwzhe0EUHGyjVJjpmrnM13cRWjSIiTITEyJw5Q17yALNocXoUtRNcukHaqgF2qO1Bnvo1GOQq-pDT8GF9tZLOdT5A"
alt: "A highly detailed industrial server room rendered in a pristine, clinical white and deep slate palette."
---

Hospital information systems live in a peculiar tension. The same database that drives the
admissions desk, the pharmacy, and the billing department must also serve the telemetry
dashboard above a bed in the ICU — where a delayed query is not an inconvenience, it is a
clinical risk. This post walks through the diagnosis and remediation of one such case.

## The symptom

The offending query joined four tables across a legacy EHR schema:

```sql
SELECT TOP 50
       v.PatientId,
       v.Reading,
       v.RecordedAt,
       p.FullName,
       w.BedLabel
FROM   Vitals v
JOIN   Patients p  ON p.PatientId = v.PatientId
JOIN   Admissions a ON a.AdmissionId = v.AdmissionId
JOIN   Wards w      ON w.WardId = a.WardId
WHERE  w.WardId = @WardId
ORDER BY v.RecordedAt DESC;
```

On paper, innocent. In production, the execution plan revealed a **clustered index scan** on
`Vitals` followed by a hash match, reading tens of millions of rows to satisfy a `TOP 50`.

## The diagnosis

The plan's cost was concentrated in three places:

1. A missing covering index on `Vitals(WardId, RecordedAt DESC)`.
2. An implicit conversion on `PatientId` — `int` joined to `bigint`.
3. Statistics so stale they believed the table held 2008's row count.

> An execution plan is an honest report. It will tell you exactly which assumption it made
> was wrong; you only have to be willing to read it.

## The remedy

A composite index aligned with the predicate and sort order collapsed the scan into a seek:

```sql
CREATE NONCLUSTERED INDEX IX_Vitals_Ward_Recent
  ON Vitals (WardId, RecordedAt DESC)
  INCLUDE (PatientId, Reading);
```

After aligning the join types (`bigint` to `bigint`) and running `UPDATE STATISTICS`, the
`TOP 50` seek returned in **11 ms**, down from a p99 of **2.4 seconds**.

## Lessons reinforced

- **Read the plan before the query.** The optimizer is correct about the facts it has; the
  bug is almost always in the facts it was given.
- **Implicit conversions are silent killers.** A type mismatch on a join column rewrites
  a seek as a scan with no warning.
- **Statistics are infrastructure.** Treat them like any other dependency — versioned,
  monitored, and refreshed on a schedule, not on a prayer.

The ICU dashboard now paints vitals in under a quarter-second end-to-end. The index is small,
the query is unchanged, and the only remaining trace of the incident is a runbook entry and
a quieter pager.
