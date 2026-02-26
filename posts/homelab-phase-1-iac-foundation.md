---
title: "Building My Homelab from Code: IaC with Terraform and Ansible"
date: "2026-02-25"
category: "homelab"
excerpt: "How I went from manually clicking through Proxmox menus to provisioning VMs with a single command — and why infrastructure-as-code changed the way I think about my home network."
readTime: 8
---

## The Problem with Clicking

For most of my homelab's life, I ran it like most people do: log into Proxmox, click "Create VM," fill in fields, repeat. It worked. But every time I wanted to rebuild something, or provision a new VM for a lab exercise, I was doing the same manual dance.

Then I'd forget what I did. Or I'd do it slightly differently. The environment was never quite reproducible.

If you're working toward a SOC role or any infrastructure-adjacent career, you'll hear "infrastructure as code" constantly. I decided to actually learn it properly by applying it to my own hardware.

## The Stack

- **Proxmox VE** — hypervisor on my main server (repurposed desktop, 32GB RAM, Ryzen 5)
- **Terraform** with the [bpg/proxmox provider](https://registry.terraform.io/providers/bpg/proxmox/latest) — VM provisioning
- **Ansible** — post-provision configuration management

The general flow: Terraform creates and provisions the VM shell (CPU, RAM, disk, network). Ansible connects over SSH and configures the OS, installs packages, drops config files.

## Why Both?

A fair question. The simple answer: they solve different problems.

**Terraform** is great at declaring *what infrastructure should exist*. Idempotent. State-aware. If I apply the same config twice, it won't create duplicates — it'll compare actual state to desired state and do nothing if they match.

**Ansible** is better at *configuring what's running on that infrastructure*. It's agentless (just SSH), and playbooks are readable YAML that documents what the machine should look like.

## The Terraform Config

Here's a simplified version of what a VM definition looks like:

```hcl
resource "proxmox_virtual_environment_vm" "ubuntu_lab" {
  name      = "ubuntu-lab-01"
  node_name = "pve"

  cpu {
    cores = 2
  }

  memory {
    dedicated = 4096
  }

  disk {
    datastore_id = "local-lvm"
    file_id      = proxmox_virtual_environment_download_file.ubuntu_cloud_image.id
    interface    = "scsi0"
    size         = 20
  }

  initialization {
    ip_config {
      ipv4 {
        address = "192.168.1.50/24"
        gateway = "192.168.1.1"
      }
    }

    user_account {
      username = var.vm_username
      password = var.vm_password
      keys     = [file("~/.ssh/id_ed25519.pub")]
    }
  }
}
```

Cloud-init handles the initial SSH key injection and network config. Terraform just describes the desired state.

## The Ansible Playbook

After Terraform runs and the VM is up:

```yaml
- name: Configure lab VM
  hosts: lab_vms
  become: true

  tasks:
    - name: Update apt cache
      apt:
        update_cache: yes
        cache_valid_time: 3600

    - name: Install base packages
      apt:
        name:
          - curl
          - git
          - vim
          - htop
          - ufw
        state: present

    - name: Enable UFW
      ufw:
        state: enabled
        policy: deny

    - name: Allow SSH
      ufw:
        rule: allow
        port: ssh
```

Playbooks document exactly what's on each machine. Six months from now I can read this and know what's installed. No guessing.

## What I Learned

**State management is the hard part.** Terraform tracks state in a `terraform.tfstate` file. If that gets out of sync with reality (you manually changed something), you're debugging. Lesson: don't manually change things Terraform manages.

**Cloud images are the way.** Using Ubuntu cloud images with cloud-init is dramatically faster than installing from ISO. The VM is up and SSH-accessible in under two minutes.

**Secrets management matters immediately.** I started with vars in plaintext, realized that was bad, moved to `terraform.tfvars` excluded from git, and I'm now looking at Vault for anything more serious.

## What's Next

This is Phase 1. Phase 2 involves:
- DNS (AdGuard Home on a dedicated VM)
- VPN gateway (Tailscale or WireGuard)
- Monitoring (Prometheus + Grafana)
- A proper secrets manager (HashiCorp Vault or SOPS)

The goal is a homelab that can be torn down and rebuilt from scratch with `terraform apply && ansible-playbook`. Reproducible, documented, and something I can actually point to when talking to employers.

All the code lives in [homelab-command](https://github.com/SirHexxus/homelab-command) on GitHub.
