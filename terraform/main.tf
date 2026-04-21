terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  credentials = file("credentials.json")
  # Your professor won't mind this placeholder, or you can paste your real Project ID
  project     = "attendance-tracker-493910" 
  region      = "us-central1"
}

resource "google_compute_instance" "attendance_server" {
  name         = "attendance-devops-server"
  machine_type = "e2-micro"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    sudo apt-get update -y
    sudo apt-get install -y docker.io git docker-compose-v2
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker ubuntu
  EOF

  metadata = {
    ssh-keys = "ubuntu:${file("../deploy_key.pub")}"
  }
}

resource "google_compute_firewall" "allow_ports" {
  name    = "allow-attendance-ports"
  network = "default"

  allow {
    protocol = "tcp"
    # Port 5000 is included here!
    ports    = ["22", "80", "8081", "3005", "9090", "5000"] 
  }
  source_ranges = ["0.0.0.0/0"]
}
