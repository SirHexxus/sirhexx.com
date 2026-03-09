---
title: "The Missing A Record: DNS Troubleshooting a Hosting Migration"
date: "2026-03-08"
category: "dev"
excerpt: "A friend and former client called me frustrated — his site was redirecting to the wrong domain after a hosting migration. He'd done everything right. The problem was a missing A record and a DNS panel that doesn't do what its own docs say."
readTime: 7
---

## The Problem

A friend and former client called me yesterday, frustrated. He'd built his own site, done his
research, picked a decent host, migrated everything over — and something was wrong. His new site
would load fine, and then about 15 seconds later it would redirect him to the old site, still live
on iPage, at a different domain entirely.

Not a crash. Not a 404. The new site would appear, and then get yanked away.

He's tech-literate. This wasn't user error. DNS migrations are legitimately annoying, and some
hosts make them needlessly opaque. Here's what we found and how we fixed it.

## The Setup

He was migrating from iPage to Hostinger. If you've never dealt with iPage: they're garbage.
Not "outdated" or "showing their age" — just bad. The kind of bad that comes from being acquired
by Endurance International Group, strip-mined for profit, and left running on fumes with a support
team that clearly has no idea what they're hosting or why. Their control panel looks like it was
designed in 2009 by someone who hated users. Their documentation is wrong. Their DNS tooling is
opaque by design — because confusion keeps customers from leaving.

Do not use iPage. If you're on iPage, leave. If someone you know is on iPage, help them leave.
This post exists partly because of the chaos they leave behind when you do. And if you want out
but have no idea where to start, reach out — I will happily walk you through it, no charge. Getting
people off iPage is a public service and I'm glad to do it.

The migration had a constraint that made it more complex than a straight swap:

- **Old host:** iPage (where the site used to live)
- **New host:** Hostinger (where the site now lives)
- **DNS manager:** ScalaHosting (handling DNS separately, for email continuity)

The reason for the three-way split is straightforward. His email was running through ScalaHosting's
infrastructure. If you move your nameservers to Hostinger mid-migration, you risk breaking email
while DNS propagates. Keeping ScalaHosting in control of DNS and pointing individual records at
Hostinger preserves email continuity. It's the right call. It also means you're managing DNS
records manually rather than using Hostinger's auto-configuration.

## What DNS Actually Does

If you already know how DNS resolution works, skip this section.

DNS is the phone book of the internet. When someone types `example.com` into a browser, their
computer asks a DNS resolver: "what IP address does this domain map to?" The resolver checks a
chain of nameservers — starting from the root, down through the TLD (`.com`), to the authoritative
nameserver for that domain — and gets back an answer. That answer is an **A record**: a mapping
from domain name to IPv4 address.

There are a few record types that matter here:

- **A record** — maps a domain or subdomain to an IPv4 address
- **CNAME record** — maps a subdomain to another domain name (not an IP)
- **MX record** — specifies the mail servers for the domain
- **NS record** — specifies the authoritative nameservers for the domain

