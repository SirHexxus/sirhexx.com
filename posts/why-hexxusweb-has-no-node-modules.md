---
title: "Why hexxusweb.com Has No node_modules"
date: "2026-02-26"
category: "dev"
excerpt: "A professional services site built in pure HTML, CSS, and vanilla JS — no framework, no build step, no dependency rot. Here's why that was the right call."
readTime: 6
---

## The short answer

It's a marketing site. It doesn't need React.

That's it. That's the post. But since you're still here, let me explain the reasoning behind it, because "we didn't use a framework" is the kind of choice that sounds lazy until you think about it carefully, at which point it starts to sound like the only sensible option.

## What hexxusweb.com actually is

[hexxusweb.com](https://hexxusweb.com) is my professional services site — web development, IT consulting, server infrastructure. Five sections, a contact form, a portfolio. It doesn't fetch data. It doesn't manage state. It doesn't have authenticated routes or real-time updates or any of the other things that justify pulling in a JavaScript framework.

It has a hero, some cards, and a form that sends an email.

## The case against a framework here

Every framework you add to a project is a bet. You're betting that the complexity it introduces — the build toolchain, the dependency tree, the opinionated file structure, the upgrade cycle — will pay off in productivity and capability over the life of the project.

For a simple content site, that bet doesn't pay.

Here's what you get with a React site that you don't get with an HTML file:

- A `node_modules` directory with several hundred packages, most of which you've never heard of, some of which will have CVEs
- A build step that can break
- A bundler with configuration you'll eventually have to touch
- Framework version upgrades that occasionally break things in ways that require you to read changelogs
- JavaScript that has to download, parse, and execute before your users see a rendered page

None of that is a problem on a sufficiently complex application. On a five-section portfolio site, it's all overhead.

## What the vanilla stack actually looks like

This isn't "just throw some CSS in a `<style>` tag and call it a day." The architecture is organized.

CSS is split across a deliberate file hierarchy: `reset.css` → `variables.css` → `base.css` → `layout.css` → component files → `utilities.css`. Design tokens live in `:root` as CSS custom properties. BEM naming throughout. The same discipline you'd bring to a React project — just without the module bundler managing it.

The JavaScript is equally structured. Components (`navigation.js`, `scrollReveal.js`, `contactForm.js`), utilities (`dom.js`, `validate.js`), a service layer (`contactApi.js`), and a `main.js` that initializes everything. Each file starts with `'use strict'`. Functions are named and organized by responsibility.

The navigation handles hamburger toggle, header shrink on scroll, and scroll-spy — all without jQuery, all about 100 lines. The scroll reveal uses `IntersectionObserver`. The contact form validates inputs and posts to an API endpoint.

It's not simpler because it skipped a framework. It's simpler because the problem didn't require one.

## The longevity argument

HTML, CSS, and JavaScript are stable. The HTML I wrote for hexxusweb.com will render correctly in a browser in 2035. CSS custom properties aren't going anywhere. Vanilla JS doesn't have breaking major versions.

React 18 will not exist in 2035. Something else will. And if hexxusweb.com were a React site, I'd have to either keep up with the upgrade cycle or accept an increasingly stale dependency tree. For a professional services site that exists to convert visitors into clients, neither option is great.

## Why sirhexx.com is different

This site — the one you're reading now — is built with Next.js. That's not a contradiction.

sirhexx.com has a blog. The blog has posts written in Markdown. New posts should show up without editing HTML by hand. The build system needs to read `.md` files, parse frontmatter, convert Markdown to HTML, and generate static pages at build time. That's exactly what Next.js with `gray-matter` and `remark` is for.

The tool changed because the problem changed. hexxusweb.com is a brochure. sirhexx.com is a publishing system. Same owner, different requirements, different stacks.

## The actual rule

Use the right tool for the job. When the job is "display content and handle one form," the right tools are HTML, CSS, and a few hundred lines of vanilla JavaScript. When the job is "manage a content pipeline and generate pages from structured data," the right tool is something with a build step.

The instinct to reach for a framework first, then figure out if you need it, is understandable — frameworks are comfortable, well-documented, and what most job postings mention. But comfort isn't architecture. The best infrastructure is the one that does the job with the minimum viable complexity. That's true in a homelab and it's true in a codebase.

hexxusweb.com loads fast, has no dependencies to update, and will work correctly as long as browsers exist. That's a good outcome.
