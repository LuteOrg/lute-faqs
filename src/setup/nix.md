# Can I deploy Lute on NixOS?

Yes, you can deploy Lute on NixOS by creating a dedicated Nix module. This approach encapsulates the application's configuration and dependencies, making it easy to manage.

## Installation

### 1. Create the Lute Module

First, create a new file named `lute.nix` in your NixOS configuration directory (e.g., `/etc/nixos/lute.nix`). This file defines all the necessary packages and the systemd service for Lute.

```nix
# /etc/nixos/lute.nix

{
  config,
  lib,
  pkgs,
  ...
}: let
  cfg = config.services.lute;

  python = pkgs.python311;
  pythonPackages = python.pkgs;

  platformdirs-pinned = let
    pname = "platformdirs";
    version = "3.11.0";
  in
    pythonPackages.buildPythonApplication {
      inherit pname version;
      format = "pyproject";
      src = pkgs.fetchPypi {
        inherit pname version;
        hash = "sha256-z47lKjr9uWUHLcxlJDPgx+PkDPXqFHfNSzsdLrdUlbM=";
      };
      nativeBuildInputs = with pythonPackages; [
        hatchling
        hatch-vcs
      ];
      meta = with pkgs.lib; {
        description = "A small library for determining appropriate platform-specific dirs";
        homepage = "https://github.com/platformdirs/platformdirs";
        license = licenses.mit;
      };
    };

  waitress-pinned = let
    pname = "waitress";
    version = "2.1.2";
  in
    pythonPackages.buildPythonApplication {
      inherit pname version;
      format = "pyproject";
      src = pkgs.fetchPypi {
        inherit pname version;
        hash = "sha256-eApAgsX7wP3movz+Xibm78Ho9CVzCGPAQIV2l4H1Hro=";
      };
      nativeBuildInputs = with pythonPackages; [
        setuptools
      ];
      meta = with pkgs.lib; {
        description = "A production-quality pure-Python WSGI server";
        homepage = "https://github.com/Pylons/waitress";
        license = licenses.mit;
      };
    };

  chardet-pkg = let
    pname = "chardet";
    version = "5.2.0";
  in
    pythonPackages.buildPythonApplication {
      inherit pname version;
      format = "pyproject";
      src = pkgs.fetchPypi {
        inherit pname version;
        hash = "sha256-Gztv9HmoxBS8P6LAhSmVaVxKAm3NbQYzst0JLKOcHPc=";
      };
      nativeBuildInputs = with pythonPackages; [
        setuptools
      ];
      meta = with pkgs.lib; {
        description = "Universal character encoding detector for Python";
        homepage = "https://github.com/chardet/chardet";
        license = licenses.lgpl21Only;
      };
    };

  subtitle-parser-pkg = let
    pname = "subtitle_parser";
    version = "2.0.1";
  in
    pythonPackages.buildPythonApplication {
      inherit pname version;
      format = "pyproject";
      src = pkgs.fetchPypi {
        inherit pname version;
        hash = "sha256-EhWQdYbG/72979WcDuTzUCam2tbPh5CPP0pwsbtZ41M=";
      };
      nativeBuildInputs = with pythonPackages; [
        poetry-core
      ];
      propagatedBuildInputs = with pythonPackages; [
        chardet-pkg
        future
      ];
      meta = with pkgs.lib; {
        description = "A Python library for parsing subtitle files";
        homepage = "https://github.com/emre/subtitle-parser";
        license = licenses.mit;
      };
    };

  openepub-pkg = let
    pname = "openepub";
    version = "0.0.9";
  in
    pythonPackages.buildPythonApplication {
      inherit pname version;
      format = "pyproject";
      src = pkgs.fetchPypi {
        inherit pname version;
        hash = "sha256-qki9VVUn/zMXIkzQ+Zu5D3CXGpBbO97xRVfttYMrR9s=";
      };
      nativeBuildInputs = with pythonPackages; [
        hatchling
      ];
      propagatedBuildInputs = with pythonPackages; [
        beautifulsoup4
        xmltodict
      ];
      meta = with pkgs.lib; {
        description = "A simple epub parser";
        homepage = "https://github.com/gaohongnan/openepub";
        license = licenses.mit;
      };
    };

  natto-py-pkg = let
    pname = "natto-py";
    version = "1.0.1";
  in
    pythonPackages.buildPythonApplication {
      inherit pname version;
      format = "setuptools";
      src = pkgs.fetchPypi {
        inherit pname version;
        hash = "sha256-dgEDuzlyMu4DPJkk0TV+MrFCu+Ey/GpDuM+C3WtlToY=";
      };
      nativeBuildInputs = [pkgs.mecab];
      propagatedBuildInputs = with pythonPackages; [cffi];

      meta = with pkgs.lib; {
        description = "A Python wrapper for MeCab";
        homepage = "https://github.com/buruzaemon/natto-py";
        license = licenses.bsd3;
      };
    };

  jaconv-pkg = let
    pname = "jaconv";
    version = "0.3.4";
  in
    pythonPackages.buildPythonApplication {
      inherit pname version;
      format = "setuptools";
      src = pkgs.fetchPypi {
        inherit pname version;
        hash = "sha256-nnxV8/Cw4tutYvbJ+gww/G//27eCl5VVCdkIVrOjHW0=";
      };
      meta = with pkgs.lib; {
        description = "A Japanese character converter";
        homepage = "https://github.com/ikegami-yukino/jaconv";
        license = licenses.mit;
      };
    };

  lute-pkg = let
    pname = "lute3";
    version = "3.10.1";
  in
    pythonPackages.buildPythonApplication {
      inherit pname version;
      format = "pyproject";

      src = pkgs.fetchPypi {
        inherit pname version;
        hash = "sha256-gqwoyINuP54ve6R2OonLUT2oZYmpjvUopyWbJ+stJrE=";
      };

      nativeBuildInputs = with pythonPackages; [
        flit-core
      ];

      propagatedBuildInputs = with pythonPackages; [
        flask
        flask-sqlalchemy
        sqlalchemy
        pyyaml
        flask-wtf
        platformdirs-pinned
        requests
        beautifulsoup4
        toml
        waitress-pinned
        openepub-pkg
        pyparsing
        pypdf
        subtitle-parser-pkg
        ahocorapy
        natto-py-pkg
        jaconv-pkg
      ];

      postInstall = ''
        mkdir -p $out/${python.sitePackages}/lute/data
      '';

      meta = with pkgs.lib; {
        description = "A language learning web application (v3)";
        homepage = "https://github.com/LuteOrg/lute-v3";
        license = licenses.mit;
      };
    };
in {
  options.services.lute = {
    enable = lib.mkEnableOption "enable lute language server";

    package = lib.mkOption {
      type = lib.types.package;
      default = lute-pkg;
      description = "The Lute package to use for the service.";
    };

    dataDir = lib.mkOption {
      type = lib.types.path;
      default = "/var/lib/lute/data";
      description = "Directory to store Lute's database and user files.";
    };

    backupDir = lib.mkOption {
      type = lib.types.path;
      default = "/var/lib/lute/backup";
      description = "Directory where Lute will store its backups.";
    };

    port = lib.mkOption {
      type = lib.types.port;
      default = 5006;
      description = "Port for Lute to listen on.";
    };

    openFirewall = lib.mkOption {
      type = lib.types.bool;
      default = false;
      description = "Whether to automatically open the configured port in the firewall.";
    };
  };

  config = lib.mkIf cfg.enable {
    environment.etc."lute.yml" = {
      text = ''
        # Lute configuration file, managed by NixOS.
        ENV: prod
        DBNAME: lute.db
        DATAPATH: ${cfg.dataDir}
        BACKUP_PATH: ${cfg.backupDir}
        MECAB_DICPATH: "${pkgs.mecab}/lib/mecab/dic/ipadic"
      '';
    };

    users.users.lute = {
      isSystemUser = true;
      group = "lute";
      description = "Lute service user";
    };
    users.groups.lute = {};

    systemd.tmpfiles.rules = [
      "d '${cfg.dataDir}' 0755 lute lute -"
      "d '${cfg.backupDir}' 0755 lute lute -"
    ];

    systemd.services.lute = {
      description = "Lute V3 Language Server";
      after = ["network-online.target"];
      wants = ["network-online.target"];
      wantedBy = ["multi-user.target"];

      serviceConfig = {
        User = "lute";
        Group = "lute";
        ExecStart = "${cfg.package}/bin/lute --port ${toString cfg.port} --config /etc/lute.yml";
        Type = "simple";
        Restart = "on-failure";
        RestartSec = "5s";
        WorkingDirectory = cfg.dataDir;
      };
    };

    networking.firewall.allowedTCPPorts = lib.mkIf cfg.openFirewall [cfg.port];
  };
}
```