For a deeper dive, Cloudflare has a solid explainer: [What is DNS?](https://www.cloudflare.com/learning/dns/what-is-dns/)

## Diagnosis

The symptom was a redirect to the wrong domain. First step: find out what DNS actually says.

```bash
# Check the A record for the apex/root domain
dig example.com A +short

# Check the www subdomain
dig www.example.com +short

# Check MX records (email)
dig example.com MX +short

# Check which nameservers are authoritative
dig example.com NS +short
```

Here's what the records showed:

| Record | Type | Expected | Actual | Status |
|--------|------|----------|--------|--------|
| `example.com` | A | Hostinger IP | (empty) | **Missing** |
| `www.example.com` | CNAME | `connect.hostinger.com` | `connect.hostinger.com` | OK |
| `example.com` | MX | ScalaHosting mail | ScalaHosting mail | OK |
| `example.com` | NS | ScalaHosting NS | ScalaHosting NS | OK |

The `www` subdomain was fine. Email was fine. The apex domain — `example.com` with no prefix —
had no A record at all.

Without an A record on the apex, the domain had nothing to resolve to. But there was a wrinkle:
this domain had been redirecting to a different domain — a `.net` version — for about five years.
That's because I had built and deployed his previous site, and back then the `.com` was configured
to redirect to `.net`. That redirect lived at the HTTP level on iPage's servers, and iPage was
still serving it.

So the sequence was: browser loads the new Hostinger site (briefly, from a cached or recently
resolved IP), then something — a stale DNS cache, a resolver still pointing at iPage, iPage
itself answering queries it shouldn't — served the old `.com` → `.net` redirect, and the browser
followed it. New site, then yank. Every time.

## Root Cause

Two things combined to cause this:

### 1. Missing A record on the apex domain

The `www` subdomain had a CNAME pointing at `connect.hostinger.com`. But `example.com` itself had
no A record telling DNS where to actually go. When a browser follows the chain and hits a dead end,
the behavior is undefined — and in this case, iPage's lingering DNS answered first with a redirect.

### 2. Why you can't use a CNAME on the apex

A natural question: why not just add a CNAME on `example.com` pointing to Hostinger's hostname?
That would make it easy to update later. The answer is the DNS spec says no.

[RFC 1912](https://datatracker.ietf.org/doc/html/rfc1912) (and the underlying RFC 1034) define
that a CNAME record cannot coexist with any other record on the same name. The apex domain always
has SOA and NS records. A CNAME there would conflict with them. This isn't a hosting quirk or a
UI limitation — it's baked into how DNS works. Some DNS providers implement workarounds (Cloudflare
calls theirs CNAME Flattening; others call it ALIAS or ANAME), but those are provider-specific
features, not standard DNS. If you're managing raw zone records, the apex gets an A record.

## The ScalaHosting Quirk

ScalaHosting's knowledge base says to use `@` to represent the root/apex domain in their zone
editor. Makes sense — `@` is the conventional shorthand for the zone origin in DNS zone files.

Their zone editor rejects it.

Not with a helpful error message. Just silently fails, or throws a vague validation error depending
on which part of the UI you're in. After some trial and error, here's what actually works:

| Input | Works? |
|-------|--------|
| `@` | No (despite docs) |
| *(blank / empty)* | No |
| `example.com` (full domain, no dot) | **Yes** |
| `example.com.` (trailing dot) | No |

If you're using ScalaHosting for DNS management and you need to add an apex record, use the full
domain name without a trailing dot. Don't trust their own documentation on this one.

## The Fix

Add an A record pointing the root domain to Hostinger's edge IP.

Hostinger uses shared Google Cloud infrastructure for their edge. The IP (`34.120.137.41`) resolves
from `connect.hostinger.com` and is the same for all Hostinger customers — it's not
account-specific, so it's safe to use directly in a zone file.

| Record | Type | Value | TTL |
|--------|------|-------|-----|
| `example.com` | A | `34.120.137.41` | 3600 |

One record. That's it.

## Monitoring Propagation

Once the record was added, the next step was waiting for DNS to propagate and confirming it
actually resolved correctly. I used Claude Code's `/loop` feature to set up a `dig` polling loop
with a 2-minute interval:

```bash
# Poll every 2 minutes until the A record shows the correct IP
while true; do
  RESULT=$(dig example.com A +short)
  echo "$(date '+%H:%M:%S') — $RESULT"
  if [[ "$RESULT" == "34.120.137.41" ]]; then
    echo "Propagated."
    telegram-send "example.com A record resolved: $RESULT"
    break
  fi
  sleep 120
done
```

> *Aside: `telegram-send` is a custom Claude Code skill I built — it lets Claude notify me via
> Telegram when a task completes. Genuinely one of the more useful things I've set up. When you're
> waiting on something with a variable propagation window, getting a push notification beats
> refreshing a terminal.*

Got the Telegram notification about 30 minutes later. The site loaded correctly on the first try.

## Lessons

A few things worth writing down for next time:

**Always audit the apex and `www` independently.** They're separate DNS entries. A working `www`
doesn't mean the root domain is configured. Check both.

**CNAME on the apex is forbidden by spec, not convention.** If you're trying to figure out why
the zone editor won't let you add a CNAME at the root, it's not a bug. It's RFC 1034. Use an A
record (or an ALIAS/ANAME if your provider supports it).

**Host documentation may not match host UI.** ScalaHosting's docs said `@`. Their UI rejected it.
When the docs and the UI disagree, the UI wins. Test the alternatives.

**iPage leaves sites live after migrations.** If your old host is still answering DNS queries for
your domain after you've moved, and you don't have an A record on your new DNS to override it,
the old host wins. Clean up your old DNS or add the new records before you expect the migration
to be complete.

**Old HTTP redirects don't disappear when you migrate.** This domain had been redirecting from
`.com` to `.net` for five years — an HTTP-level redirect, still live on iPage's servers.
Even after the DNS migration, anything that resolved the apex to iPage's IP (cached entries,
stale resolvers) would hit that redirect and get bounced. The A record fix resolved the DNS
gap, which cut off iPage's ability to answer for the domain. The redirect died with it.

**TTL affects propagation time.** DNS records are cached by resolvers for their TTL duration.
If your TTL is set to 86400 (24 hours) before a migration, resolvers may serve stale records for
up to a day after you update them. Lower your TTL to 300–600 seconds a day or two before any
planned DNS change, then raise it again after propagation confirms.

The whole thing took about 45 minutes. Most of that was reading ScalaHosting's zone editor UI
and figuring out that `@` doesn't actually work. The fix itself was one record.

DNS issues tend to feel mysterious because the feedback loop is slow and the tooling is spread
across three different control panels managed by three different companies. But the underlying
system is logical. `dig` is honest. Trust the output, not the dashboards.
