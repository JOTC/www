# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
    config.ssh.private_key_path = "~/.ssh/vagrant"
    config.vm.box = "ubuntu1404-nginx-node-mongo"
    config.vm.network "forwarded_port", guest: 80, host: 8080, autocorrect: true
end