### 2. Import and Enable the Module

Next, open your main `configuration.nix` file and import the `lute.nix` module. Then, enable and configure the service.

```nix
# /etc/nixos/configuration.nix

{ config, pkgs, ... }:

{
  imports =
    [ 
      ./hardware-configuration.nix
      ./lute.nix  # <-- IMPORT THE MODULE
    ];

  # ... other configuration ...

  # 2. ENABLE AND CONFIGURE THE LUTE SERVICE
  services.lute = {
    enable = true;
    # dataDir = "/var/lib/lute/data"; # Optional: Change the default data directory
    # backupDir = "/var/lib/lute/backup"; # Optional: Change the default backup directory 
    # port = 5006; # Optional: Change the default port
    # openFirewall = true; # Optional: Open the port in the firewall
  };

  # ... other configuration ...
}
```

### 3. Rebuild Your System

Finally, apply the new configuration by running the standard rebuild command:

```bash
sudo nixos-rebuild switch
```

NixOS will build and install Lute and its dependencies, and the service will start automatically. You can then access Lute at `http://localhost:5006` (or the custom port you configured).

## Updating Lute

Because the version is pinned in the module for reproducibility, you must update it manually when a new version is released.

1. **Update Version**: Find the latest version number on the Lute PyPI page. Open your `/etc/nixos/lute.nix` file and update the `version` string in the `lute-pkg` definition.

2. **Update Hash**: Run `sudo nixos-rebuild switch`. The build will fail because the hash for the new version is incorrect. The error message will provide the correct hash. Look for a line that says `got: sha256-...` and copy the new hash.

3. **Finalize**: Paste the new hash into the `hash` attribute for `lute-pkg` in `lute.nix` and run `sudo nixos-rebuild switch` one more time. The build will now succeed, and your Lute service will be updated.
